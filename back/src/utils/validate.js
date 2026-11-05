import { badRequest } from "./http.js";

/**
 * Valida req.body com um schema Zod e devolve os dados ja normalizados.
 * Erros viram HttpError 400 com a primeira mensagem legivel.
 */
export function parseBody(schema, body) {
  const result = schema.safeParse(body ?? {});
  if (result.success) return result.data;

  const issue = result.error.issues[0];
  const field = issue?.path?.join(".") || "dados";
  throw badRequest(issue?.message || `Valor invalido em "${field}".`, {
    field,
    issues: result.error.issues.map((item) => ({
      field: item.path.join("."),
      message: item.message,
    })),
  });
}

/**
 * Bloqueia URLs que apontam para a propria rede (defesa contra SSRF e contra
 * usuarios publicarem links internos na galeria).
 */
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^\[?::1\]?$/,
  /^\[?f[cd][0-9a-f]{2}:/i,
  /\.local$/i,
  /\.internal$/i,
];

export function assertPublicHttpsUrl(rawUrl, fieldLabel = "A imagem") {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw badRequest(`${fieldLabel} precisa ser um endereco valido.`);
  }
  if (url.protocol !== "https:") {
    throw badRequest(`${fieldLabel} precisa usar um endereco HTTPS.`);
  }
  const host = url.hostname;
  if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    throw badRequest(`${fieldLabel} nao pode apontar para um endereco interno.`);
  }
  return url.href;
}
