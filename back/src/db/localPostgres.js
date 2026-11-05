import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import pg from "pg";
import EmbeddedPostgres from "embedded-postgres";
import env, { BACKEND_ROOT } from "../config/env.js";

/**
 * PostgreSQL embutido.
 *
 * Roda um servidor PostgreSQL de verdade a partir dos binarios que vieram pelo
 * npm, guardando os dados em back/.pgdata. Nao precisa de instalador, de
 * permissao de administrador nem de servico do Windows.
 *
 * Para usar um PostgreSQL proprio (instalado na maquina ou na nuvem), basta
 * colocar EMBEDDED_POSTGRES=false no .env e apontar a DATABASE_URL.
 */

// Pasta dos dados. PGDATA_DIR permite apontar para outro lugar (um disco com
// mais espaco, por exemplo); o padrao e back/.pgdata.
const DATA_DIR = process.env.PGDATA_DIR
  ? resolve(process.env.PGDATA_DIR)
  : resolve(BACKEND_ROOT, ".pgdata");
const PID_FILE = resolve(DATA_DIR, "postmaster.pid");

let instance = null;

/**
 * Tenta uma conexao real com o banco.
 *
 * Checar so a porta TCP nao serve: durante o desligamento o PostgreSQL ainda
 * aceita a conexao mas nao responde a consultas. So contamos como "no ar"
 * quando uma consulta simples volta.
 */
async function canServeQueries(databaseUrl, timeoutMs = 3000) {
  const client = new pg.Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: timeoutMs,
    query_timeout: timeoutMs,
  });
  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

/**
 * O PostgreSQL fala bastante ao iniciar (checkpoints, recuperacao de WAL,
 * enderecos em escuta). Nada disso interessa a quem so quer rodar o site,
 * entao escondemos as linhas rotineiras e deixamos passar o que e problema
 * de verdade.
 */
const ROUTINE_LOG = /\b(LOG|HINT|STATEMENT|DETAIL|NOTICE):|^\s*$/;
const REAL_PROBLEM = /\b(FATAL|PANIC):/;

// Durante o initdb (primeira execucao) a ferramenta imprime dezenas de linhas
// de progresso. Como ja avisamos "preparando o PostgreSQL local", calamos tudo
// que nao for problema de verdade.
let suppressProgress = false;

function quietLog(message) {
  const text = String(message);
  if (REAL_PROBLEM.test(text)) {
    console.error(`[db] ${text.trim()}`);
    return;
  }
  if (suppressProgress || ROUTINE_LOG.test(text)) return;
  console.log(`[db] ${text.trim()}`);
}

function quietError(message) {
  const text = String(message);
  // "ERROR: database already exists" e esperado e ja tratado adiante.
  if (/already exists/i.test(text)) return;
  if (ROUTINE_LOG.test(text) && !REAL_PROBLEM.test(text)) return;
  console.error(`[db] ${text.trim()}`);
}

/** Espera o servidor responder, tentando a cada segundo. */
async function waitUntilReady(databaseUrl, attempts) {
  for (let i = 0; i < attempts; i += 1) {
    if (await canServeQueries(databaseUrl)) return true;
    await sleep(1000);
  }
  return false;
}

/** PID gravado no postmaster.pid (primeira linha do arquivo). */
function readPostmasterPid() {
  if (!existsSync(PID_FILE)) return null;
  try {
    const pid = Number(readFileSync(PID_FILE, "utf8").split("\n")[0].trim());
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

/** O processo ainda existe? EPERM significa que existe, mas e de outro usuario. */
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

/**
 * Pasta dos binarios do PostgreSQL embutido deste projeto. Serve de assinatura
 * para reconhecer processos nossos.
 */
const EMBEDDED_BIN_DIR = resolve(BACKEND_ROOT, "node_modules", "@embedded-postgres");

/** Todos os postgres.exe/postgres deste projeto, com pid e pid do pai. */
function listEmbeddedProcesses() {
  const signature = EMBEDDED_BIN_DIR.replace(/\\/g, "/").toLowerCase();
  const matches = (cmd) => cmd.replace(/\\/g, "/").toLowerCase().includes(signature);

  try {
    if (process.platform === "win32") {
      const output = execFileSync("powershell", [
        "-NoProfile", "-Command",
        "Get-CimInstance Win32_Process -Filter \"Name='postgres.exe'\" "
        + "| ForEach-Object { \"$($_.ProcessId)|$($_.ParentProcessId)|$($_.CommandLine)\" }",
      ], { encoding: "utf8", timeout: 15_000, windowsHide: true });

      return output.split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [pid, ppid, ...rest] = line.split("|");
          return { pid: Number(pid), ppid: Number(ppid), cmd: rest.join("|") };
        })
        .filter((item) => Number.isInteger(item.pid) && matches(item.cmd));
    }

    const output = execFileSync("ps", ["-eo", "pid=,ppid=,args="], { encoding: "utf8", timeout: 15_000 });
    return output.split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(/\s+/);
        return { pid: Number(parts[0]), ppid: Number(parts[1]), cmd: parts.slice(2).join(" ") };
      })
      .filter((item) => Number.isInteger(item.pid) && matches(item.cmd));
  } catch {
    return [];
  }
}

