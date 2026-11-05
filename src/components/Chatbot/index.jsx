import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMaximize2,
  FiMinimize2,
  FiMaximize,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";
import Prompt from "../Prompt";
import TelaCheia from "../Tela-cheia";
import { apiRequest } from "../../services/api";
import useAuth from "../../contexts/useAuth";
import GeneratedWallpaper from "./GeneratedWallpaper";
import {
  ChatWindow,
  CloseButton,
  Launcher,
  Message,
  Messages,
  Header,
  HeaderActions,
  HeaderButton,
  Subtitle,
  Title,
  LauncherHint,
} from "./styles";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [favoritePendingId, setFavoritePendingId] = useState(null);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [conversation, setConversation] = useState([
    { id: "welcome", text: "Olá, seja bem-vindo 👋" },
    { id: "intro", text: "Descreva o wallpaper que você imagina e eu vou gerar uma imagem para você." },
  ]);
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const accountIdRef = useRef(user?.id ?? null);
  const messagesRef = useRef(null);

  useEffect(() => {
    accountIdRef.current = user?.id ?? null;
    setConversation([
      { id: "welcome", text: "Olá, seja bem-vindo 👋" },
      { id: "intro", text: "Descreva o wallpaper que você imagina e eu vou gerar uma imagem para você." },
    ]);
    setGenerationHistory([]);
    setEditTarget(null);
    setMessage("");
    setIsGenerating(false);
    setFavoritePendingId(null);
  }, [user?.id]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation, isGenerating]);

  useEffect(() => {
    if (!isFullScreen || !userId) return undefined;

    let active = true;
    apiRequest("/images/history")
      .then((data) => {
        if (active && accountIdRef.current === userId) setGenerationHistory(data.generations);
      })
      .catch((error) => {
        if (active && accountIdRef.current === userId) {
          setConversation((current) => [...current, { id: crypto.randomUUID(), text: error.message }]);
        }
      });
    return () => { active = false; };
  }, [isFullScreen, userId]);

  function handleNewChat() {
    setConversation([
      { id: "welcome", text: "Olá, seja bem-vindo 👋" },
      { id: "intro", text: "Descreva o wallpaper que você imagina e eu vou gerar uma imagem para você." },
    ]);
    setMessage("");
    setEditTarget(null);
  }

  async function handleSubmit(event, formato = "9:16") {
    event.preventDefault();
    const prompt = message.trim();
    if (!prompt || isGenerating) return;
    const ownerId = user?.id ?? null;
    const selectedEdit = editTarget;
    setConversation((current) => [...current, { id: crypto.randomUUID(), text: prompt, fromUser: true }]);
    setMessage("");
    if (!user) {
      setConversation((current) => [...current, { id: crypto.randomUUID(), text: "Entre na sua conta para gerar e salvar imagens." }]);
      navigate("/cadastro");
      return;
    }

    setIsGenerating(true);
    try {
      const { wallpaper } = await apiRequest(selectedEdit ? "/images/edit" : "/images/generate", {
        method: "POST",
        body: JSON.stringify(selectedEdit
          ? { prompt, wallpaper_id: selectedEdit.id, aspect_ratio: formato }
          : { prompt, aspect_ratio: formato }),
      });
      if (accountIdRef.current === ownerId) {
        setConversation((current) => [
          ...current,
          { id: crypto.randomUUID(), text: selectedEdit ? "Aqui está a versão editada do seu wallpaper." : "Seu wallpaper foi gerado e salvo na sua biblioteca.", wallpaper },
        ]);
        setGenerationHistory((current) => [
          {
            id: crypto.randomUUID(),
            prompt,
            created_at: new Date().toISOString(),
            wallpaper_id: wallpaper.id,
            image_url: wallpaper.image_url,
            title: wallpaper.title,
            favorited: wallpaper.favorited,
          },
          ...current,
        ].slice(0, 100));
      }
    } catch (error) {
      if (accountIdRef.current === ownerId) {
        setConversation((current) => [...current, { id: crypto.randomUUID(), text: error.message }]);
      }
    } finally {
      if (accountIdRef.current === ownerId) {
        setEditTarget(null);
        setIsGenerating(false);
      }
    }
  }

  async function toggleFavorite(wallpaper) {
    if (!user) {
      navigate("/cadastro");
      return;
    }

    setFavoritePendingId(wallpaper.id);
    const ownerId = user.id;
    try {
      const favorited = !wallpaper.favorited;
      await apiRequest(`/favorites/${encodeURIComponent(wallpaper.id)}`, {
        method: favorited ? "POST" : "DELETE",
      });
      if (accountIdRef.current === ownerId) {
        setConversation((current) => current.map((item) => (
          item.wallpaper?.id === wallpaper.id
            ? { ...item, wallpaper: { ...item.wallpaper, favorited } }
            : item
        )));
        setGenerationHistory((current) => current.map((item) => (
          item.wallpaper_id === wallpaper.id ? { ...item, favorited } : item
        )));
      }
    } catch (error) {
      if (accountIdRef.current === ownerId) {
        setConversation((current) => [...current, { id: crypto.randomUUID(), text: error.message }]);
      }
    } finally {
      setFavoritePendingId(null);
    }
  }

  function editWallpaper(wallpaper) {
    setEditTarget(wallpaper);
    setMessage("");
    setIsOpen(true);
    setIsFullScreen(true);
  }

  function selectHistory(generation) {
    setConversation([
      { id: "welcome", text: "Olá, seja bem-vindo 👋" },
      { id: "intro", text: "Descreva o wallpaper que você imagina e eu vou gerar uma imagem para você." },
      { id: `${generation.id}-prompt`, text: generation.prompt, fromUser: true },
      {
        id: `${generation.id}-result`,
        text: "Wallpaper salvo na sua biblioteca.",
        wallpaper: {
          id: generation.wallpaper_id,
          title: generation.title,
          image_url: generation.image_url,
          source: "ai",
          favorited: generation.favorited,
        },
      },
    ]);
    setEditTarget(null);
  }

  return (
    <>
      {isOpen && !isFullScreen && (
        <ChatWindow $isExpanded={isExpanded} aria-label="Conversa com o Toc Toc">
          <Header>
            <div>
              <Title>WA1PAPER</Title>
              <Subtitle>Crie e edite wallpapers com IA</Subtitle>
            </div>
            <HeaderActions>
              <HeaderButton
                type="button"
                aria-label={isExpanded ? "Reduzir conversa" : "Ampliar conversa"}
                title={isExpanded ? "Reduzir conversa" : "Ampliar conversa"}
                onClick={() => setIsExpanded((expanded) => !expanded)}
              >
                {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </HeaderButton>
              <HeaderButton
                type="button"
                aria-label="Abrir em tela cheia"
                title="Abrir em tela cheia"
                onClick={() => setIsFullScreen(true)}
              >
                <FiMaximize />
              </HeaderButton>
              <CloseButton
                type="button"
                aria-label="Fechar conversa"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                  setIsFullScreen(false);
                }}
              >
                <FiX />
              </CloseButton>
            </HeaderActions>
          </Header>

          <Messages ref={messagesRef} aria-live="polite">
            {conversation.map(({ id, text, wallpaper, fromUser }) => (
              <Message key={id} $fromUser={fromUser}>
                {text}
                {wallpaper && (
                  <GeneratedWallpaper
                    wallpaper={wallpaper}
                    onFavorite={toggleFavorite}
                    onEdit={editWallpaper}
                    favoritePending={favoritePendingId === wallpaper.id}
                  />
                )}
              </Message>
            ))}
            {isGenerating && <Message role="status">Gerando seu wallpaper...</Message>}
          </Messages>

          <Prompt
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onSubmit={handleSubmit}
            disabled={isGenerating}
            placeholder={editTarget ? "Descreva o que deseja editar..." : "Descreva o wallpaper que você imagina..."}
          />
        </ChatWindow>
      )}

      {isOpen && isFullScreen && (
        <TelaCheia
          onClose={() => setIsFullScreen(false)}
          onNewChat={handleNewChat}
          conversation={conversation}
          isGenerating={isGenerating}
          favoritePendingId={favoritePendingId}
          generationHistory={generationHistory}
          user={user}
          editTarget={editTarget}
          message={message}
          onChange={(event) => setMessage(event.target.value)}
          onSubmit={handleSubmit}
          onFavorite={toggleFavorite}
          onEdit={editWallpaper}
          onSelectHistory={selectHistory}
        />
      )}

      {!isOpen && (
        <Launcher
          type="button"
          aria-label="Abrir conversa"
          onClick={() => setIsOpen(true)}
        >
          <FiMessageCircle />
          <LauncherHint aria-hidden="true">Que foi Diabe</LauncherHint>
        </Launcher>
      )}
    </>
  );
}
