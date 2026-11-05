import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pool, { assertConnection } from "./pool.js";
import { ensureLocalDatabase } from "./localPostgres.js";
import { describeError, errorCode } from "../utils/describeError.js";

const here = dirname(fileURLToPath(import.meta.url));

export async function migrate() {
  const sql = await readFile(resolve(here, "schema.sql"), "utf8");
  await pool.query(sql);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  try {
    await ensureLocalDatabase();
    const info = await assertConnection();
    console.log(`[migrate] conectado ao banco "${info.db}"`);
    await migrate();
    console.log("[migrate] esquema criado/atualizado com sucesso.");
    process.exit(0);
  } catch (error) {
    const code = errorCode(error);
    console.error("[migrate] falhou:", describeError(error));
    if (code === "ECONNREFUSED" || code === "ENOTFOUND") {
      console.error("[migrate] O PostgreSQL nao esta rodando, ou a DATABASE_URL esta incorreta.");
      console.error("[migrate] Instale em https://www.postgresql.org/download/windows/");
    }
    if (code === "28P01") {
      console.error("[migrate] Senha incorreta. Ajuste DATABASE_URL em back/.env.");
    }
    if (code === "3D000") {
      console.error("[migrate] O banco nao existe. Crie com: CREATE DATABASE wa1paper;");
    }
    process.exit(1);
  }
}
