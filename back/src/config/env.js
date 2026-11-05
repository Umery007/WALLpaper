import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { ensureEnvFile } from "./ensureEnvFile.js";

const here = dirname(fileURLToPath(import.meta.url));
export const BACKEND_ROOT = resolve(here, "..", "..");

// Primeira execucao: cria o .env a partir do .env.example (so fora de producao).
ensureEnvFile(resolve(BACKEND_ROOT, ".env"), resolve(BACKEND_ROOT, ".env.example"));

dotenv.config({ path: resolve(BACKEND_ROOT, ".env") });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(
      `A variavel de ambiente ${name} nao foi definida. Copie back/.env.example para back/.env e preencha os valores.`,
    );
  }
  return value;
}

function optional(name, fallback = "") {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function bool(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

const NODE_ENV = optional("NODE_ENV", "development");
const isProduction = NODE_ENV === "production";

const jwtSecret = required("JWT_SECRET");
if (isProduction && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres em producao.");
}
if (isProduction && jwtSecret.includes("troque-este-valor")) {
  throw new Error("JWT_SECRET ainda esta com o valor de exemplo. Gere um segredo real antes de publicar.");
}

const env = {
  NODE_ENV,
  isProduction,
  port: Number(optional("PORT", "4000")),
  publicUrl: optional("PUBLIC_URL", `http://localhost:${optional("PORT", "4000")}`).replace(/\/+$/, ""),
  frontendUrl: optional("FRONTEND_URL", "http://localhost:5173").replace(/\/+$/, ""),

  databaseUrl: required("DATABASE_URL"),
  databaseSsl: bool("DATABASE_SSL", false),
  // Sobe um PostgreSQL proprio a partir dos binarios do npm, sem instalador.
  embeddedPostgres: bool("EMBEDDED_POSTGRES", false),

  jwtSecret,
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "7d"),

  // "vertex" cobra dos creditos do Google Cloud; "aistudio" usa o saldo
  // pre-pago do AI Studio. A chave precisa ser do provedor escolhido.
  geminiProvider: (process.env.GEMINI_PROVIDER ?? "vertex").trim().toLowerCase(),
  geminiApiKey: optional("GEMINI_API_KEY"),
  geminiImageModel: optional("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image"),

  mercadoPagoAccessToken: optional("MERCADOPAGO_ACCESS_TOKEN"),
  mercadoPagoWebhookSecret: optional("MERCADOPAGO_WEBHOOK_SECRET"),

  uploadsDir: resolve(BACKEND_ROOT, "uploads"),
};

export default env;
