import env from "../config/env.js";
import { HttpError } from "../utils/http.js";

const MP_API = "https://api.mercadopago.com";

export function isBillingConfigured() {
  return Boolean(env.mercadoPagoAccessToken);
}

/**
 * Cria uma preferencia de pagamento no Mercado Pago e devolve a URL de
 * checkout. O frontend valida que o dominio pertence ao Mercado Pago antes
 * de redirecionar, entao sempre devolvemos a URL oficial do provedor.
 */
export async function createCheckoutPreference({ order, product, user }) {
  if (!isBillingConfigured()) {
    throw new HttpError(
      503,
      "O pagamento ainda nao foi configurado neste servidor. "
        + "Preencha MERCADOPAGO_ACCESS_TOKEN no arquivo back/.env para habilitar o checkout.",
    );
  }

  const body = {
    items: [{
      id: product.productKey,
      title: product.title,
      description: product.description,
      quantity: 1,
      currency_id: "BRL",
      unit_price: Number((product.amountCents / 100).toFixed(2)),
    }],
    payer: { email: user.email, name: user.name },
    external_reference: order.id,
    back_urls: {
      success: `${env.frontendUrl}/perfil?pagamento=sucesso`,
      pending: `${env.frontendUrl}/perfil?pagamento=pendente`,
      failure: `${env.frontendUrl}/planos?pagamento=falhou`,
    },
    auto_return: "approved",
    notification_url: `${env.publicUrl}/api/billing/webhook`,
    statement_descriptor: "WA1PAPER",
  };

  let response;
  try {
    response = await fetch(`${MP_API}/checkout/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.mercadoPagoAccessToken}`,
        "X-Idempotency-Key": order.id,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new HttpError(503, "Nao foi possivel falar com o Mercado Pago. Tente de novo em instantes.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("[billing] Mercado Pago recusou a preferencia:", payload);
    if (response.status === 401) {
      throw new HttpError(503, "As credenciais do Mercado Pago sao invalidas. Confira MERCADOPAGO_ACCESS_TOKEN.");
    }
    throw new HttpError(503, "O Mercado Pago nao conseguiu iniciar o checkout. Tente de novo.");
  }

  // init_point e o checkout de producao; sandbox_init_point e o de testes.
  const checkoutUrl = env.isProduction
    ? payload?.init_point
    : (payload?.sandbox_init_point || payload?.init_point);

  if (!checkoutUrl) {
    throw new HttpError(503, "O Mercado Pago nao devolveu um endereco de checkout.");
  }

  return { checkoutUrl, providerRef: String(payload.id) };
}

/** Consulta um pagamento para confirmar o status informado pelo webhook. */
export async function fetchPayment(paymentId) {
  if (!isBillingConfigured()) return null;
  const response = await fetch(`${MP_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${env.mercadoPagoAccessToken}` },
  });
  if (!response.ok) return null;
  return response.json().catch(() => null);
}
