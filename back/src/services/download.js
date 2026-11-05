import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import env, { BACKEND_ROOT } from "../config/env.js";
import { HttpError, notFound } from "../utils/http.js";

/**
 * Entrega o arquivo de um wallpaper como download.
 *
 * As imagens vem de dois lugares: as geradas por IA ficam em
 * back/uploads/wallpapers, e as de demonstracao sao URLs externas. Aqui os
 * dois casos viram o mesmo resultado para quem clica em "Baixar".
 */

const UPLOADS_DIR = resolve(BACKEND_ROOT, "uploads", "wallpapers");
const FETCH_TIMEOUT_MS = 30_000;

const EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Transforma o titulo em um nome de arquivo seguro. */
function buildFileName(title, extension) {
  const limpo = String(title ?? "wallpaper")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")       // tira acentos
    .replace(/[^a-zA-Z0-9]+/g, "-")        // o resto vira hifen
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .toLowerCase();

  return `wa1paper-${limpo || "wallpaper"}.${extension}`;
}

/** A imagem esta no nosso proprio disco? */
function resolveLocalPath(imageUrl) {
  let caminho = imageUrl;

  // Pode vir como URL absoluta nossa ou ja como caminho relativo.
  if (/^https?:\/\//i.test(imageUrl)) {
    let url;
    try {
      url = new URL(imageUrl);
    } catch {
      return null;
    }
    const nosso = new URL(env.publicUrl);
    if (url.host !== nosso.host) return null;
    caminho = url.pathname;
  }

  if (!caminho.startsWith("/uploads/wallpapers/")) return null;

  // basename impede que "../" escape da pasta de uploads.
  const arquivo = basename(caminho);
  return resolve(UPLOADS_DIR, arquivo);
}

/** Envia um arquivo que esta no disco. */
async function streamFromDisk(caminho, titulo, res, inline) {
  let info;
  try {
    info = await stat(caminho);
  } catch {
    throw notFound("O arquivo deste wallpaper nao foi encontrado no servidor.");
  }

  const extensao = caminho.split(".").pop()?.toLowerCase() ?? "png";
  const tipo = Object.entries(EXTENSIONS).find(([, ext]) => ext === extensao)?.[0] ?? "image/png";

  res.setHeader("Content-Type", tipo);
  res.setHeader("Content-Length", info.size);
  res.setHeader("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${buildFileName(titulo, extensao)}"`);
  res.setHeader("Cache-Control", "private, max-age=3600");

  await pipeline(createReadStream(caminho), res);
}

/** Busca uma imagem externa e repassa como download. */
async function streamFromRemote(imageUrl, titulo, res, inline) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let resposta;
  try {
    resposta = await fetch(imageUrl, { signal: controller.signal, redirect: "follow" });
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      throw new HttpError(504, "A imagem demorou demais para responder. Tente de novo.");
    }
    throw new HttpError(502, "Nao foi possivel buscar a imagem original.");
  }

  if (!resposta.ok || !resposta.body) {
    clearTimeout(timeout);
    throw new HttpError(502, "A imagem original nao esta disponivel no momento.");
  }

  const tipo = resposta.headers.get("content-type") ?? "image/jpeg";
  const extensao = EXTENSIONS[tipo.split(";")[0].trim()] ?? "jpg";
  const tamanho = resposta.headers.get("content-length");

  res.setHeader("Content-Type", tipo);
  if (tamanho) res.setHeader("Content-Length", tamanho);
  res.setHeader("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${buildFileName(titulo, extensao)}"`);

  try {
    await pipeline(Readable.fromWeb(resposta.body), res);
  } finally {
    clearTimeout(timeout);
  }
}

/** Ponto de entrada: decide entre disco e rede. */
export async function streamWallpaperFile(wallpaper, res, { inline = false } = {}) {
  const imageUrl = wallpaper.image_url;
  if (!imageUrl) throw notFound("Este wallpaper nao tem imagem.");

  const caminhoLocal = resolveLocalPath(imageUrl);
  if (caminhoLocal) {
    await streamFromDisk(caminhoLocal, wallpaper.title, res, inline);
    return;
  }

  // So seguimos links http(s): evita file:// e afins.
  if (!/^https?:\/\//i.test(imageUrl)) {
    throw new HttpError(422, "O endereco da imagem deste wallpaper e invalido.");
  }

  await streamFromRemote(imageUrl, wallpaper.title, res, inline);
}
