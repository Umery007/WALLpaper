/**
 * Planos e pacotes de credito.
 * Os precos e as cotas espelham o que as telas /planos e /credito mostram.
 */
export const PLANS = {
  gratis: {
    id: "gratis",
    name: "Gratis",
    priceCents: 0,
    monthlyGenerations: 5,
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceCents: 1990,
    monthlyGenerations: 50,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceCents: 3990,
    monthlyGenerations: Infinity,
  },
};

export const DEFAULT_PLAN = "gratis";

/** Pacotes avulsos: product_key "credit-50", "credit-100", ... */
export const CREDIT_PACKS = {
  50: 590,
  100: 990,
  250: 1990,
  500: 3490,
};

export function getPlan(planId) {
  return PLANS[planId] ?? PLANS[DEFAULT_PLAN];
}

/**
 * Traduz a product_key enviada pelo frontend em um pedido de cobranca.
 * Aceita "premium", "pro" e "credit-<n>".
 */
export function resolveProduct(productKey) {
  if (typeof productKey !== "string" || !productKey.trim()) return null;
  const key = productKey.trim().toLowerCase();

  const plan = PLANS[key];
  if (plan && plan.priceCents > 0) {
    return {
      kind: "plan",
      productKey: key,
      plan: key,
      credits: 0,
      amountCents: plan.priceCents,
      title: `WA1PAPER ${plan.name}`,
      description: `Assinatura mensal do plano ${plan.name}.`,
    };
  }

  const creditMatch = /^credit-(\d+)$/.exec(key);
  if (creditMatch) {
    const credits = Number(creditMatch[1]);
    const amountCents = CREDIT_PACKS[credits];
    if (!amountCents) return null;
    return {
      kind: "credits",
      productKey: key,
      plan: null,
      credits,
      amountCents,
      title: `${credits} creditos WA1PAPER`,
      description: `Pacote avulso de ${credits} creditos para geracao de imagens.`,
    };
  }

  return null;
}
