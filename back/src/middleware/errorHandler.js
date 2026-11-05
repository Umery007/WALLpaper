import env from "../config/env.js";
import { HttpError } from "../utils/http.js";
import { errorCode } from "../utils/describeError.js";

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, `Rota nao encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars -- o Express exige os 4 parametros.
export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  // Violacao de unicidade do PostgreSQL. A mensagem depende de QUAL restricao
  // estourou: nao ha so as da tabela users -- pastas tambem sao unicas por
  // nome, e dizer "nome de usuario em uso" ali confunde quem esta criando uma.
  if (error?.code === "23505") {
    const alvo = `${error.constraint ?? ""} ${error.detail ?? ""}`;
    if (/wallpaper_folders/.test(alvo) || /\bname\b/.test(error.detail ?? "")) {
      return res.status(409).json({ error: "Voce ja tem uma pasta com esse nome." });
    }
    if (/email/i.test(alvo)) {
      return res.status(409).json({ error: "Este e-mail ja esta em uso." });
    }
    if (/username/i.test(alvo)) {
      return res.status(409).json({ error: "Este nome de usuario ja esta em uso." });
    }
    return res.status(409).json({ error: "Este registro ja existe." });
  }

  // Banco fora do ar
  const code = errorCode(error);
  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "57P03") {
    console.error("[api] banco indisponivel:", error.message);
    return res.status(503).json({
      error: "O banco de dados esta indisponivel. Verifique se o PostgreSQL esta rodando.",
    });
  }

  // O express.json rejeita corpos acima do limite antes de a rota rodar.
  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      error: "O arquivo enviado e grande demais. Tente uma imagem menor.",
    });
  }

  // JSON malformado tambem chega aqui.
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "O conteudo enviado nao e um JSON valido." });
  }

  console.error("[api] erro nao tratado:", error);
  return res.status(500).json({
    error: "Algo deu errado no servidor. Tente de novo em instantes.",
    ...(env.isProduction ? {} : { debug: error?.message }),
  });
}
