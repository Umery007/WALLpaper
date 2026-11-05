import crypto from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import env, { BACKEND_ROOT } from "../config/env.js";
import { badRequest } from "../utils/http.js";

/**
 * Guarda a foto de perfil enviada pelo usuario.
 *
 * A imagem chega como data URL (o navegador le o arquivo com FileReader),
 * entao nao precisamos de upload multipart. O arquivo vai para o disco e no
 * banco fica so o endereco -- guardar o base64 em coluna faria cada consulta
 * de usuario carregar megabytes a toa.
 */

const AVATARS_DIR = resolve(BACKEND_ROOT, "uploads", "avatars");

const TIPOS_ACEITOS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

// O express.json aceita 1 MB de corpo e o base64 cresce ~33%, entao o arquivo
// precisa caber em ~700 KB. O frontend ja reduz a imagem antes de enviar, o
// que deixa uma foto comum bem abaixo disso.
const TAMANHO_MAXIMO = 700 * 1024;

/** Separa "data:image/png;base64,AAA..." em tipo e bytes. */
function parseDataUrl(dataUrl) {
  const match = /^data:([a-z]+\/[a-z0-9.+-]+);base64,(.+)$/is.exec(dataUrl ?? "");
  if (!match) {
    throw badRequest("Envie a imagem no formato correto (data URL em base64).");
  }

  const [, mimeType, base64] = match;
  const extensao = TIPOS_ACEITOS[mimeType.toLowerCase()];
  if (!extensao) {
    throw badRequest("A foto deve ser PNG, JPEG ou WebP.");
  }

  let bytes;
  try {
    bytes = Buffer.from(base64, "base64");
  } catch {
    throw badRequest("Nao foi possivel ler a imagem enviada.");
  }

  if (bytes.length === 0) throw badRequest("A imagem enviada esta vazia.");
  if (bytes.length > TAMANHO_MAXIMO) {
    throw badRequest("A foto de perfil deve ter no maximo 700 KB.");
  }

  return { bytes, extensao };
}

/**
 * Salva a nova foto e devolve a URL publica.
 * Nao mexe no banco: quem chama decide quando gravar.
 */
export async function saveAvatarImage(dataUrl) {
  const { bytes, extensao } = parseDataUrl(dataUrl);

  await mkdir(AVATARS_DIR, { recursive: true });
  const nome = `${crypto.randomUUID()}.${extensao}`;
  await writeFile(resolve(AVATARS_DIR, nome), bytes);

  return `${env.publicUrl.replace(/\/+$/, "")}/uploads/avatars/${nome}`;
}

/**
 * Apaga a foto anterior, se ela for nossa.
 * Falhar aqui nao pode atrapalhar a troca: no pior caso sobra um arquivo.
 */
export async function removeAvatarImage(avatarUrl) {
  if (!avatarUrl || !avatarUrl.includes("/uploads/avatars/")) return;

  try {
    // basename impede que um ".." no caminho escape da pasta.
    const arquivo = basename(new URL(avatarUrl, env.publicUrl).pathname);
    await unlink(resolve(AVATARS_DIR, arquivo));
  } catch {
    // Arquivo ja removido ou endereco externo: nada a fazer.
  }
}
