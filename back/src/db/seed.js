import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import pool, { query } from "./pool.js";
import { migrate } from "./migrate.js";
import { ensureLocalDatabase } from "./localPostgres.js";

/**
 * Popula a galeria com wallpapers de demonstracao e uma conta de teste,
 * para o frontend ter conteudo assim que subir. Pode rodar varias vezes.
 */

const DEMO_USER = {
  name: "Equipe WA1PAPER",
  email: "demo@wa1paper.app",
  username: "wa1paper",
  password: "wa1paper123",
};

const WALLPAPERS = [
  { title: "Noite neon na cidade",      category: "Cidade",    tags: ["neon", "cidade", "noite"],       seed: "neon-city" },
  { title: "Montanhas ao amanhecer",    category: "Natureza",  tags: ["montanha", "amanhecer"],         seed: "mountains" },
  { title: "Oceano em calmaria",        category: "Natureza",  tags: ["mar", "azul", "calma"],          seed: "ocean" },
  { title: "Floresta de nevoa",         category: "Natureza",  tags: ["floresta", "nevoa", "verde"],    seed: "forest" },
  { title: "Deserto ao entardecer",     category: "Paisagem",  tags: ["deserto", "laranja"],            seed: "desert" },
  { title: "Ceu estrelado",             category: "Espaco",    tags: ["estrelas", "noite", "galaxia"],  seed: "stars" },
  { title: "Gradiente suave",           category: "Abstrato",  tags: ["gradiente", "minimalista"],      seed: "gradient" },
  { title: "Formas geometricas",        category: "Abstrato",  tags: ["geometria", "cores"],            seed: "geometry" },
  { title: "Chuva na janela",           category: "Cidade",    tags: ["chuva", "janela", "melancolia"], seed: "rain" },
  { title: "Aurora boreal",             category: "Natureza",  tags: ["aurora", "verde", "norte"],      seed: "aurora" },
  { title: "Arquitetura minimalista",   category: "Minimal",   tags: ["arquitetura", "clean"],          seed: "architecture" },
  { title: "Campo de lavanda",          category: "Natureza",  tags: ["flores", "roxo", "campo"],       seed: "lavender" },
];

async function seed() {
  await migrate();

  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  const { rows: userRows } = await query(
    `INSERT INTO users (name, email, username, password_hash, plan, credits)
     VALUES ($1, $2, $3, $4, 'pro', 100)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [DEMO_USER.name, DEMO_USER.email, DEMO_USER.username, passwordHash],
  );
  const userId = userRows[0].id;

  let inserted = 0;
  for (const item of WALLPAPERS) {
    const imageUrl = `https://picsum.photos/seed/${item.seed}/1080/1920`;
    const { rowCount } = await query(
      `INSERT INTO wallpapers (user_id, title, description, image_url, category, tags, source)
       SELECT $1, $2, $3, $4, $5, $6, 'seed'
       WHERE NOT EXISTS (SELECT 1 FROM wallpapers WHERE image_url = $4)`,
      [userId, item.title, `Wallpaper de demonstracao: ${item.title.toLowerCase()}.`, imageUrl, item.category, item.tags],
    );
    inserted += rowCount;
  }

  const { rows: totals } = await query("SELECT COUNT(*)::int AS total FROM wallpapers");

  console.log(`[seed] conta de demonstracao: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  console.log(`[seed] ${inserted} wallpaper(s) novo(s); ${totals[0].total} no total.`);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  try {
    await ensureLocalDatabase();
    await seed();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("[seed] falhou:", error.message);
    process.exit(1);
  }
}

export default seed;
