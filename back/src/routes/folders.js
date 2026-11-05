import { Router } from "express";
import { z } from "zod";
import { query, transaction } from "../db/pool.js";
import env from "../config/env.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { asyncHandler, badRequest, forbidden, notFound } from "../utils/http.js";
import { parseBody } from "../utils/validate.js";

const router = Router();

const createSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da pasta.").max(40),
  visibility: z.enum(["private", "public"]).default("private"),
  cover_image: z.string().max(950_000).optional().default(""),
  wallpaper_ids: z.array(z.string().uuid()).max(100).optional().default([]),
});
const addItemSchema = z.object({ wallpaper_id: z.string().uuid() });

async function listFolders({ ownerId = null, publicOnly = false } = {}) {
  const values = [];
  const filters = [];
  if (publicOnly || !ownerId) filters.push("f.visibility = 'public'");
  else {
    values.push(ownerId);
    filters.push(`(f.user_id = $${values.length} OR f.visibility = 'public')`);
  }

  const { rows } = await query(
    `SELECT f.id, f.user_id, f.name, f.visibility, f.cover_image, f.created_at,
            u.name AS creator_name, u.username AS creator_username
     FROM wallpaper_folders f
     JOIN users u ON u.id = f.user_id
     WHERE ${filters.join(" AND ")}
     ORDER BY f.created_at DESC
     LIMIT 100`,
    values,
  );
  if (!rows.length) return [];

  const folderIds = rows.map((folder) => folder.id);
  const itemValues = [folderIds];
  let access = "f.visibility = 'public' AND w.is_public = TRUE";
  if (ownerId && !publicOnly) {
    itemValues.push(ownerId);
    access = `((f.user_id = $2 AND (f.visibility <> 'public' OR w.is_public = TRUE))
               OR (f.visibility = 'public' AND w.is_public = TRUE))`;
  }
  const { rows: items } = await query(
    `SELECT fi.folder_id, w.id, w.title, w.image_url, w.tags
     FROM wallpaper_folder_items fi
     JOIN wallpaper_folders f ON f.id = fi.folder_id
     JOIN wallpapers w ON w.id = fi.wallpaper_id
     WHERE fi.folder_id = ANY($1::uuid[]) AND ${access}
     ORDER BY fi.position, fi.created_at`,
    itemValues,
  );
  const byFolder = new Map(rows.map((folder) => [folder.id, []]));
  for (const item of items) {
    byFolder.get(item.folder_id)?.push({
      id: item.id,
      title: item.title,
      image: item.image_url.startsWith("/uploads/wallpapers/")
        ? `${env.publicUrl}/api/wallpapers/${item.id}/image`
        : item.image_url.startsWith("/") ? `${env.publicUrl}${item.image_url}` : item.image_url,
      tags: item.tags ?? [],
    });
  }

  return rows.map((folder) => ({
    id: folder.id,
    user_id: folder.user_id,
    name: folder.name,
    visibility: folder.visibility,
    coverImage: folder.cover_image,
    items: byFolder.get(folder.id) ?? [],
    creator_name: folder.creator_name,
    creator_username: folder.creator_username,
    created_at: folder.created_at,
  }));
}

router.get("/", optionalAuth, asyncHandler(async (req, res) => {
  const publicOnly = req.query.visibility === "public";
  if (!publicOnly && !req.user) {
    res.json({ folders: await listFolders({ publicOnly: true }) });
    return;
  }
  res.json({ folders: await listFolders({ ownerId: req.user?.id ?? null, publicOnly }) });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const data = parseBody(createSchema, req.body);
  if (data.cover_image && !/^data:image\/(png|jpeg|webp);base64,/i.test(data.cover_image)) {
    throw badRequest("A capa precisa ser uma imagem PNG, JPEG ou WebP.");
  }
  const uniqueWallpaperIds = [...new Set(data.wallpaper_ids)];

  const folder = await transaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO wallpaper_folders (user_id, name, visibility, cover_image)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, name, visibility, cover_image, created_at`,
      [req.user.id, data.name, data.visibility, data.cover_image],
    );
    const created = rows[0];

    for (const [position, wallpaperId] of uniqueWallpaperIds.entries()) {
      const { rows: wallpapers } = await client.query(
        `SELECT id, is_public FROM wallpapers
         WHERE id = $1 AND (is_public = TRUE OR user_id = $2)`,
        [wallpaperId, req.user.id],
      );
      const wallpaper = wallpapers[0];
      if (!wallpaper) throw notFound("Um dos wallpapers selecionados nao existe ou nao esta acessivel.");
      if (created.visibility === "public" && !wallpaper.is_public) {
        throw forbidden("Pastas publicas so podem conter wallpapers publicos.");
      }
      await client.query(
        `INSERT INTO wallpaper_folder_items (folder_id, wallpaper_id, position)
         VALUES ($1, $2, $3)`,
        [created.id, wallpaperId, position],
      );
    }
    return created;
  });

  const folders = await listFolders({ ownerId: req.user.id });
  res.status(201).json({ folder: folders.find((item) => item.id === folder.id) });
}));

router.post("/:folderId/items", requireAuth, asyncHandler(async (req, res) => {
  const { wallpaper_id: wallpaperId } = parseBody(addItemSchema, req.body);
  const { rows: folders } = await query(
    "SELECT id, visibility FROM wallpaper_folders WHERE id = $1 AND user_id = $2",
    [req.params.folderId, req.user.id],
  );
  const folder = folders[0];
  if (!folder) throw notFound("Esta pasta nao existe.");

  const { rows: wallpapers } = await query(
    `SELECT id, is_public FROM wallpapers
     WHERE id = $1 AND (is_public = TRUE OR user_id = $2)`,
    [wallpaperId, req.user.id],
  );
  const wallpaper = wallpapers[0];
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou nao esta acessivel.");
  if (folder.visibility === "public" && !wallpaper.is_public) {
    throw forbidden("Pastas publicas so podem conter wallpapers publicos.");
  }

  await query(
    `INSERT INTO wallpaper_folder_items (folder_id, wallpaper_id, position)
     SELECT $1, $2, COALESCE(MAX(position), -1) + 1
     FROM wallpaper_folder_items
     WHERE folder_id = $1
     ON CONFLICT (folder_id, wallpaper_id) DO NOTHING`,
    [folder.id, wallpaperId],
  );
  res.status(201).json({ saved: true });
}));

router.delete("/:folderId", requireAuth, asyncHandler(async (req, res) => {
  const { rowCount } = await query(
    "DELETE FROM wallpaper_folders WHERE id = $1 AND user_id = $2",
    [req.params.folderId, req.user.id],
  );
  if (!rowCount) throw notFound("Esta pasta nao existe.");
  res.status(204).end();
}));

export default router;
