import { useEffect, useState } from "react";
import { Download, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  CardContainer,
  TopBar,
  TagList,
  Tag,
  HeartButton,
  ImageWrapper,
  Image,
  Overlay,
  DownloadButton,
  CardsWrapper,
  CardActions,
  MoreButton,
  ActionMenu,
  ActionMenuButton,
  SaveDialogOverlay,
  SaveDialog,
  SaveDialogHeader,
  SaveDialogClose,
  FolderOptions,
  FolderOption,
  FolderCreateForm,
  FolderStatus,
  GalleryStatus,
  GalleryActions,
  LoadMoreButton,
} from "./styles";

import { readSavedWallpaperFolders, writeSavedWallpaperFolders } from "../../utils/savedWallpapers";
import { API_BASE, apiRequest, buildQuery, isProtectedWallpaperImage } from "../../services/api";
import useAuth from "../../contexts/useAuth";

/**
 * Baixa o wallpaper pela API, na maior resolucao disponivel.
 *
 * O atributo "download" do HTML e ignorado quando o link aponta para outra
 * origem -- o navegador abre a imagem em vez de baixar. A rota
 * /wallpapers/:id/download devolve o arquivo com Content-Disposition, entao
 * o download acontece de verdade e com o nome e a extensao certos.
 */
function baixarWallpaper(id, urlDaImagem) {
  if (!id) {
    // Sem id (ex.: previa ainda nao salva) resta abrir a imagem.
    window.open(urlDaImagem, "_blank", "noopener");
    return;
  }

  const link = document.createElement("a");
  link.href = `${API_BASE}/wallpapers/${encodeURIComponent(id)}/download`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function Card({
  id,
  image,
  title = "Wallpaper",
  description = "",
  category = "",
  creatorName = "",
  // Necessario para seguir o autor a partir da tela do wallpaper.
  creatorId = null,
  tags = [],
  liked = false,
  onDownload,
  onLikeToggle,
  showDownload = true,
}) {
  const [isLiked, setIsLiked] = useState(!!liked);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFavorited = onLikeToggle ? Boolean(liked) : isLiked;

  async function openSaveDialog() {
    try {
      const savedFolders = user
        ? (await apiRequest("/folders")).folders.filter((folder) => folder.visibility !== "public")
        : readSavedWallpaperFolders().filter((folder) => folder.visibility !== "public");
      setFolders(savedFolders);
      setSelectedFolder(savedFolders[0]?.id ?? "");
      setFolderError("");
    } catch (error) {
      setFolderError(error.message || "Não foi possível carregar suas pastas.");
    }
    setIsSaveDialogOpen(true);
  }

  function openPin() {
    navigate("/pin", {
      state: {
        wallpaper: {
          id,
          title,
          description,
          category,
          creator_id: creatorId,
          creator_name: creatorName,
          image_url: image,
          tags,
          favorited: liked,
        },
      },
    });
  }

  function handleCardKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPin();
    }
  }

  async function toggleLike(event) {
    event.stopPropagation();
    if (isLikePending) return;
    setIsLikePending(true);
    try {
      if (onLikeToggle) {
        await onLikeToggle(id, isFavorited);
      } else {
        setIsLiked((value) => !value);
      }
    } catch (error) {
      window.alert(error.message || "Não foi possível atualizar o favorito.");
    } finally {
      setIsLikePending(false);
    }
  }

  function downloadImage(event) {
    event.stopPropagation();
    if (onDownload) {
      onDownload();
      return;
    }

    baixarWallpaper(id, image);
  }

  function persistFolders(nextFolders) {
    try {
      writeSavedWallpaperFolders(nextFolders, user?.id);
      setFolders(nextFolders);
      setFolderError("");
      return true;
    } catch (error) {
      setFolderError(error.message || "Não foi possível salvar a pasta.");
      return false;
    }
  }

  async function createFolder(event) {
    event.preventDefault();
    const name = newFolderName.trim();
    if (!name) {
      setFolderError("Digite um nome para a pasta.");
      return;
    }

    try {
      let folder;
      if (user) {
        ({ folder } = await apiRequest("/folders", {
          method: "POST",
          body: JSON.stringify({ name, visibility: "private" }),
        }));
        setFolders((current) => [...current, folder]);
      } else {
        folder = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, items: [] };
        if (!persistFolders([...folders, folder])) return;
      }
      setSelectedFolder(folder.id);
      setNewFolderName("");
      setFolderError("");
    } catch (error) {
      setFolderError(error.message || "Não foi possível criar a pasta.");
    }
  }

  async function saveToFolder() {
    if (!selectedFolder) {
      setFolderError("Crie ou selecione uma pasta para continuar.");
      return;
    }

    try {
      if (user) {
        if (!id) throw new Error("Este wallpaper ainda nao esta salvo e nao pode ser adicionado a uma pasta.");
        await apiRequest(`/folders/${encodeURIComponent(selectedFolder)}/items`, {
          method: "POST",
          body: JSON.stringify({ wallpaper_id: id }),
        });
        setFolders((current) => current.map((folder) => (
          folder.id === selectedFolder
            ? {
              ...folder,
              items: folder.items.some((item) => item.id === id)
                ? folder.items
                : [...folder.items, { id, image, title, tags }],
            }
            : folder
        )));
      } else {
        const itemId = String(id ?? image);
        const nextFolders = folders.map((folder) => (
          folder.id === selectedFolder
            ? {
              ...folder,
              items: folder.items.some((item) => item.id === itemId)
                ? folder.items
                : [...folder.items, { id: itemId, image, title: tags.join(" · ") || "Wallpaper", tags }],
            }
            : folder
        ));
        if (!persistFolders(nextFolders)) return;
      }
      setFolderError("");
      setIsSaveDialogOpen(false);
    } catch (error) {
      setFolderError(error.message || "Não foi possível salvar o wallpaper na pasta.");
    }
  }

  return (
    <CardContainer
      role="link"
      tabIndex={0}
      aria-label="Abrir detalhes do wallpaper"
      onClick={openPin}
      onKeyDown={handleCardKeyDown}
    >
      <ImageWrapper>
        <Image
          src={image}
          alt={tags.join(", ") || "Wallpaper"}
          crossOrigin={isProtectedWallpaperImage(image) ? "use-credentials" : undefined}
        />

        <TopBar>
          <TagList>
            {tags.map((tag, index) => <Tag key={`${tag}-${index}`}>{tag}</Tag>)}
          </TagList>
          <CardActions>
            <MoreButton
              type="button"
              aria-label="Mais opções do wallpaper"
              aria-expanded={isMenuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((open) => !open);
              }}
            >
              <MoreHorizontal size={20} />
            </MoreButton>
            <HeartButton
              type="button"
              aria-pressed={isFavorited}
              disabled={isLikePending}
              title={isFavorited ? "Favorito" : "Curtir"}
              $active={isFavorited}
              onClick={toggleLike}
            >
              {isFavorited ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-4.35-9-7.09C0.84 10.86 3 6 7.5 6 9.24 6 11 7 12 8c1-1 2.76-2 4.5-2C21 12 23.16 10.86 21 13.91 19 16.65 12 21 12 21z" fill="#ff4d55" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </HeartButton>
          </CardActions>
        </TopBar>

        {isMenuOpen && (
          <ActionMenu onClick={(event) => event.stopPropagation()}>
            <ActionMenuButton
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                openSaveDialog();
              }}
            >
              Salvar wallpaper
            </ActionMenuButton>
            <ActionMenuButton type="button" onClick={downloadImage}>
              <Download size={15} />
              Baixar
            </ActionMenuButton>
          </ActionMenu>
        )}

        {showDownload && (
          <Overlay>
            <DownloadButton type="button" onClick={downloadImage}>
              Download
            </DownloadButton>
          </Overlay>
        )}
      </ImageWrapper>

      {isSaveDialogOpen && (
        <SaveDialogOverlay
          onClick={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget) setIsSaveDialogOpen(false);
          }}
        >
          <SaveDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby={`save-wallpaper-title-${id ?? "card"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <SaveDialogHeader>
              <h2 id={`save-wallpaper-title-${id ?? "card"}`}>Salvar wallpaper</h2>
              <SaveDialogClose
                type="button"
                aria-label="Fechar"
                onClick={() => setIsSaveDialogOpen(false)}
              >
                ×
              </SaveDialogClose>
            </SaveDialogHeader>

            {folders.length > 0 ? (
              <FolderOptions aria-label="Pastas criadas">
                {folders.map((folder) => (
                  <FolderOption key={folder.id} $selected={selectedFolder === folder.id}>
                    <input
                      type="radio"
                      name={`folder-${id ?? "card"}`}
                      value={folder.id}
                      checked={selectedFolder === folder.id}
                      onChange={() => setSelectedFolder(folder.id)}
                    />
                    <span>{folder.name}</span>
                    <small>{folder.items.length} wallpapers</small>
                  </FolderOption>
                ))}
              </FolderOptions>
            ) : (
              <FolderStatus>Você ainda não criou pastas. Crie uma para organizar seus wallpapers.</FolderStatus>
            )}

            <FolderCreateForm onSubmit={createFolder}>
              <input
                aria-label="Nome da nova pasta"
                placeholder="Nome da nova pasta"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                maxLength={40}
              />
              <button type="submit">Criar pasta</button>
            </FolderCreateForm>
            {folderError && <FolderStatus role="alert">{folderError}</FolderStatus>}
            <ActionMenuButton type="button" disabled={!selectedFolder} onClick={saveToFolder}>
              Salvar nesta pasta
            </ActionMenuButton>
          </SaveDialog>
        </SaveDialogOverlay>
      )}
    </CardContainer>
  );
}

const PAGE_SIZE = 24;

export default function Cards({ search = "", category = "" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingMore, setLoadingMore] = useState(false);

  // Identifica a consulta atual. Enquanto o resultado guardado for de outra
  // consulta, a tela mostra "carregando" -- sem precisar de setState no efeito.
  const requestKey = `${search}|${category}|${user?.id ?? "visitante"}`;
  const [result, setResult] = useState({
    key: null,
    wallpapers: [],
    hasMore: false,
    error: "",
  });

  // Busca a galeria sempre que a busca, a categoria ou o usuario mudarem.
  // O usuario entra na dependencia porque o campo "favorited" depende dele.
  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      apiRequest(`/wallpapers${buildQuery({ search, category, limit: PAGE_SIZE, offset: 0 })}`)
        .then((data) => {
          if (!active) return;
          setResult({
            key: requestKey,
            wallpapers: data.wallpapers,
            hasMore: data.wallpapers.length === PAGE_SIZE,
            error: "",
          });
        })
        .catch((requestError) => {
          if (!active) return;
          setResult({
            key: requestKey,
            wallpapers: [],
            hasMore: false,
            error: requestError.message,
          });
        });
    }, search ? 300 : 0); // pequeno debounce ao digitar na busca

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search, category, requestKey]);

  const isLoading = result.key !== requestKey;
  const { wallpapers, hasMore, error } = result;

  function setWallpapers(update) {
    setResult((current) => ({
      ...current,
      wallpapers: typeof update === "function" ? update(current.wallpapers) : update,
    }));
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const data = await apiRequest(
        `/wallpapers${buildQuery({ search, category, limit: PAGE_SIZE, offset: wallpapers.length })}`,
      );
      setResult((current) => ({
        ...current,
        wallpapers: [...current.wallpapers, ...data.wallpapers],
        hasMore: data.wallpapers.length === PAGE_SIZE,
      }));
    } catch (requestError) {
      setResult((current) => ({ ...current, error: requestError.message }));
    } finally {
      setLoadingMore(false);
    }
  }

  /** Favoritar exige conta: sem usuario, manda para a tela de login. */
  async function toggleFavorite(id, isCurrentlyLiked) {
    if (!user) {
      navigate("/cadastro");
      return;
    }
    await apiRequest(`/favorites/${encodeURIComponent(id)}`, {
      method: isCurrentlyLiked ? "DELETE" : "POST",
    });
    setWallpapers((current) => current.map((item) => (
      item.id === id
        ? {
          ...item,
          favorited: !isCurrentlyLiked,
          favorites_count: Math.max(0, item.favorites_count + (isCurrentlyLiked ? -1 : 1)),
        }
        : item
    )));
  }

  function registerDownload(wallpaper) {
    // A rota entrega o arquivo e ja contabiliza o download.
    baixarWallpaper(wallpaper.id, wallpaper.image_url);
  }

  if (isLoading) {
    return <GalleryStatus role="status">Carregando wallpapers...</GalleryStatus>;
  }

  if (error && wallpapers.length === 0) {
    return <GalleryStatus role="alert">{error}</GalleryStatus>;
  }

  if (wallpapers.length === 0) {
    return (
      <GalleryStatus role="status">
        {search || category
          ? "Nenhum wallpaper encontrado para esta busca."
          : "A galeria ainda está vazia. Gere o primeiro wallpaper com a IA!"}
      </GalleryStatus>
    );
  }

  return (
    <>
      <CardsWrapper>
        {wallpapers.map((wallpaper) => (
          <Card
            key={wallpaper.id}
            id={wallpaper.id}
            image={wallpaper.image_url}
            title={wallpaper.title}
            description={wallpaper.description}
            category={wallpaper.category}
            creatorName={wallpaper.creator_name}
            creatorId={wallpaper.creator_id}
            tags={wallpaper.tags}
            liked={wallpaper.favorited}
            onLikeToggle={toggleFavorite}
            onDownload={() => registerDownload(wallpaper)}
          />
        ))}
      </CardsWrapper>

      {error && <GalleryStatus role="alert">{error}</GalleryStatus>}

      {hasMore && (
        <GalleryActions>
          <LoadMoreButton type="button" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Carregando..." : "Carregar mais"}
          </LoadMoreButton>
        </GalleryActions>
      )}
    </>
  );
}
