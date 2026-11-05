import { apiRequest } from "./api";

export async function startCheckout(productKey) {
  const { checkout_url: checkoutUrl } = await apiRequest("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ product_key: productKey }),
  });

  let checkout;
  try {
    checkout = new URL(checkoutUrl);
  } catch {
    throw new Error("O checkout retornou um endereço inválido.");
  }
  const validProviderHost = checkout.hostname === "mercadopago.com"
    || checkout.hostname.endsWith(".mercadopago.com")
    || checkout.hostname === "mercadopago.com.br"
    || checkout.hostname.endsWith(".mercadopago.com.br");
  if (checkout.protocol !== "https:" || !validProviderHost) {
    throw new Error("O endereço do checkout não pertence ao Mercado Pago.");
  }
  window.location.assign(checkout.href);
}
