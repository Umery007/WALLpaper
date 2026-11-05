import { query } from "../db/pool.js";
import { unauthorized } from "../utils/http.js";
import { SESSION_COOKIE, verifySessionToken } from "../services/tokens.js";

const USER_COLUMNS = `
  id, name, email, email_verified, username, avatar_url, is_private,
  plan, plan_expires_at, credits, created_at
`;
const EXCLUSIVE_PREMIUM_EMAIL = "tr876713@gmail.com";

export async function applyExclusivePremium(user) {
  if (!user.email_verified || user.email.toLowerCase() !== EXCLUSIVE_PREMIUM_EMAIL) return user;

  const { rows } = await query(
    `UPDATE users
     SET plan = 'premium', plan_expires_at = NULL
     WHERE id = $1 AND plan <> 'pro'
       AND (plan <> 'premium' OR plan_expires_at IS NOT NULL)
     RETURNING ${USER_COLUMNS}`,
    [user.id],
  );
  return rows[0] ?? user;
}

/** Formato do usuario devolvido ao frontend (nunca inclui password_hash). */
export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isEmailVerified: row.email_verified,
    username: row.username,
    avatar_url: row.avatar_url,
    isPrivate: row.is_private,
    plan: row.plan,
    plan_expires_at: row.plan_expires_at,
    credits: row.credits,
    created_at: row.created_at,
  };
}

async function loadUserFromRequest(req) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.[SESSION_COOKIE] || bearer;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload?.sub) return null;

  const { rows } = await query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [payload.sub]);
  return rows[0] ? applyExclusivePremium(rows[0]) : null;
}

/** Popula req.user quando houver sessao valida, mas nunca bloqueia. */
export async function optionalAuth(req, _res, next) {
  try {
    req.user = await loadUserFromRequest(req);
    next();
  } catch (error) {
    next(error);
  }
}

/** Exige sessao valida. */
export async function requireAuth(req, _res, next) {
  try {
    req.user = await loadUserFromRequest(req);
    if (!req.user) throw unauthorized();
    next();
  } catch (error) {
    next(error);
  }
}

export { USER_COLUMNS };
