import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { optionalAuth, publicUser, requireAuth, USER_COLUMNS } from "../middleware/auth.js";
import { asyncHandler, conflict, notFound } from "../utils/http.js";
import { parseBody } from "../utils/validate.js";
import { removeAvatarImage, saveAvatarImage } from "../services/avatars.js";
import {
  followUser,
  getFollowStats,
  listFollowers,
  listFollowing,
  unfollowUser,
} from "../services/follows.js";

const router = Router();

const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(100, "O nome e longo demais.").optional(),
  username: z
    .string()
    .trim()
    .transform((value) => value.replace(/^@/, ""))
    .refine((value) => value === "" || /^[a-z0-9._-]{3,30}$/i.test(value), {
      message: "O nome de usuario deve ter de 3 a 30 letras, numeros, ponto, hifen ou sublinhado.",
    })
    .optional(),
  isPrivate: z.boolean().optional(),
  avatar_url: z.string().trim().url("Informe um endereco valido para a foto.").optional(),
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.patch("/me", requireAuth, asyncHandler(async (req, res) => {
  const data = parseBody(profileSchema, req.body);

  if (data.username) {
    const { rowCount } = await query(
      "SELECT 1 FROM users WHERE username = $1 AND id <> $2",
      [data.username, req.user.id],
    );
    if (rowCount > 0) throw conflict("Este nome de usuario ja esta em uso.");
  }

  // Monta o UPDATE apenas com os campos enviados.
  const updates = [];
  const values = [];
  const push = (column, value) => {
    values.push(value);
    updates.push(`${column} = $${values.length}`);
  };

  if (data.name !== undefined) push("name", data.name);
  if (data.username !== undefined) push("username", data.username === "" ? null : data.username);
  if (data.isPrivate !== undefined) push("is_private", data.isPrivate);
  if (data.avatar_url !== undefined) push("avatar_url", data.avatar_url);

  if (updates.length === 0) {
    return res.json({ user: publicUser(req.user) });
  }

  values.push(req.user.id);
  const { rows } = await query(
    `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING ${USER_COLUMNS}`,
    values,
  );

  return res.json({ user: publicUser(rows[0]) });
}));

/** Troca a foto de perfil. A imagem chega como data URL em base64. */
const avatarSchema = z.object({
  image: z.string().min(1, "Escolha uma imagem."),
});

router.put("/me/avatar", requireAuth, asyncHandler(async (req, res) => {
  const { image } = parseBody(avatarSchema, req.body);

  const avatarUrl = await saveAvatarImage(image);
  const { rows } = await query(
    `UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING ${USER_COLUMNS}`,
    [avatarUrl, req.user.id],
  );

  // A foto antiga so sai depois que a nova esta gravada.
  await removeAvatarImage(req.user.avatar_url);

  res.json({ user: publicUser(rows[0]) });
}));

/** Remove a foto e volta ao avatar vazio. */
router.delete("/me/avatar", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING ${USER_COLUMNS}`,
    [req.user.id],
  );
  await removeAvatarImage(req.user.avatar_url);

  res.json({ user: publicUser(rows[0]) });
}));

/** Numeros de seguidores do proprio perfil. */
router.get("/me/follow-stats", requireAuth, asyncHandler(async (req, res) => {
  res.json({ stats: await getFollowStats(req.user.id, req.user.id) });
}));

/** Perfil publico de outra pessoa, por id ou @usuario. */
router.get("/:idOrUsername", optionalAuth, asyncHandler(async (req, res) => {
  const chave = req.params.idOrUsername.replace(/^@/, "");
  const ehUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chave);

  const { rows } = await query(
    `SELECT id, name, username, avatar_url, is_private, created_at
       FROM users
      WHERE ${ehUuid ? "id = $1::uuid" : "username = $1"}`,
    [chave],
  );
  const perfil = rows[0];
  if (!perfil) throw notFound("Este perfil nao existe.");

  const stats = await getFollowStats(perfil.id, req.user?.id ?? null);
  res.json({ profile: { ...perfil, ...stats } });
}));

router.post("/:id/follow", requireAuth, asyncHandler(async (req, res) => {
  res.json({ stats: await followUser(req.user.id, req.params.id) });
}));

router.delete("/:id/follow", requireAuth, asyncHandler(async (req, res) => {
  res.json({ stats: await unfollowUser(req.user.id, req.params.id) });
}));

router.get("/:id/followers", optionalAuth, asyncHandler(async (req, res) => {
  res.json({ users: await listFollowers(req.params.id) });
}));

router.get("/:id/following", optionalAuth, asyncHandler(async (req, res) => {
  res.json({ users: await listFollowing(req.params.id) });
}));

export default router;
