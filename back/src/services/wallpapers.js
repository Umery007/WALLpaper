import { query } from "../db/pool.js";
import env from "../config/env.js";

/**
 * Imagens geradas pela IA sao gravadas como caminho relativo ("/uploads/...").
 * Aqui viram URL absoluta, usando o PUBLIC_URL atual -- trocar de porta ou de
 * dominio nao quebra o que ja esta no banco. URLs externas passam direto.
 */
function absoluteImageUrl(imageUrl) {
  return imageUrl.startsWith("/") ? `${env.publicUrl}${imageUrl}` : imageUrl;
}

/** Converte a linha do banco no formato que os componentes React esperam. */
export function serializeWallpaper(row) {
  const imageUrl = row.image_url.startsWith("/uploads/wallpapers/")
    ? `${env.publicUrl}/api/wallpapers/${row.id}/image`
    : absoluteImageUrl(row.image_url);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image_url: imageUrl,
    category: row.category,
    tags: row.tags ?? [],
    source: row.source,
    prompt: row.prompt ?? null,
    downloads: row.downloads,
    // O id permite seguir o autor a partir da tela do wallpaper.
    creator_id: row.user_id ?? null,
    creator_name: row.creator_name ?? null,
    creator_username: row.creator_username ?? null,
    favorited: Boolean(row.favorited),
    favorites_count: Number(row.favorites_count ?? 0),
    created_at: row.created_at,
  };
}

const BASE_SELECT = `
  SELECT
    w.id, w.user_id, w.title, w.description, w.image_url, w.category, w.tags,
    w.source, w.prompt, w.downloads, w.created_at,
    u.name     AS creator_name,
    u.username AS creator_username,
    (f.user_id IS NOT NULL) AS favorited,
    COALESCE(fc.total, 0)   AS favorites_count
  FROM wallpapers w
  LEFT JOIN users u ON u.id = w.user_id
  LEFT JOIN favorites f ON f.wallpaper_id = w.id AND f.user_id = $1
  LEFT JOIN (
    SELECT wallpaper_id, COUNT(*)::int AS total FROM favorites GROUP BY wallpaper_id
  ) fc ON fc.wallpaper_id = w.id
`;

/**
 * Lista a galeria publica com busca por texto, categoria e paginacao.
 * viewerId pode ser null (visitante) -- nesse caso nada vem como favoritado.
 */
export async function listWallpapers({ viewerId = null, search = "", category = "", limit = 40, offset = 0 }) {
  const values = [viewerId];
  const where = ["w.is_public = TRUE"];

  if (search.trim()) {
    values.push(`%${search.trim()}%`);
    const like = `$${values.length}`;
    values.push(search.trim());
    const term = `$${values.length}`;
    where.push(`(
      w.title ILIKE ${like}
      OR w.description ILIKE ${like}
      OR EXISTS (SELECT 1 FROM unnest(w.tags) AS tag WHERE tag ILIKE ${like})
      OR to_tsvector('portuguese', w.title || ' ' || w.description) @@ plainto_tsquery('portuguese', ${term})
    )`);
  }

  if (category.trim()) {
    values.push(category.trim());
    where.push(`lower(w.category) = lower($${values.length})`);
  }

  values.push(limit, offset);
  const sql = `
    ${BASE_SELECT}
    WHERE ${where.join(" AND ")}
    ORDER BY w.created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;

  const { rows } = await query(sql, values);
  return rows.map(serializeWallpaper);
}

export async function getWallpaperById(id, viewerId = null) {
  const { rows } = await query(
    `${BASE_SELECT}
     WHERE w.id = $2 AND (w.is_public = TRUE OR w.user_id = $1)`,
    [viewerId, id],
  );
  return rows[0] ? serializeWallpaper(rows[0]) : null;
}

export async function listFavorites(viewerId, { limit = 60, offset = 0 } = {}) {
  const { rows } = await query(
    `${BASE_SELECT}
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [viewerId, limit, offset],
  );
  return rows.map(serializeWallpaper);
}

export async function listUserWallpapers(userId, viewerId = null, { limit = 60, offset = 0 } = {}) {
  const { rows } = await query(
    `${BASE_SELECT}
     WHERE w.user_id = $2
     ORDER BY w.created_at DESC
     LIMIT $3 OFFSET $4`,
    [viewerId, userId, limit, offset],
  );
  return rows.map(serializeWallpaper);
}
