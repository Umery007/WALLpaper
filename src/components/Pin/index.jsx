import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import wallpaper from "../../assets/img-cards/paper.jpeg";
import useAuth from "../../contexts/useAuth";
import { API_BASE, apiRequest, isProtectedWallpaperImage } from "../../services/api";
import {
  ActionButton,
  ActionRow,
  ArtistAvatar,
  ArtistCard,
  ArtistInfo,
  BackButton,
  Comment,
  CommentAvatar,
  CommentComposer,
  CommentInput,
  Comments,
  DetailColumn,
  DetailHeader,
  DetailLabel,
  DownloadButton,
  FeaturedImage,
  FeaturedImageWrap,
  ImageBadge,
  ImageColumn,
  ImageControls,
  ImageMeta,
  ImageStage,
  MainLayout,
  Page,
  PinCard,
  PinGrid,
  PinImage,
  PinImageWrap,
  PinMeta,
  PinTitle,
  SectionHeading,
  SmallAction,
  Tag,
  Tags,
  Toast,
  TopLine,
} from "./styles";

const relatedPins = [
  {
    id: "blue-hour",
    title: "Cidade azul depois da chuva",
    creator: "mika.studio",
    position: "10% 45%",
    tone: "blue",
    height: "short",
  },
  {
    id: "neon-night",
    title: "Luzes que nunca dormem",
    creator: "noite.exe",
    position: "50% 38%",
    tone: "violet",
    height: "tall",
  },
  {
    id: "after-hours",
    title: "Depois do último trem",
    creator: "kai.visuals",
    position: "88% 55%",
    tone: "warm",
    height: "medium",
  },
  {
    id: "midnight",
    title: "Um lugar para recomeçar",
    creator: "mika.studio",
    position: "30% 80%",
    tone: "cool",
    height: "medium",
  },
  {
    id: "city-glow",
    title: "Neon sob o céu de inverno",
    creator: "pixel.nova",
    position: "72% 25%",
    tone: "rose",
    height: "tall",
  },
  {
    id: "last-stop",
    title: "A cidade vista da janela",
    creator: "kai.visuals",
    position: "4% 75%",
    tone: "blue",
    height: "short",
  },
];

const initialComments = [
  {
    id: 1,
    author: "Lia",
    initials: "L",
    message: "A iluminação ficou incrível. Já virou meu fundo de tela!",
  },
  {
    id: 2,
    author: "Ravi",
    initials: "R",
    message: "Essa paleta de azul com neon é perfeita.",
  },
];

