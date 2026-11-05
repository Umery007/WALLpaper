import { query } from "../db/pool.js";
import { badRequest, notFound } from "../utils/http.js";

/**
 * Seguidores.
 *
 * follows(follower_id, following_id): quem segue quem. A chave primaria dupla
 * garante que seguir duas vezes nao duplica, e um CHECK no banco impede
 * seguir a si mesmo.
 */

/** Numeros de um perfil, com a visao de quem esta olhando. */
export async function getFollowStats(userId, viewerId = null) {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM follows WHERE following_id = $1) AS followers_count,
       (SELECT COUNT(*)::int FROM follows WHERE follower_id  = $1) AS following_count,
       CASE WHEN $2::uuid IS NULL THEN FALSE
            ELSE EXISTS (SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = $1)
       END AS is_following`,
    [userId, viewerId],
  );

  return rows[0] ?? { followers_count: 0, following_count: 0, is_following: false };
}

/** Passa a seguir. Repetir a acao nao duplica nem da erro. */
export async function followUser(followerId, targetId) {
  if (followerId === targetId) {
    throw badRequest("Voce nao pode seguir o proprio perfil.");
  }

  const { rowCount } = await query("SELECT 1 FROM users WHERE id = $1", [targetId]);
  if (rowCount === 0) throw notFound("Este perfil nao existe.");

  await query(
    `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [followerId, targetId],
  );

  return getFollowStats(targetId, followerId);
}

/** Deixa de seguir. Nao reclama se ja nao seguia. */
export async function unfollowUser(followerId, targetId) {
  await query(
    "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
    [followerId, targetId],
  );

  return getFollowStats(targetId, followerId);
}

/** Quem segue este perfil. */
export async function listFollowers(userId, limit = 50) {
  const { rows } = await query(
    `SELECT u.id, u.name, u.username, u.avatar_url, f.created_at
       FROM follows f
       JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2`,
    [userId, limit],
  );
  return rows;
}

/** Quem este perfil segue. */
export async function listFollowing(userId, limit = 50) {
  const { rows } = await query(
    `SELECT u.id, u.name, u.username, u.avatar_url, f.created_at
       FROM follows f
       JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2`,
    [userId, limit],
  );
  return rows;
}
