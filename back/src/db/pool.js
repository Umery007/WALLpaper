import pg from "pg";
import env from "../config/env.js";

const { Pool } = pg;

// Datas (DATE) voltam como string "YYYY-MM-DD" em vez de Date, evitando
// deslocamento de fuso ao serializar em JSON.
pg.types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("[db] erro inesperado no pool de conexoes:", error.message);
});

export function query(text, params) {
  return pool.query(text, params);
}

/** Executa varias queries dentro de uma transacao. */
export async function transaction(handler) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function assertConnection() {
  const { rows } = await pool.query("SELECT current_database() AS db, version() AS version");
  return rows[0];
}

export default pool;
