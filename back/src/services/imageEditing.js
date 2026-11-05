import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import env from "../config/env.js";
import { query } from "../db/pool.js";
import { notFound, badRequest } from "../utils/http.js";

const IMAGE_PATH = /^\/uploads\/wallpapers\/([0-9a-f-]{36})\.(png|jpg|webp)$/i;
const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
};

export async function loadGeneratedImageForEditing(wallpaperId, userId) {
  const { rows } = await query(
    `SELECT image_url, source
     FROM wallpapers
     WHERE id = $1 AND (is_public = TRUE OR user_id = $2)
     LIMIT 1`,
    [wallpaperId, userId],
  );
  const wallpaper = rows[0];
  if (!wallpaper) throw notFound("Este wallpaper nao existe ou foi removido.");
  if (wallpaper.source !== "ai") {
    throw badRequest("A edicao esta disponivel para wallpapers gerados pela IA.");
  }

  const match = IMAGE_PATH.exec(wallpaper.image_url);
  if (!match) {
    throw badRequest("Este wallpaper nao esta armazenado localmente para edicao.");
  }

  let buffer;
  try {
    buffer = await readFile(resolve(env.uploadsDir, "wallpapers", `${match[1]}.${match[2]}`));
  } catch {
    throw notFound("O arquivo deste wallpaper nao foi encontrado no servidor.");
  }
  if (!buffer.length) throw badRequest("O arquivo deste wallpaper esta vazio.");

  return { data: buffer.toString("base64"), mimeType: MIME_TYPES[match[2].toLowerCase()] };
}