export default function Pin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const wallpaperData = location.state?.wallpaper;
  const [selectedPin, setSelectedPin] = useState(null);
  const [isLiked, setIsLiked] = useState(Boolean(wallpaperData?.favorited || wallpaperData?.favorited_at));
  const [isLikePending, setIsLikePending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [toast, setToast] = useState("");
  // Resolucao real da imagem, lida quando ela termina de carregar. Evita
  // anunciar um tamanho que o arquivo nao tem.
  const [resolucao, setResolucao] = useState(null);

  // Seguir o autor do wallpaper. Chega da API para refletir o estado real.
  const autorId = wallpaperData?.creator_id ?? null;
  const [follow, setFollow] = useState({ carregado: false, is_following: false, followers_count: 0 });
  const [followPendente, setFollowPendente] = useState(false);

  useEffect(() => {
    if (!autorId) return undefined;

    let ativo = true;
    apiRequest(`/users/${encodeURIComponent(autorId)}`)
      .then((dados) => {
        if (!ativo || !dados?.profile) return;
        setFollow({
          carregado: true,
          is_following: dados.profile.is_following,
          followers_count: dados.profile.followers_count,
        });
      })
      .catch(() => {
        // Sem os numeros o botao fica escondido; nao atrapalha o resto.
      });

    return () => { ativo = false; };
  }, [autorId]);

  async function alternarSeguir() {
    if (!autorId || followPendente) return;
    if (!user) {
      showToast("Entre na sua conta para seguir alguem.");
      return;
    }

    setFollowPendente(true);
    const seguindoAgora = follow.is_following;
    try {
      const { stats } = await apiRequest(`/users/${encodeURIComponent(autorId)}/follow`, {
        method: seguindoAgora ? "DELETE" : "POST",
      });
      setFollow({ carregado: true, ...stats });
      showToast(seguindoAgora ? `Você deixou de seguir ${creator}.` : `Agora você segue ${creator}.`);
    } catch (error) {
      showToast(error.message);
    } finally {
      setFollowPendente(false);
    }
  }

  const currentPin = useMemo(
    () => selectedPin ?? relatedPins[1],
    [selectedPin],
  );
  const title = selectedPin?.title ?? wallpaperData?.title ?? "A cidade acende depois da chuva";
  const creator = selectedPin?.creator ?? wallpaperData?.creator_name ?? "membro WA1PAPER";
  const imageUrl = wallpaperData?.image_url || wallpaper;
  const description = wallpaperData
    ? wallpaperData.description || "Este wallpaper não tem descrição."
    : "Ruas molhadas, letreiros acesos e aquele instante tranquilo em que a cidade parece pertencer só a você.";
  const tags = Array.isArray(wallpaperData?.tags) ? wallpaperData.tags : [];

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  async function toggleFavorite() {
    if (isLikePending) return;
    if (!wallpaperData?.id) {
      setIsLiked((liked) => !liked);
      return;
    }
    if (!user) {
      navigate("/cadastro");
      return;
    }
    setIsLikePending(true);
    try {
      await apiRequest(`/favorites/${encodeURIComponent(wallpaperData.id)}`, {
        method: isLiked ? "DELETE" : "POST",
      });
      setIsLiked((liked) => !liked);
    } catch (error) {
      showToast(error.message);
    } finally {
      setIsLikePending(false);
    }
  }

  function addComment(event) {
    event.preventDefault();
    const message = commentText.trim();
    if (!message) return;

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        author: "Você",
        initials: "V",
        message,
      },
    ]);
    setCommentText("");
  }

  return (
    <Page>
      <TopLine>
        <BackButton type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} aria-hidden="true" />
          Voltar para explorar
        </BackButton>
        <span>INSPIRAÇÃO / WALLPAPERS</span>
      </TopLine>

      <MainLayout>
        <ImageColumn>
          <ImageStage $tone={currentPin.tone}>
            <FeaturedImageWrap>
              <FeaturedImage
                src={imageUrl}
                crossOrigin={isProtectedWallpaperImage(imageUrl) ? "use-credentials" : undefined}
                onLoad={(event) => setResolucao({
                  largura: event.target.naturalWidth,
                  altura: event.target.naturalHeight,
                })}
                alt={`Wallpaper ${title}`}
                $position={currentPin.position}
                $tone={currentPin.tone}
              />
              <ImageBadge>
                <Sparkles size={13} aria-hidden="true" />
              {wallpaperData?.category === "IA" ? "CRIADO COM IA" : "WA1PAPER"}
              </ImageBadge>
              <ImageControls>
                <SmallAction
                  type="button"
                  aria-label="Ampliar arte"
                  onClick={() => showToast("Prévia em alta resolução")}
                >
                  <ArrowUpRight size={17} aria-hidden="true" />
                </SmallAction>
                <SmallAction
                  type="button"
                  aria-label="Mais opções"
                  onClick={() => showToast("Mais opções em breve")}
                >
                  <MoreHorizontal size={17} aria-hidden="true" />
                </SmallAction>
              </ImageControls>
            </FeaturedImageWrap>
            <ImageMeta>
              <span>WA1PAPER SELECTION</span>
              <span>{wallpaperData ? "WALLPAPER" : "WALLPAPER · 8K"}</span>
            </ImageMeta>
          </ImageStage>
        </ImageColumn>

        <DetailColumn>
          <DetailHeader>
            <div>
              <DetailLabel>UMA JANELA PARA OUTRO MUNDO</DetailLabel>
              <PinTitle>{title}</PinTitle>
            </div>
            <ActionRow>
              <ActionButton
                type="button"
                $active={isLiked}
                disabled={isLikePending}
                aria-label={isLiked ? "Remover curtida" : "Curtir wallpaper"}
                onClick={toggleFavorite}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
                <span>{isLiked ? "129" : "128"}</span>
              </ActionButton>
              <ActionButton
                type="button"
                $active={isSaved}
                onClick={() => {
                  setIsSaved((saved) => !saved);
                  showToast(isSaved ? "Removido da sua coleção" : "Salvo na sua coleção");
                }}
              >
                {isSaved ? <Check size={17} aria-hidden="true" /> : <span>Salvar</span>}
                {isSaved && <span>Salvo</span>}
              </ActionButton>
            </ActionRow>
          </DetailHeader>

          <ArtistCard>
            <ArtistAvatar aria-hidden="true">H</ArtistAvatar>
            <ArtistInfo>
              <strong>{creator}</strong>
              <span>
                {follow.carregado
                  ? `${follow.followers_count} ${follow.followers_count === 1 ? "seguidor" : "seguidores"}`
                  : "Artista da comunidade"}
              </span>
            </ArtistInfo>
            {autorId && user?.id !== autorId && (
              <button type="button" disabled={followPendente} onClick={alternarSeguir}>
                {follow.is_following ? "Seguindo" : "Seguir"}
              </button>
            )}
          </ArtistCard>

          <p>{description}</p>

          <Tags aria-label="Temas do wallpaper">
            {(tags.length ? tags : wallpaperData ? [] : ["noiteurbana", "neon", "wallpaper"]).map((tag) => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </Tags>

          <DownloadButton
            href={wallpaperData?.id
              ? `${API_BASE}/wallpapers/${encodeURIComponent(wallpaperData.id)}/download`
              : imageUrl}
            download={wallpaperData?.id ? undefined : `wa1paper-${title}.png`}
          >
            <ArrowDownToLine size={18} aria-hidden="true" />
            Baixar wallpaper
            {resolucao && (
              <span>
                {resolucao.largura >= 1080 && resolucao.altura >= 1920
                  ? "Full HD"
                  : `${resolucao.largura}x${resolucao.altura}`}
              </span>
            )}
          </DownloadButton>

          <Comments>
            <SectionHeading>
              <div>
                <h2>Conversa da comunidade</h2>
                <span>{comments.length} comentários</span>
              </div>
              <MessageCircle size={18} aria-hidden="true" />
            </SectionHeading>
            {comments.map((comment) => (
              <Comment key={comment.id}>
                <CommentAvatar>{comment.initials}</CommentAvatar>
                <div>
                  <strong>{comment.author}</strong>
                  <p>{comment.message}</p>
                </div>
              </Comment>
            ))}
            <CommentComposer onSubmit={addComment}>
              <CommentInput
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Compartilhe o que achou..."
                aria-label="Escreva um comentário"
              />
              <button type="submit" aria-label="Enviar comentário" disabled={!commentText.trim()}>
                <Send size={16} aria-hidden="true" />
              </button>
            </CommentComposer>
          </Comments>
        </DetailColumn>
      </MainLayout>

      <section>
        <SectionHeading $related>
          <div>
            <DetailLabel>MAIS PARA DESCOBRIR</DetailLabel>
            <h2>Continue explorando</h2>
          </div>
          <span>Inspiração que combina com este pin</span>
        </SectionHeading>
        <PinGrid>
          {relatedPins.map((pin) => (
            <PinCard
              key={pin.id}
              type="button"
              onClick={() => {
                setSelectedPin(pin);
                setIsLiked(false);
                setIsSaved(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={`Ver pin: ${pin.title}`}
            >
              <PinImageWrap $height={pin.height}>
                <PinImage
                  src={wallpaper}
                  alt=""
                  $position={pin.position}
                  $tone={pin.tone}
                />
                <span>Ver wallpaper <ArrowUpRight size={14} aria-hidden="true" /></span>
              </PinImageWrap>
              <PinMeta>
                <strong>{pin.title}</strong>
                <span>por {pin.creator}</span>
              </PinMeta>
            </PinCard>
          ))}
        </PinGrid>
      </section>
      {toast && <Toast role="status">{toast}</Toast>}
    </Page>
  );
}
