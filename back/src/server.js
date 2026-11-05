import env from "./config/env.js";
import { createApp } from "./app.js";
import pool, { assertConnection } from "./db/pool.js";
import { migrate } from "./db/migrate.js";
import { ensureLocalDatabase } from "./db/localPostgres.js";
import seed from "./db/seed.js";
import { describeError, errorCode } from "./utils/describeError.js";

async function start() {
  try {
    // Sobe o PostgreSQL embutido quando EMBEDDED_POSTGRES=true.
    await ensureLocalDatabase();

    const info = await assertConnection();
    console.log(`[api] conectado ao PostgreSQL ("${info.db}")`);
  } catch (error) {
    const code = errorCode(error);
    console.error("\n[api] Nao foi possivel conectar ao PostgreSQL.");
    console.error(`[api] Motivo: ${describeError(error)}`);

    if (code === "ECONNREFUSED") {
      console.error("[api] Nada esta escutando nesse endereco: o PostgreSQL nao esta");
      console.error("[api] instalado, ou o servico esta parado.");
      console.error("[api] -> Instale: https://www.postgresql.org/download/windows/");
      console.error("[api] -> Ou use um banco na nuvem (Neon, Supabase) e ajuste DATABASE_URL.");
    } else if (code === "28P01") {
      console.error("[api] A senha do PostgreSQL esta incorreta. Ajuste DATABASE_URL em back/.env.");
    } else if (code === "3D000") {
      console.error("[api] O banco nao existe. Crie com: CREATE DATABASE wa1paper;");
    } else if (code === "ENOTFOUND") {
      console.error("[api] O endereco do banco em DATABASE_URL nao foi encontrado.");
    }

    console.error(`[api] DATABASE_URL atual: ${env.databaseUrl.replace(/:[^:@/]*@/, ":***@")}\n`);
    process.exit(1);
  }

  // Garante que as tabelas existem antes de aceitar requisicoes.
  await migrate();

  // Na primeira execucao, enche a galeria para o site nao abrir vazio.
  const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM wallpapers");
  if (rows[0].total === 0) {
    console.log("[api] galeria vazia: criando os wallpapers de demonstracao...");
    await seed();
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] WA1PAPER rodando em ${env.publicUrl}`);
    console.log(`[api] frontend autorizado: ${env.frontendUrl}`);
    if (!env.geminiApiKey) console.warn("[api] aviso: GEMINI_API_KEY vazia - a geracao por IA fica indisponivel.");
    if (!env.mercadoPagoAccessToken) console.warn("[api] aviso: MERCADOPAGO_ACCESS_TOKEN vazia - o checkout fica indisponivel.");
  });

  // Sem isto, uma porta ocupada derruba o processo com stack trace do Node.
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`
[api] A porta ${env.port} ja esta em uso.`);
      console.error("[api] Quase sempre e a propria API aberta em outro terminal:");
      console.error("[api]   - feche o outro terminal, ou");
      console.error(`[api]   - rode em outra porta:  PORT=4001 npm run dev`);
      console.error("[api] Para descobrir quem ocupa a porta (PowerShell):");
      console.error(`[api]   Get-NetTCPConnection -LocalPort ${env.port} | Select-Object OwningProcess
`);
      process.exit(1);
    }
    if (error.code === "EACCES") {
      console.error(`
[api] Sem permissao para usar a porta ${env.port}. Escolha uma acima de 1024.
`);
      process.exit(1);
    }
    throw error;
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} recebido, encerrando...`);
    server.close(async () => {
      await pool.end().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
