import { tooManyRequests } from "../utils/http.js";

/**
 * Limitador simples em memoria. Suficiente para um processo unico em
 * desenvolvimento e para proteger login/registro/geracao contra abuso.
 * Em producao com varias instancias, troque por Redis.
 */
export function rateLimit({ windowMs, max, message, keyFn }) {
  const hits = new Map();

  // Limpeza periodica para a memoria nao crescer indefinidamente.
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref?.();
  void timer;

  return function rateLimitMiddleware(req, _res, next) {
    const key = keyFn ? keyFn(req) : req.ip;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const seconds = Math.ceil((entry.resetAt - now) / 1000);
      return next(tooManyRequests(message ?? `Muitas tentativas. Tente de novo em ${seconds}s.`));
    }
    return next();
  };
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Muitas tentativas de acesso. Aguarde alguns minutos e tente de novo.",
});

export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: "Voce esta gerando imagens rapido demais. Aguarde um minuto.",
  keyFn: (req) => req.user?.id ?? req.ip,
});
