/** Erro com status HTTP. A mensagem e mostrada ao usuario, entao escreva em portugues. */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    if (details) this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const unauthorized = (message = "Entre na sua conta para continuar.") => new HttpError(401, message);
export const forbidden = (message = "Voce nao tem permissao para esta acao.") => new HttpError(403, message);
export const notFound = (message = "Nao encontramos o que voce procura.") => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
export const paymentRequired = (message) => new HttpError(402, message);
export const tooManyRequests = (message) => new HttpError(429, message);

/** Envolve um handler async para que erros caiam no middleware de erro. */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
