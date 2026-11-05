import { Router } from "express";
import { z } from "zod";
import { query, transaction } from "../db/pool.js";
import { resolveProduct } from "../config/plans.js";
import { requireAuth } from "../middleware/auth.js";
import { createCheckoutPreference, fetchPayment, isBillingConfigured } from "../services/billing.js";
import { addCredits, getAccountUsage } from "../services/usage.js";
import { asyncHandler, badRequest } from "../utils/http.js";
import { parseBody } from "../utils/validate.js";

const router = Router();

/** Resumo da conta: plano, saldo de creditos e cota do mes. */
router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const usage = await getAccountUsage(req.user);
  res.json({ ...usage, billing_enabled: isBillingConfigured() });
}));

const checkoutSchema = z.object({
  product_key: z.string().trim().min(1, "Escolha um plano ou pacote de creditos."),
});

/**
 * Cria o pedido e devolve a URL de checkout do Mercado Pago.
 * O frontend confere o dominio antes de redirecionar.
 */
router.post("/checkout", requireAuth, asyncHandler(async (req, res) => {
  const { product_key: productKey } = parseBody(checkoutSchema, req.body);

  const product = resolveProduct(productKey);
  if (!product) {
    throw badRequest("Este plano ou pacote de creditos nao existe.");
  }

  const { rows } = await query(
    `INSERT INTO billing_orders (user_id, product_key, kind, amount_cents, credits, plan)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [req.user.id, product.productKey, product.kind, product.amountCents, product.credits, product.plan],
  );
  const order = rows[0];

  const { checkoutUrl, providerRef } = await createCheckoutPreference({
    order,
    product,
    user: req.user,
  });

  await query("UPDATE billing_orders SET provider_ref = $1 WHERE id = $2", [providerRef, order.id]);

  res.json({ checkout_url: checkoutUrl, order_id: order.id });
}));

/** Historico de compras do usuario. */
router.get("/orders", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT id, product_key, kind, amount_cents, credits, plan, status, created_at
     FROM billing_orders WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 50`,
    [req.user.id],
  );
  res.json({ orders: rows });
}));

/** Aplica o pedido pago: credita o saldo ou ativa o plano. Idempotente. */
async function fulfillOrder(orderId) {
  return transaction(async (client) => {
    const { rows } = await client.query(
      "SELECT * FROM billing_orders WHERE id = $1 FOR UPDATE",
      [orderId],
    );
    const order = rows[0];
    if (!order) return { applied: false, reason: "pedido nao encontrado" };
    if (order.status === "paid") return { applied: false, reason: "ja processado" };

    if (order.kind === "credits") {
      await addCredits(client, order.user_id, order.credits, `compra ${order.product_key}`);
    } else if (order.kind === "plan") {
      await client.query(
        `UPDATE users
         SET plan = $2,
             plan_expires_at = GREATEST(COALESCE(plan_expires_at, now()), now()) + interval '30 days'
         WHERE id = $1`,
        [order.user_id, order.plan],
      );
    }

    await client.query("UPDATE billing_orders SET status = 'paid' WHERE id = $1", [orderId]);
    return { applied: true };
  });
}

/**
 * Webhook do Mercado Pago. Nunca confiamos no corpo da notificacao:
 * consultamos a API do provedor para saber o status real do pagamento.
 */
router.post("/webhook", asyncHandler(async (req, res) => {
  // Responde rapido para o provedor nao reenviar.
  res.status(200).json({ received: true });

  try {
    const paymentId = req.body?.data?.id ?? req.query["data.id"];
    const type = req.body?.type ?? req.query.type;
    if (!paymentId || (type && type !== "payment")) return;

    const payment = await fetchPayment(paymentId);
    if (!payment) return;

    const orderId = payment.external_reference;
    if (!orderId) return;

    if (payment.status === "approved") {
      const result = await fulfillOrder(orderId);
      console.log(`[billing] pedido ${orderId}: ${result.applied ? "creditado" : result.reason}`);
    } else if (["rejected", "cancelled"].includes(payment.status)) {
      await query(
        "UPDATE billing_orders SET status = $2 WHERE id = $1 AND status = 'pending'",
        [orderId, payment.status === "cancelled" ? "cancelled" : "failed"],
      );
    }
  } catch (error) {
    console.error("[billing] falha ao processar webhook:", error.message);
  }
}));

export default router;
