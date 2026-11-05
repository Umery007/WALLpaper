// Cliente HTTP do WA1PAPER.
//
// Em desenvolvimento o Vite redireciona /api para o backend (vite.config.js),
// entao a mesma origem serve o frontend e a API e o cookie de sessao viaja
// sozinho. Para apontar para outro servidor, defina VITE_API_URL no .env.

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

const NETWORK_ERROR =
  "Não foi possível falar com o servidor. Verifique se a API está rodando "
  + "(npm run dev dentro da pasta back).";

// O proxy do Vite devolve 502/504 quando a API não responde, então o fetch
// não chega a falhar: tratamos esses códigos como "servidor fora do ar".
const GATEWAY_STATUSES = new Set([502, 504]);

/**
 * Faz uma requisicao na API e devolve o JSON já desempacotado.
 * Erros da API chegam como Error com a mensagem em portugues que o
 * backend enviou, pronta para mostrar na tela.
 */
export async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      // Envia e recebe o cookie httpOnly da sessao.
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(body ? { body } : {}),
      ...rest,
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  if (response.status === 204) return null;

  const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = payload?.error
      ?? (GATEWAY_STATUSES.has(response.status)
        ? NETWORK_ERROR
        : `A requisição falhou (erro ${response.status}).`);

    const error = new Error(message);
    error.status = response.status;
    if (payload?.details) error.details = payload.details;
    throw error;
  }

  return payload;
}

/** Monta uma query string ignorando valores vazios. */
export function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      search.set(key, String(value).trim());
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export function isProtectedWallpaperImage(url) {
  if (!url) return false;
  try {
    return /^\/api\/wallpapers\/[^/]+\/image$/.test(new URL(url, "http://localhost").pathname);
  } catch {
    return false;
  }
}

export { API_BASE };
