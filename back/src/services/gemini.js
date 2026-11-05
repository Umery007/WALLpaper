import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import env from "../config/env.js";
import { HttpError, badRequest } from "../utils/http.js";

/*
 * O Gemini tem duas portas de entrada, com faturamento SEPARADO:
 *
 *  - vertex    (padrao): aiplatform.googleapis.com. Cobra do Google Cloud
 *              Billing, entao consome os creditos do seu projeto no Cloud.
 *  - aistudio: generativelanguage.googleapis.com. Cobra do saldo pre-pago
 *              proprio do AI Studio, que NAO usa os creditos do Cloud.
 *
 * A chave precisa combinar com a porta escolhida: uma chave do AI Studio da
 * 403 no Vertex e vice-versa. Troque pela variavel GEMINI_PROVIDER no .env.
 */
const PROVIDERS = {
  vertex: "https://aiplatform.googleapis.com/v1/publishers/google",
  aistudio: "https://generativelanguage.googleapis.com/v1beta",
};

const API_BASE = PROVIDERS[env.geminiProvider] ?? PROVIDERS.vertex;
const GENERATION_TIMEOUT_MS = 120_000;

const MIME_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

// Formatos que o modelo aceita. "9:16" e a tela do celular (vertical);
// "16:9" e a tela do computador (horizontal). Qualquer outro valor cai
// no padrao, para uma chamada antiga nao quebrar.
const ASPECT_RATIOS = new Set(["9:16", "16:9"]);
export const DEFAULT_ASPECT_RATIO = "9:16";

/** Enquadramento correto para cada formato, sem descartar o pedido do usuario. */
const COMPOSITION = {
  "9:16": [
    "Frame it as a vertical mobile wallpaper (9:16).",
    "Keep the main subjects away from the screen edges and leave balanced negative space for the clock and app icons.",
  ],
  "16:9": [
    "Frame it as a horizontal desktop wallpaper (16:9).",
    "Distribute the elements evenly across the wide frame and keep one side visually calm and free of key subjects, leaving room for desktop icons.",
  ],
};

function normalizeAspectRatio(aspectRatio) {
  return ASPECT_RATIOS.has(aspectRatio) ? aspectRatio : DEFAULT_ASPECT_RATIO;
}

/** Dá ao modelo um enquadramento de wallpaper sem descartar o pedido do usuario. */
function buildPrompt(userPrompt, isEdit, aspectRatio) {
  const composition = COMPOSITION[aspectRatio];

  if (isEdit) {
    return [
      "Edit the provided image according to the user's request.",
      "Render the result as a polished anime illustration, with expressive character design, clean confident linework, refined cel shading, rich colors, and cinematic lighting.",
      "If the source is already anime, preserve its characters, composition, palette, and distinctive art direction unless the user asks to change them.",
      "If the source is not anime, reinterpret its subject as anime while preserving the important identity, objects, and scene.",
      "Make only the requested changes; keep anatomy, facial features, hands, and background details coherent.",
      ...composition,
      "No text, watermarks, logos, borders, or UI elements.",
      "",
      `User request: ${userPrompt}`,
    ].join("\n");
  }

  return [
    `Create an original, premium-quality anime illustration as a ${aspectRatio === "16:9" ? "horizontal desktop" : "vertical mobile"} wallpaper.`,
    "Use expressive character design, clean precise linework, refined cel shading, detailed environments, rich but harmonious colors, and cinematic lighting with strong depth.",
    "Follow the user's requested subject and mood closely; make the scene visually clear, polished, and thoughtfully composed rather than generic.",
    ...composition,
    "Do not depict existing copyrighted characters or imitate a specific living artist; create an original design.",
    "No text, captions, watermarks, logos, borders, or UI elements.",
    "",
    `User request: ${userPrompt}`,
  ].join("\n");
}

