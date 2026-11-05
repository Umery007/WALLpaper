/**
 * Reduz uma imagem escolhida pelo usuario antes de enviar ao servidor.
 *
 * Foto de celular costuma ter vários MB -- grande demais para o corpo da
 * requisicao e desnecessario para um avatar de poucos pixels na tela.
 * Redesenhando num canvas quadrado, uma foto comum cai para algumas dezenas
 * de KB e todos os avatares ficam no mesmo formato.
 */

const LADO_PADRAO = 512;
const QUALIDADE = 0.9;

export function reduzirImagemQuadrada(arquivo, lado = LADO_PADRAO) {
  return new Promise((resolve, reject) => {
    if (!arquivo.type.startsWith("image/")) {
      reject(new Error("Escolha um arquivo de imagem."));
      return;
    }

    const url = URL.createObjectURL(arquivo);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const ctx = canvas.getContext("2d");

        // Recorta o centro: a parte que importa numa foto de perfil.
        const corte = Math.min(img.naturalWidth, img.naturalHeight);
        const x = (img.naturalWidth - corte) / 2;
        const y = (img.naturalHeight - corte) / 2;
        ctx.drawImage(img, x, y, corte, corte, 0, 0, lado, lado);

        // PNG preserva transparencia; o resto vira JPEG, bem menor.
        const temTransparencia = arquivo.type === "image/png";
        resolve(canvas.toDataURL(
          temTransparencia ? "image/png" : "image/jpeg",
          temTransparencia ? undefined : QUALIDADE,
        ));
      } catch {
        reject(new Error("Não foi possível preparar a imagem."));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível abrir essa imagem."));
    };

    img.src = url;
  });
}
