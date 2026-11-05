import { query } from "../db/pool.js";
import { getPlan } from "../config/plans.js";

/** Quantas geracoes o usuario ja fez no mes corrente. */
export async function countGenerationsThisMonth(userId) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total
     FROM generations
     WHERE user_id = $1 AND created_at >= date_trunc('month', now())`,
    [userId],
  );
  return rows[0].total;
}

/** Resumo da conta usado por GET /api/billing/me e pela tela de creditos. */
export async function getAccountUsage(user) {
  const plan = getPlan(user.plan);
  const used = await countGenerationsThisMonth(user.id);
  const unlimited = plan.monthlyGenerations === Infinity;

  return {
    plan: plan.id,
    plan_name: plan.name,
    plan_expires_at: user.plan_expires_at ?? null,
    credits: user.credits,
    monthly_quota: unlimited ? null : plan.monthlyGenerations,
    generations_used: used,
    generations_remaining: unlimited ? null : Math.max(0, plan.monthlyGenerations - used),
    unlimited,
  };
}

/**
 * Decide como cobrar a proxima geracao.
 * Devolve { allowed, chargeCredit, reason }.
 */
export async function resolveGenerationCharge(user) {
  const plan = getPlan(user.plan);
  if (plan.monthlyGenerations === Infinity) {
    return { allowed: true, chargeCredit: false };
  }

  const used = await countGenerationsThisMonth(user.id);
  if (used < plan.monthlyGenerations) {
    return { allowed: true, chargeCredit: false };
  }

  if (user.credits > 0) {
    return { allowed: true, chargeCredit: true };
  }

  return {
    allowed: false,
    chargeCredit: false,
    reason:
      `Voce usou as ${plan.monthlyGenerations} geracoes do plano ${plan.name} neste mes `
      + "e esta sem creditos. Compre creditos avulsos ou escolha um plano maior para continuar.",
  };
}

/**
 * Debita um credito garantindo que o saldo nao fique negativo mesmo com
 * pedidos simultaneos (a condicao credits > 0 faz parte do UPDATE).
 */
export async function chargeOneCredit(client, userId, reason = "generation") {
  const { rows } = await client.query(
    "UPDATE users SET credits = credits - 1 WHERE id = $1 AND credits > 0 RETURNING credits",
    [userId],
  );
  if (!rows[0]) return null;

  await client.query(
    "INSERT INTO credit_transactions (user_id, delta, reason) VALUES ($1, -1, $2)",
    [userId, reason],
  );
  return rows[0].credits;
}

export async function addCredits(client, userId, amount, reason) {
  const { rows } = await client.query(
    "UPDATE users SET credits = credits + $2 WHERE id = $1 RETURNING credits",
    [userId, amount],
  );
  await client.query(
    "INSERT INTO credit_transactions (user_id, delta, reason) VALUES ($1, $2, $3)",
    [userId, amount, reason],
  );
  return rows[0]?.credits ?? null;
}
