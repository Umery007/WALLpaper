import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, Star } from "lucide-react";
import { apiRequest, isProtectedWallpaperImage } from "../../services/api";
import * as S from "./styles";

/**
 * Escolhe wallpapers para colocar dentro de uma pasta.
 *
 * Duas origens, em abas:
 *  - Favoritos: traz o que a pessoa ja favoritou e deixa marcar varios.
 *  - Gerar com IA: cria um wallpaper na hora; ele ja entra marcado.
 *
 * Devolve os itens no mesmo formato que o resto do app usa para pastas:
 * { id, image, title, tags }.
 */
export default function SeletorWallpapers({ selecionados, onChange }) {
  const [aba, setAba] = useState("favoritos");

  // Um estado so, com o resultado ja carregado, para nao precisar chamar
  // setState dentro do efeito antes da resposta chegar.
  const [resultado, setResultado] = useState({ carregado: false, wallpapers: [], erro: "" });
  const [busca, setBusca] = useState("");

  const [prompt, setPrompt] = useState("");
  const [gerando, setGerando] = useState(false);
  const [erroGeracao, setErroGeracao] = useState("");

  const marcados = new Set(selecionados.map((item) => item.id));

  useEffect(() => {
    if (aba !== "favoritos" || resultado.carregado) return undefined;

    let ativo = true;
    apiRequest("/favorites")
      .then((dados) => {
        if (ativo) setResultado({ carregado: true, wallpapers: dados?.wallpapers ?? [], erro: "" });
      })
      .catch((error) => {
        if (ativo) setResultado({ carregado: true, wallpapers: [], erro: error.message });
      });

    return () => { ativo = false; };
  }, [aba, resultado.carregado]);

  function paraItemDePasta(wallpaper) {
    return {
      id: String(wallpaper.id),
      image: wallpaper.image_url,
      title: wallpaper.title || "Wallpaper",
      tags: wallpaper.tags ?? [],
    };
  }

  function alternar(wallpaper) {
    const item = paraItemDePasta(wallpaper);
    onChange(marcados.has(item.id)
      ? selecionados.filter((atual) => atual.id !== item.id)
      : [...selecionados, item]);
  }

  async function gerar(event) {
    event.preventDefault();
    const texto = prompt.trim();
    if (!texto || gerando) return;

    setGerando(true);
    setErroGeracao("");
    try {
      const { wallpaper } = await apiRequest("/images/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: texto }),
      });
      // Ja entra marcado: foi criado para esta pasta.
      onChange([...selecionados, paraItemDePasta(wallpaper)]);
      setPrompt("");
    } catch (error) {
      setErroGeracao(error.message);
    } finally {
      setGerando(false);
    }
  }

  const { wallpapers: favoritos, erro: erroFavoritos } = resultado;
  const carregandoFavoritos = aba === "favoritos" && !resultado.carregado;

  const favoritosFiltrados = busca.trim()
    ? favoritos.filter((item) => {
      const alvo = `${item.title} ${item.description} ${(item.tags ?? []).join(" ")}`.toLowerCase();
      return alvo.includes(busca.trim().toLowerCase());
    })
    : favoritos;

  return (
    <S.Bloco>
      <S.Abas role="tablist" aria-label="De onde vêm os wallpapers">
        <S.Aba
          type="button"
          role="tab"
          aria-selected={aba === "favoritos"}
          $ativa={aba === "favoritos"}
          onClick={() => setAba("favoritos")}
        >
          <Star size={15} aria-hidden="true" />
          Dos favoritos
        </S.Aba>
        <S.Aba
          type="button"
          role="tab"
          aria-selected={aba === "ia"}
          $ativa={aba === "ia"}
          onClick={() => setAba("ia")}
        >
          <Sparkles size={15} aria-hidden="true" />
          Gerar com IA
        </S.Aba>
      </S.Abas>

      {aba === "favoritos" && (
        <>
          <S.CampoBusca
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar nos seus favoritos..."
            aria-label="Buscar nos favoritos"
          />

          {carregandoFavoritos && <S.Aviso role="status">Carregando seus favoritos...</S.Aviso>}
          {erroFavoritos && <S.Aviso role="alert">{erroFavoritos}</S.Aviso>}

          {!carregandoFavoritos && !erroFavoritos && favoritos.length === 0 && (
            <S.Aviso>
              Você ainda não favoritou nenhum wallpaper. Toque no coração de um wallpaper
              da galeria para ele aparecer aqui.
            </S.Aviso>
          )}

          {!carregandoFavoritos && favoritos.length > 0 && favoritosFiltrados.length === 0 && (
            <S.Aviso>Nenhum favorito combina com “{busca.trim()}”.</S.Aviso>
          )}

          {favoritosFiltrados.length > 0 && (
            <S.Grade>
              {favoritosFiltrados.map((wallpaper) => {
                const marcado = marcados.has(String(wallpaper.id));
                return (
                  <S.Miniatura
                    key={wallpaper.id}
                    type="button"
                    $marcada={marcado}
                    aria-pressed={marcado}
                    aria-label={`${marcado ? "Remover" : "Adicionar"} ${wallpaper.title}`}
                    onClick={() => alternar(wallpaper)}
                  >
                    <img
                      src={wallpaper.image_url}
                      alt=""
                      loading="lazy"
                      crossOrigin={isProtectedWallpaperImage(wallpaper.image_url) ? "use-credentials" : undefined}
                    />
                    {marcado && (
                      <S.Selo aria-hidden="true">
                        <Check size={14} strokeWidth={3} />
                      </S.Selo>
                    )}
                  </S.Miniatura>
                );
              })}
            </S.Grade>
          )}
        </>
      )}

      {aba === "ia" && (
        <S.AreaIA>
          <S.CampoPrompt
            value={prompt}
            maxLength={500}
            disabled={gerando}
            placeholder="Descreva o wallpaper. Ex.: floresta de bambu com neblina ao amanhecer"
            aria-label="Descrição do wallpaper a gerar"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) gerar(event);
            }}
          />
          <S.BotaoGerar type="button" onClick={gerar} disabled={gerando || !prompt.trim()}>
            {gerando ? <Loader2 size={16} className="girando" /> : <Sparkles size={16} />}
            {gerando ? "Gerando..." : "Gerar e adicionar"}
          </S.BotaoGerar>

          {gerando && <S.Aviso role="status">A imagem leva cerca de 15 segundos para ficar pronta.</S.Aviso>}
          {erroGeracao && <S.Aviso role="alert">{erroGeracao}</S.Aviso>}
        </S.AreaIA>
      )}

      {selecionados.length > 0 && (
        <S.Resumo>
          <strong>{selecionados.length}</strong>
          {selecionados.length === 1 ? " wallpaper escolhido" : " wallpapers escolhidos"}
          <S.BotaoLimpar type="button" onClick={() => onChange([])}>
            limpar
          </S.BotaoLimpar>
        </S.Resumo>
      )}
    </S.Bloco>
  );
}
