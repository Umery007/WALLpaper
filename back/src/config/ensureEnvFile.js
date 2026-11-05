import crypto from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Cria o back/.env na primeira execucao.
 *
 * Sem este arquivo o env.js parava o processo logo no "npm run dev", mesmo
 * com tudo instalado -- o README promete que so o Node 20 e necessario.
 * Aqui copiamos o .env.example e ja trocamos o JWT_SECRET de exemplo por um
 * valor aleatorio, para a sessao nao nascer com um segredo publico.
 *
 * Em producao nada e criado: la as variaveis vem do ambiente e um .env
 * gerado sozinho esconderia um erro de configuracao.
 */
export function ensureEnvFile(envPath, examplePath) {
  if (process.env.NODE_ENV === "production") return;
  if (existsSync(envPath) || !existsSync(examplePath)) return;

  copyFileSync(examplePath, envPath);

  const secret = crypto.randomBytes(48).toString("hex");
  const content = readFileSync(envPath, "utf8")
    .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);
  writeFileSync(envPath, content);

  console.log("[api] back/.env criado a partir do .env.example (JWT_SECRET gerado).");
  console.log("[api] preencha GEMINI_API_KEY nesse arquivo para habilitar a geracao por IA.");
}

export default ensureEnvFile;
