import { Router } from "express";
import { z } from "zod";
import { query, transaction } from "../db/pool.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import {
  getWallpaperById,
  listUserWallpapers,
  listWallpapers,
  serializeWallpaper,
} from "../services/wallpapers.js";
import { asyncHandler, forbidden, notFound } from "../utils/http.js";
import { streamWallpaperFile } from "../services/download.js";
import { assertPublicHttpsUrl, parseBody } from "../utils/validate.js";

const router = Router();

const paginationSchema = z.object({
  search: z.string().max(120).optional().default(""),
  category: z.string().max(60).optional().default(""),
  limit: z.coerce.number().int().min(1).max(60).optional().default(40),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

/** Galeria publica. Funciona logado ou nao. */
router.get("/", optionalAuth, asyncHandler(async (req, res) => {
  const { search, category, limit, offset } = paginationSchema.parse(req.query);
  const wallpapers = await listWallpapers({
    viewerId: req.user?.id ?? null,
    search,
    category,
    limit,
    offset,
  });
  res.json({ wallpapers, limit, offset });
}));

/** Categorias existentes, para alimentar o filtro da home. */
router.get("/categories", asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT category, COUNT(*)::int AS total
     FROM wallpapers
     WHERE is_public = TRUE AND category <> ''
     GROUP BY category
     ORDER BY total DESC, category ASC`,
  );
  res.json({ categories: rows });
}));

/** Wallpapers criados pelo usuario logado (perfil / historico). */
router.get("/mine", requireAuth, asyncHandler(async (req, res) => {
  const wallpapers = await listUserWallpapers(req.user.id, req.user.id);
  res.json({ wallpapers });
}));

/** Historico de downloads da conta autenticada. */
router.get("/downloads", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT w.id, w.user_id, w.title, w.description, w.image_url, w.category, w.tags,
            w.source, w.prompt, w.downloads, w.created_at,
            u.name AS creator_name, u.username AS creator_username,
            EXISTS (
              SELECT 1 FROM favorites f
              WHERE f.wallpaper_id = w.id AND f.user_id = $1
            ) AS favorited,
            (SELECT COUNT(*)::int FROM favorites f WHERE f.wallpaper_id = w.id) AS favorites_count
     FROM downloads d
     JOIN wallpapers w ON w.id = d.wallpaper_id
     LEFT JOIN users u ON u.id = w.user_id
     WHERE d.user_id = $1
       AND (w.is_public = TRUE OR w.user_id = $1)
     ORDER BY d.created_at DESC
     LIMIT 120`,
    [req.user.id],
  );
  res.json({ wallpapers: rows.map(serializeWallpaper) });
}));

const createSchema = z.object({
  title: z.string().trim().min(2, "Informe um titulo.").max(120, "O titulo e longo demais."),
  description: z.string().trim().max(1000, "A descricao e longa demais.").optional().default(""),
  image_url: z.string().trim().min(1, "Informe o endereco da imagem."),
  category: z.string().trim().max(60, "A categoria e longa demais.").optional().default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(10, "Use no maximo 10 tags.").optional().default([]),
});

/** Publica um wallpaper a partir de uma URL de imagem publica. */
router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const data = parseBody(createSchema, req.body);
  const imageUrl = assertPublicHttpsUrl(data.image_url, "A imagem");

  const { rows } = await query(
    `INSERT INTO wallpapers (user_id, title, description, image_url, category, tags, source)
     VALUES ($1, $2, $3, $4, $5, $6, 'upload')
     RETURNING *`,
    [req.user.id, data.title, data.description, imageUrl, data.category, data.tags],
  );

  const wallpaper = await getWallpaperById(rows[0].id, req.user.id);
  res.status(201).json({ wallpaper });
}));

router.get("/:id", optionalAuth, asyncHandler(async (req, res) => {
  const wallpaper = await getWallpaperById(req.params.id, req.user?.id ?? null);
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou foi removido.");
  res.json({ wallpaper });
}));

/**
 * Entrega o arquivo do wallpaper para download.
 *
 * Existe porque o atributo "download" do HTML e ignorado quando o link aponta
 * para outra origem (o navegador abre a imagem em vez de baixar). Servindo
 * daqui, com Content-Disposition, o download acontece de verdade e com o nome
 * e a extensao certos.
 */
router.get("/:id/download", optionalAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT id, user_id, title, image_url
     FROM wallpapers
     WHERE id = $1 AND (is_public = TRUE OR user_id = $2)`,
    [req.params.id, req.user?.id ?? null],
  );
  const wallpaper = rows[0];
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou foi removido.");

  await transaction(async (client) => {
    await client.query("UPDATE wallpapers SET downloads = downloads + 1 WHERE id = $1", [wallpaper.id]);
    if (req.user) {
      await client.query(
        "INSERT INTO downloads (user_id, wallpaper_id) VALUES ($1, $2)",
        [req.user.id, wallpaper.id],
      );
    }
  });
  await streamWallpaperFile(wallpaper, res);
}));

/** Serve a imagem inline após validar que ela é pública ou pertence à sessão. */
router.get("/:id/image", optionalAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT id, user_id, title, image_url
     FROM wallpapers
     WHERE id = $1 AND (is_public = TRUE OR user_id = $2)`,
    [req.params.id, req.user?.id ?? null],
  );
  const wallpaper = rows[0];
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou foi removido.");
  await streamWallpaperFile(wallpaper, res, { inline: true });
}));

/** Registra um download (alimenta a tela /baixados). */
router.post("/:id/download", requireAuth, asyncHandler(async (req, res) => {
  const wallpaper = await getWallpaperById(req.params.id, req.user.id);
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou foi removido.");

  await query("UPDATE wallpapers SET downloads = downloads + 1 WHERE id = $1", [req.params.id]);
  await query(
    "INSERT INTO downloads (user_id, wallpaper_id) VALUES ($1, $2)",
    [req.user.id, wallpaper.id],
  );
  res.json({ message: "Download registrado." });
}));

router.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT user_id FROM wallpapers WHERE id = $1", [req.params.id]);
  if (!rows[0]) throw notFound("Este wallpaper nao existe ou foi removido.");
  if (rows[0].user_id !== req.user.id) throw forbidden("Voce so pode apagar os seus wallpapers.");

  await query("DELETE FROM wallpapers WHERE id = $1", [req.params.id]);
  res.json({ message: "Wallpaper removido." });
}));

export { serializeWallpaper };
export default router;