/** Traduz os erros da API do Google em mensagens que o usuario entende. */
function translateApiError(status, payload) {
  const message = payload?.error?.message ?? "";

  if (status === 400 && /API key not valid/i.test(message)) {
    return new HttpError(503, "A chave da API do Gemini e invalida. Confira GEMINI_API_KEY no arquivo back/.env.");
  }
  if (status === 402) {
    const onde = env.geminiProvider === "vertex"
      ? "Confira o faturamento do projeto no Google Cloud (console.cloud.google.com/billing)."
      : "Ative o faturamento em https://ai.studio/projects.";
    return new HttpError(503, `A conta esta sem creditos para gerar imagens. ${onde}`);
  }
  if (status === 403) {
    // Causa mais comum: chave de um provedor usada no endpoint do outro.
    const outro = env.geminiProvider === "vertex" ? "aistudio" : "vertex";
    return new HttpError(
      503,
      `A chave nao tem permissao neste endpoint (GEMINI_PROVIDER=${env.geminiProvider}). `
        + `Verifique se ela foi criada para esse provedor -- uma chave de "${outro}" da 403 aqui.`,
    );
  }
  if (status === 404) {
    return new HttpError(
      503,
      `O modelo "${env.geminiImageModel}" nao esta disponivel para esta chave. `
        + "Ajuste GEMINI_IMAGE_MODEL no arquivo back/.env.",
    );
  }
  if (status === 429) {
    return new HttpError(
      503,
      "O limite de geracoes por minuto foi atingido. Espere um pouco e tente de novo.",
    );
  }
  if (status >= 500) {
    return new HttpError(503, "O servico de IA esta instavel no momento. Tente de novo em instantes.");
  }

  // Prompt recusado por politica de conteudo
  if (/safety|blocked|policy/i.test(message)) {
    return badRequest("Este pedido foi recusado pelo filtro de conteudo da IA. Tente descrever de outro jeito.");
  }

  return new HttpError(503, `Nao foi possivel gerar a imagem: ${message || `erro ${status}`}`);
}

/**
 * Gera uma imagem com o Gemini e salva em back/uploads/wallpapers.
 * Devolve { imageUrl, relativePath, model, mimeType }.
 */
export async function generateWallpaperImage(userPrompt, { sourceImage, aspectRatio } = {}) {
  if (!env.geminiApiKey) {
    throw new HttpError(
      503,
      "A geracao por IA ainda nao foi configurada. Preencha GEMINI_API_KEY no arquivo back/.env.",
    );
  }

  const ratio = normalizeAspectRatio(aspectRatio);
  const model = env.geminiImageModel;
  const url = `${API_BASE}/models/${encodeURIComponent(model)}:generateContent`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        // A chave vai no cabecalho, nunca na URL (evita vazamento em logs).
        "x-goog-api-key": env.geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            ...(sourceImage
              ? [{ inlineData: { mimeType: sourceImage.mimeType, data: sourceImage.data } }]
              : []),
            { text: buildPrompt(userPrompt, Boolean(sourceImage), ratio) },
          ],
        }],
        // O Vertex recusa IMAGE sozinho; o AI Studio aceita os dois formatos.
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          // 9:16 e a tela do celular; 16:9 e a do computador. "2K" sai em
          // ~1536x2752 (vertical) ou ~2752x1536 (horizontal), acima do
          // Full HD, para o download valer a pena.
          imageConfig: { aspectRatio: ratio, imageSize: "2K" },
        },
      }),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new HttpError(504, "A IA demorou demais para responder. Tente de novo.");
    }
    throw new HttpError(503, "Nao foi possivel falar com o servico de IA. Verifique sua conexao.");
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw translateApiError(response.status, payload);
  }

  const candidate = payload?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);

  if (!imagePart) {
    const refusal = parts.find((part) => part.text)?.text;
    const blockReason = payload?.promptFeedback?.blockReason ?? candidate?.finishReason;
    if (blockReason && blockReason !== "STOP") {
      throw badRequest("A IA recusou este pedido. Tente descrever o wallpaper de outro jeito.");
    }
    throw new HttpError(503, refusal
      ? `A IA respondeu sem imagem: ${refusal.slice(0, 180)}`
      : "A IA nao devolveu nenhuma imagem. Tente de novo.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  const extension = MIME_EXTENSIONS[mimeType] ?? "png";
  const buffer = Buffer.from(imagePart.inlineData.data, "base64");

  if (!buffer.length) {
    throw new HttpError(503, "A IA devolveu uma imagem vazia. Tente de novo.");
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const directory = resolve(env.uploadsDir, "wallpapers");
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, fileName), buffer);

  // Guardamos o caminho relativo: assim trocar a porta ou o dominio
  // (desenvolvimento -> producao) nao quebra as imagens ja geradas.
  const storedPath = `/uploads/wallpapers/${fileName}`;

  return {
    storedPath,
    imageUrl: `${env.publicUrl}${storedPath}`,
    model,
    mimeType,
    bytes: buffer.length,
  };
}

/** Sugere um titulo curto a partir do prompt, para a galeria. */
export function titleFromPrompt(prompt) {
  const clean = prompt.replace(/\s+/g, " ").trim();
  if (clean.length <= 60) return clean;
  return `${clean.slice(0, 57).trimEnd()}...`;
}
