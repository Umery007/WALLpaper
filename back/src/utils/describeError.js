/**
 * Extrai uma mensagem util de um erro.
 *
 * Quando "localhost" resolve para IPv6 e IPv4 e as duas tentativas falham,
 * o Node junta tudo num AggregateError de mensagem vazia -- sem isto o
 * usuario veria apenas uma linha em branco.
 */
export function describeError(error) {
  if (!error) return "erro desconhecido";

  if (error.message) return error.message;

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    const parts = error.errors.map((item) => item?.message).filter(Boolean);
    if (parts.length > 0) return [...new Set(parts)].join("; ");
  }

  return error.code ? `erro ${error.code}` : String(error);
}

/** Codigo do erro, inclusive quando vem embrulhado num AggregateError. */
export function errorCode(error) {
  return error?.code ?? error?.errors?.find((item) => item?.code)?.code ?? null;
}
