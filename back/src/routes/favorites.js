import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { listFavorites } from "../services/wallpapers.js";
import { asyncHandler, notFound } from "../utils/http.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const wallpapers = await listFavorites(req.user.id);
  res.json({ wallpapers });
}));

router.post("/:wallpaperId", asyncHandler(async (req, res) => {
  const wallpaper = await query(
    `SELECT 1 FROM wallpapers
     WHERE id = $1 AND (is_public = TRUE OR user_id = $2)`,
    [req.params.wallpaperId, req.user.id],
  );
  if (!wallpaper.rowCount) throw notFound("Este wallpaper nao existe ou foi removido.");

  await query(
    `INSERT INTO favorites (user_id, wallpaper_id) VALUES ($1, $2)
     ON CONFLICT (user_id, wallpaper_id) DO NOTHING`,
    [req.user.id, req.params.wallpaperId],
  );
  res.status(201).json({ favorited: true });
}));

router.delete("/:wallpaperId", asyncHandler(async (req, res) => {
  await query(
    "DELETE FROM favorites WHERE user_id = $1 AND wallpaper_id = $2",
    [req.user.id, req.params.wallpaperId],
  );
  res.json({ favorited: false });
}));

export default router;
