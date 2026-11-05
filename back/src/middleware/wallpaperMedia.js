import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { query } from "../db/pool.js";
import { BACKEND_ROOT } from "../config/env.js";
import { notFound } from "../utils/http.js";

const FILE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|webp)$/i;
const CONTENT_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
};

export async function serveWallpaperImage(req, res, next) {
  try {
    const { filename } = req.params;
    if (!FILE_NAME.test(filename)) throw notFound("Este wallpaper nao existe ou foi removido.");

    const imagePath = `/uploads/wallpapers/${filename}`;
    const { rows } = await query(
      `SELECT is_public, user_id
       FROM wallpapers
       WHERE image_url = $1 AND source = 'ai'
       LIMIT 1`,
      [imagePath],
    );
    const wallpaper = rows[0];
    if (!wallpaper || (!wallpaper.is_public && wallpaper.user_id !== req.user?.id)) {
      throw notFound("Este wallpaper nao existe ou foi removido.");
    }

    const path = resolve(BACKEND_ROOT, "uploads", "wallpapers", filename);
    const file = await stat(path).catch(() => null);
    if (!file?.isFile()) throw notFound("O arquivo deste wallpaper nao foi encontrado no servidor.");

    res.setHeader("Content-Type", CONTENT_TYPES[filename.split(".").pop().toLowerCase()]);
    res.setHeader("Content-Length", file.size);
    res.setHeader("Cache-Control", wallpaper.is_public ? "public, max-age=3600" : "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    await pipeline(createReadStream(path), res);
  } catch (error) {
    next(error);
  }
}
