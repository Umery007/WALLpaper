import { Router } from "express";
import { z } from "zod";
import { query, transaction } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { generateLimiter } from "../middleware/rateLimit.js";
import { generateWallpaperImage, titleFromPrompt } from "../services/gemini.js";
import { getWallpaperById } from "../services/wallpapers.js";
import { loadGeneratedImageForEditing } from "../services/imageEditing.js";
import { chargeOneCredit, getAccountUsage, resolveGenerationCharge } from "../services/usage.js";
import { asyncHandler, paymentRequired } from "../utils/http.js";
import { parseBody } from "../utils/validate.js";

const router = Router();

const generateSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(3, "Descreva o wallpaper que voce quer gerar.")
    .max(1000, "A descricao e longa demais. Resuma em ate 1000 caracteres."),
  // 9:16 = celular (vertical); 16:9 = computador (horizontal).
  aspect_ratio: z.enum(["9:16", "16:9"]).optional().default("9:16"),
  category: z.string().trim().max(60).optional().default("IA"),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).optional().default([]),
  is_public: z.boolean().optional().default(false),
});

const editSchema = z.object({
  wallpaper_id: z.string().uuid("Escolha um wallpaper valido."),
  prompt: generateSchema.shape.prompt,
  aspect_ratio: generateSchema.shape.aspect_ratio,
  category: generateSchema.shape.category,
  tags: generateSchema.shape.tags,
});

async function storeGeneration({ user, charge, prompt, category, tags, isPublic, image }) {
  const wallpaperId = await transaction(async (client) => {
    if (charge.chargeCredit) {
      const remaining = await chargeOneCredit(client, user.id, "image-generation");
      if (remaining === null) {
        throw paymentRequired("Seus creditos acabaram. Compre mais para continuar gerando.");
      }
    }

    const { rows } = await client.query(
      `INSERT INTO wallpapers (user_id, title, description, image_url, category, tags, source, prompt, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, 'ai', $7, $8)
       RETURNING id`,
      [user.id, titleFromPrompt(prompt), prompt, image.storedPath, category, tags, prompt, isPublic],
    );

    await client.query(
      `INSERT INTO generations (user_id, wallpaper_id, prompt, model, charged_credit)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, rows[0].id, prompt, image.model, charge.chargeCredit],
    );

    return rows[0].id;
  });

  const wallpaper = await getWallpaperById(wallpaperId, user.id);
  const usage = await getAccountUsage({
    ...user,
    credits: charge.chargeCredit ? user.credits - 1 : user.credits,
  });
  return { wallpaper, usage };
}

/**
 * POST /api/images/generate
 * Gera um wallpaper com o Gemini, salva o arquivo e registra na galeria.
 * A cobranca (cota mensal ou credito) so acontece se a imagem vier mesmo.
 */
router.post("/generate", requireAuth, generateLimiter, asyncHandler(async (req, res) => {
  const { prompt, aspect_ratio: aspectRatio, category, tags, is_public: isPublic } = parseBody(generateSchema, req.body);
  const charge = await resolveGenerationCharge(req.user);
  if (!charge.allowed) throw paymentRequired(charge.reason);
  // Se isto falhar, nada e gravado e o usuario nao perde credito.
  const image = await generateWallpaperImage(prompt, { aspectRatio });
  const result = await storeGeneration({
    user: req.user,
    charge,
    prompt,
    category,
    tags,
    isPublic,
    image,
  });

  res.status(201).json(result);
}));

/** Edita um wallpaper gerado pela IA sem perder o estilo/conteudo original. */
router.post("/edit", requireAuth, generateLimiter, asyncHandler(async (req, res) => {
  const { wallpaper_id: wallpaperId, prompt, aspect_ratio: aspectRatio, category, tags } = parseBody(editSchema, req.body);
  const sourceImage = await loadGeneratedImageForEditing(wallpaperId, req.user.id);
  const charge = await resolveGenerationCharge(req.user);
  if (!charge.allowed) throw paymentRequired(charge.reason);
  const image = await generateWallpaperImage(prompt, { sourceImage, aspectRatio });
  const result = await storeGeneration({
    user: req.user,
    charge,
    prompt,
    category,
    tags,
    isPublic: false,
    image,
  });
  res.status(201).json(result);
}));

/** Historico de geracoes do usuario. */
router.get("/history", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT g.id, g.prompt, g.model, g.charged_credit, g.created_at,
            w.id AS wallpaper_id, w.image_url, w.title,
            EXISTS (
              SELECT 1 FROM favorites f
              WHERE f.wallpaper_id = w.id AND f.user_id = $1
            ) AS favorited
     FROM generations g
     LEFT JOIN wallpapers w ON w.id = g.wallpaper_id
     WHERE g.user_id = $1
     ORDER BY g.created_at DESC
     LIMIT 100`,
    [req.user.id],
  );
  res.json({ generations: rows });
}));

export default router;