/**
 * Encerra APENAS processos orfaos do PostgreSQL embutido deste projeto.
 *
 * Quando o Node e encerrado a forca, o postmaster morre mas os filhos
 * (bgwriter, checkpointer...) sobrevivem segurando a memoria compartilhada --
 * e ai o proximo start falha com "pre-existing shared memory block is still
 * in use".
 *
 * O criterio e duplo, para nunca derrubar um servidor em uso:
 *  1. o binario precisa ser o deste projeto (back/node_modules), entao um
 *     PostgreSQL instalado na maquina jamais entra na conta;
 *  2. o processo pai precisa estar morto. Num servidor saudavel os filhos
 *     tem o postmaster vivo como pai, e o postmaster tem o Node vivo -- esses
 *     ficam intactos, inclusive os de outro terminal rodando a mesma API.
 */
function killOrphanProcesses() {
  const processes = listEmbeddedProcesses();
  if (processes.length === 0) return 0;

  const alivePids = new Set(processes.map((item) => item.pid));
  const isOrphan = ({ ppid }) => {
    if (!Number.isInteger(ppid) || ppid <= 0) return true;
    if (alivePids.has(ppid)) return false;      // pai e outro postgres vivo
    return !isProcessAlive(ppid);               // pai (Node) ainda existe?
  };

  const orphans = processes.filter(isOrphan);
  if (orphans.length === 0) return 0;

  console.log(`[db] encerrando ${orphans.length} processo(s) orfao(s) do PostgreSQL de uma execucao anterior...`);
  for (const { pid } of orphans) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Ja morreu ou sem permissao; o start adiante dira se atrapalhou.
    }
  }
  return orphans.length;
}

/**
 * O banco da aplicacao ja existe?
 * A consulta roda no banco "postgres", que sempre existe no cluster.
 */
async function databaseExists({ host, port, user, password, database }) {
  const client = new pg.Client({
    host, port, user, password, database: "postgres",
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    const { rowCount } = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [database],
    );
    return rowCount > 0;
  } catch {
    // Na duvida, deixa seguir: o createDatabase dira se ja existe.
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

function parseDatabaseUrl(databaseUrl) {
  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username || "postgres"),
    password: decodeURIComponent(url.password || "postgres"),
    database: url.pathname.replace(/^\//, "") || "postgres",
  };
}

/**
 * Garante que existe um PostgreSQL disponivel para a DATABASE_URL configurada.
 * Quando EMBEDDED_POSTGRES esta desligado, nao faz nada.
 */
export async function ensureLocalDatabase() {
  if (!env.embeddedPostgres) return false;

  const config = parseDatabaseUrl(env.databaseUrl);

  // 1. Ja tem um servidor atendendo? Reaproveita.
  if (await canServeQueries(env.databaseUrl)) {
    console.log(`[db] PostgreSQL local ja esta rodando na porta ${config.port}.`);
    return true;
  }

  // 2. Existe um processo anterior vivo? Pode estar subindo ou descendo.
  //    Subir outro por cima daria "pre-existing shared memory block is still
  //    in use", entao esperamos ele se resolver.
  const previousPid = readPostmasterPid();
  const previousProcessIsEmbedded = previousPid
    && listEmbeddedProcesses().some(({ pid }) => pid === previousPid);
  if (previousPid && isProcessAlive(previousPid) && previousProcessIsEmbedded) {
    console.log(`[db] aguardando o PostgreSQL da execucao anterior (pid ${previousPid})...`);

    for (let i = 0; i < 20; i += 1) {
      await sleep(1000);
      if (await canServeQueries(env.databaseUrl)) {
        console.log("[db] PostgreSQL local respondeu.");
        return true;
      }
      if (!isProcessAlive(previousPid)
        || !listEmbeddedProcesses().some(({ pid }) => pid === previousPid)) break;
    }

    if (isProcessAlive(previousPid)
      && listEmbeddedProcesses().some(({ pid }) => pid === previousPid)) {
      throw new Error(
        `Ja existe um PostgreSQL deste projeto rodando (pid ${previousPid}) e ele nao respondeu.\n`
        + "[api] Feche o outro terminal onde a API esta rodando e tente de novo.\n"
        + `[api] Se nao houver nenhum, encerre o processo: taskkill /PID ${previousPid} /F`,
      );
    }
  }

  // 3. Nao ha servidor atendendo, mas podem ter sobrado processos filhos
  //    segurando a memoria compartilhada. Sao nossos: limpamos.
  if (killOrphanProcesses() > 0) {
    await sleep(2000);
  }

  // 4. O postmaster.pid que sobrou agora e lixo.
  if (existsSync(PID_FILE)) {
    try {
      rmSync(PID_FILE);
      console.log("[db] removido um postmaster.pid de uma execucao encerrada a forca.");
    } catch {
      // Sem permissao: o proprio PostgreSQL vai reclamar com detalhe no start.
    }
  }

  const postgres = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: config.user,
    password: config.password,
    port: config.port,
    persistent: true,
    onLog: quietLog,
    onError: quietError,
    // Reduz o que o servidor escreve: so avisos e erros.
    postgresFlags: ["-c", "log_min_messages=warning", "-c", "log_checkpoints=off"],
  });

  if (!existsSync(resolve(DATA_DIR, "PG_VERSION"))) {
    console.log("[db] Primeira execucao: preparando o PostgreSQL local (demora alguns segundos)...");
    suppressProgress = true;
    try {
      await postgres.initialise();
    } finally {
      suppressProgress = false;
    }
  }

  try {
    await postgres.start();
  } catch (error) {
    // embedded-postgres as vezes rejeita sem mensagem; damos uma util.
    throw new Error(
      error?.message
      || "O PostgreSQL local nao conseguiu iniciar. Veja o log acima. "
        + "Se mencionar 'shared memory block is still in use', ainda ha um servidor antigo: "
        + "feche os outros terminais da API e tente de novo.",
      { cause: error },
    );
  }
  instance = postgres;

  // Perguntar antes de criar evita a linha "ERROR: database already exists"
  // no console a cada inicializacao.
  if (!await databaseExists(config)) {
    await postgres.createDatabase(config.database);
    console.log(`[db] banco "${config.database}" criado.`);
  }

  if (!await waitUntilReady(env.databaseUrl, 15)) {
    throw new Error(
      "O PostgreSQL local subiu, mas nao respondeu a tempo. Rode o comando de novo; "
      + "se continuar, apague a pasta back/.pgdata (os dados de teste sao recriados).",
    );
  }

  const ondeEstao = process.env.PGDATA_DIR ? DATA_DIR : "back/.pgdata";
  console.log(`[db] PostgreSQL local no ar (porta ${config.port}, dados em ${ondeEstao}).`);
  registerShutdown();
  return true;
}

/**
 * Desliga o servidor embutido junto com a API.
 *
 * "exit" nao espera promessa, entao o desligamento limpo fica nos sinais.
 * Se mesmo assim o processo morrer a forca, a proxima execucao detecta o
 * processo orfao e se vira.
 */
function registerShutdown() {
  let stopping = false;
  const stop = async () => {
    if (stopping || !instance) return;
    stopping = true;
    try {
      await instance.stop();
      console.log("[db] PostgreSQL local encerrado.");
    } catch {
      // Proxima execucao reaproveita os dados de qualquer jeito.
    }
  };

  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) {
    process.once(signal, async () => {
      await stop();
      process.exit(0);
    });
  }
}

export async function stopLocalDatabase() {
  if (!instance) return;
  await instance.stop().catch(() => {});
  instance = null;
}
