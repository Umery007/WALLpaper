import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiImage,
  FiMessageCircle,
  FiPlus,
  FiSearch,
  FiSend,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import wallpaper from "../../assets/img-cards/paper.jpeg";
import useAuth from "../../contexts/useAuth";
import {
  Overlay,
  Panel,
  PanelHeader,
  HeadingGroup,
  Eyebrow,
  PanelTitle,
  HeaderButton,
  PanelBody,
  SectionHeading,
  PrimaryButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  SearchField,
  ContactList,
  ContactButton,
  Avatar,
  ContactInfo,
  ContactName,
  ContactHandle,
  ThreadHeader,
  ThreadContact,
  WallpaperTools,
  WallpaperPreview,
  WallpaperActions,
  WallpaperButton,
  WallpaperReset,
  WallpaperError,
  WallpaperHint,
  ThreadBody,
  ThreadEmpty,
  MessageRow,
  DeleteMessageButton,
  MessageBubble,
  PinBubble,
  PinPreview,
  ComposerArea,
  PinPicker,
  PinPickerImage,
  PinPickerButton,
  Composer,
  AttachButton,
  SendButton,
} from "./styles";

const contacts = [
  { id: "lia", name: "Lia Monteiro", handle: "@liacria", color: "#c8cbd4" },
  { id: "caio", name: "Caio Pixel", handle: "@caiopixel", color: "#d7a68b" },
  { id: "nina", name: "Nina Luz", handle: "@ninaluz", color: "#b9b0de" },
];

const MAX_WALLPAPER_SIZE = 512 * 1024;

function carregarWallpapers(key) {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return { wallpapers: { all: "", byContact: {} }, error: "" };

    const parsed = JSON.parse(saved);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed.all !== "" && (
        typeof parsed.all !== "string" ||
        !/^data:image\/(png|jpeg|webp|gif);base64,/i.test(parsed.all)
      )) ||
      !parsed.byContact ||
      typeof parsed.byContact !== "object" ||
      Array.isArray(parsed.byContact) ||
      Object.values(parsed.byContact).some((value) =>
        typeof value !== "string" || !/^data:image\/(png|jpeg|webp|gif);base64,/i.test(value),
      )
    ) {
      return {
        wallpapers: { all: "", byContact: {} },
        error: "As configurações de papel de parede salvas são inválidas.",
      };
    }

    return { wallpapers: { all: parsed.all, byContact: parsed.byContact }, error: "" };
  } catch {
    return {
      wallpapers: { all: "", byContact: {} },
      error: "Não foi possível carregar os papéis de parede salvos.",
    };
  }
}

export default function Mensagens(props) {
  const { user } = useAuth();
  return <MensagensPanel key={user?.id ?? "guest"} {...props} user={user} />;
}

function MensagensPanel({ onClose, user }) {
  const wallpaperStorageKey = `wa1paper-message-wallpapers:${user?.id ?? "guest"}`;
  const [view, setView] = useState("inbox");
  const [previousView, setPreviousView] = useState("inbox");
  const [activeContact, setActiveContact] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showPins, setShowPins] = useState(false);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [initialWallpaperState] = useState(() => carregarWallpapers(wallpaperStorageKey));
  const [wallpapers, setWallpapers] = useState(initialWallpaperState.wallpapers);
  const [wallpaperDraft, setWallpaperDraft] = useState("");
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [wallpaperError, setWallpaperError] = useState(initialWallpaperState.error);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const conversations = contacts.filter(
    (contact) => messagesByContact[contact.id]?.length,
  );
  const visibleContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.handle}`.toLowerCase().includes(search.toLowerCase()),
  );
  const messages = activeContact
    ? messagesByContact[activeContact.id] ?? []
    : [];

  function openConversation(contact, from = view) {
    setPreviousView(from);
    setActiveContact(contact);
    setView("conversation");
    setShowPins(false);
    setShowWallpaperPicker(false);
    setWallpaperDraft("");
  }

  function goBack() {
    setView(view === "conversation" ? previousView : "inbox");
    setShowPins(false);
    setShowWallpaperPicker(false);
  }

  function addMessage(message) {
    if (!activeContact) return;
    setMessagesByContact((current) => ({
      ...current,
      [activeContact.id]: [
        ...(current[activeContact.id] ?? []),
        { id: `${Date.now()}-${Math.random()}`, ...message },
      ],
    }));
  }

  function deleteMessage(messageId) {
    if (!activeContact) return;
    setMessagesByContact((current) => ({
      ...current,
      [activeContact.id]: (current[activeContact.id] ?? []).filter(
        (message) => message.id !== messageId,
      ),
    }));
  }

  function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addMessage({ type: "text", text });
    setDraft("");
  }

  function handleSendPin() {
    addMessage({ type: "pin" });
    setShowPins(false);
  }

  function handleWallpaperFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setWallpaperError("Escolha uma imagem PNG, JPEG, WebP ou GIF.");
      return;
    }

    if (file.size > MAX_WALLPAPER_SIZE) {
      setWallpaperError("A imagem deve ter no máximo 512 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setWallpaperError("Não foi possível ler essa imagem.");
        return;
      }
      setWallpaperDraft(reader.result);
      setWallpaperError("");
    };
    reader.onerror = () => setWallpaperError("Não foi possível ler essa imagem.");
    reader.readAsDataURL(file);
  }

  function saveWallpapers(nextWallpapers) {
    try {
      window.localStorage.setItem(wallpaperStorageKey, JSON.stringify(nextWallpapers));
      setWallpapers(nextWallpapers);
      setWallpaperError("");
      return true;
    } catch {
      setWallpaperError("Não foi possível salvar. Escolha uma imagem menor e tente novamente.");
      return false;
    }
  }

  function applyWallpaperToConversation() {
    if (!activeContact || !wallpaperDraft) return;
    saveWallpapers({
      ...wallpapers,
      byContact: { ...wallpapers.byContact, [activeContact.id]: wallpaperDraft },
    });
  }

  function applyWallpaperToAll() {
    if (!wallpaperDraft) return;
    saveWallpapers({ ...wallpapers, all: wallpaperDraft });
  }

  function useGlobalWallpaper() {
    if (!activeContact) return;
    const byContact = { ...wallpapers.byContact };
    delete byContact[activeContact.id];
    saveWallpapers({ ...wallpapers, byContact });
  }

  const activeWallpaper = activeContact
    ? wallpapers.byContact[activeContact.id] || wallpapers.all
    : "";

  return (
    <Overlay onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <Panel id="messages-panel" role="dialog" aria-modal="true" aria-label="Mensagens">
        <PanelHeader>
          {view !== "inbox" && (
            <HeaderButton type="button" aria-label="Voltar" onClick={goBack}>
              <FiArrowLeft />
            </HeaderButton>
          )}
          <HeadingGroup>
            <Eyebrow>WA1PAPER / CONEXÕES</Eyebrow>
            <PanelTitle>
              {view === "inbox"
                ? "Mensagens"
                : view === "new"
                  ? "Nova conversa"
                  : activeContact?.name}
            </PanelTitle>
          </HeadingGroup>
          <HeaderButton type="button" aria-label="Fechar mensagens" onClick={onClose}>
            <FiX />
          </HeaderButton>
        </PanelHeader>

        {view === "inbox" && (
          <PanelBody>
            <SectionHeading>Caixa de entrada</SectionHeading>
            <PrimaryButton type="button" onClick={() => {
              setSearch("");
              setView("new");
            }}>
              <FiPlus />
              Nova conversa
            </PrimaryButton>

            {conversations.length > 0 ? (
              <ContactList aria-label="Conversas recentes">
                {conversations.map((contact) => {
                  const lastMessage = messagesByContact[contact.id].at(-1);
                  return (
                    <ContactButton
                      type="button"
                      key={contact.id}
                      onClick={() => openConversation(contact)}
                    >
                      <Avatar $color={contact.color}>{contact.name[0]}</Avatar>
                      <ContactInfo>
                        <ContactName>{contact.name}</ContactName>
                        <ContactHandle>
                          {lastMessage.type === "pin" ? "Compartilhou um Pin" : lastMessage.text}
                        </ContactHandle>
                      </ContactInfo>
                    </ContactButton>
                  );
                })}
              </ContactList>
            ) : (
              <EmptyState>
                <EmptyIcon><FiMessageCircle /></EmptyIcon>
                <EmptyTitle>Comece uma conversa</EmptyTitle>
                <EmptyDescription>
                  Troque referências e compartilhe Pins com outras pessoas da comunidade.
                </EmptyDescription>
              </EmptyState>
            )}
          </PanelBody>
        )}

        {view === "new" && (
          <PanelBody>
            <SearchField>
              <FiSearch aria-hidden="true" />
              <input
                autoFocus
                aria-label="Buscar pessoas"
                placeholder="Buscar por nome ou usuário"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button type="button" aria-label="Limpar busca" onClick={() => setSearch("")}>
                  <FiX />
                </button>
              )}
            </SearchField>
            <SectionHeading>Pessoas para conhecer</SectionHeading>
            {visibleContacts.length > 0 ? (
              <ContactList aria-label="Pessoas">
                {visibleContacts.map((contact) => (
                  <ContactButton
                    type="button"
                    key={contact.id}
                    onClick={() => openConversation(contact, "new")}
                  >
                    <Avatar $color={contact.color}>{contact.name[0]}</Avatar>
                    <ContactInfo>
                      <ContactName>{contact.name}</ContactName>
                      <ContactHandle>{contact.handle}</ContactHandle>
                    </ContactInfo>
                    <FiArrowLeft className="contact-arrow" aria-hidden="true" />
                  </ContactButton>
                ))}
              </ContactList>
            ) : (
              <EmptyDescription>Nenhuma pessoa encontrada com esse nome.</EmptyDescription>
            )}
          </PanelBody>
        )}

        {view === "conversation" && activeContact && (
          <>
            <ThreadHeader>
              <Avatar $color={activeContact.color}>{activeContact.name[0]}</Avatar>
              <ThreadContact>
                <ContactName>{activeContact.name}</ContactName>
                <ContactHandle>{activeContact.handle}</ContactHandle>
              </ThreadContact>
              <HeaderButton
                type="button"
                aria-label="Personalizar papel de parede"
                aria-expanded={showWallpaperPicker}
                title="Personalizar papel de parede"
                onClick={() => setShowWallpaperPicker((isOpen) => !isOpen)}
              >
                <FiImage />
              </HeaderButton>
            </ThreadHeader>
            {showWallpaperPicker && (
              <WallpaperTools>
                <SectionHeading>Papel de parede</SectionHeading>
                <label>
                  <span>{wallpaperDraft ? "Trocar imagem" : "Escolher imagem"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Escolher imagem para o papel de parede"
                    onChange={handleWallpaperFile}
                  />
                </label>
                {wallpaperDraft && (
                  <WallpaperPreview src={wallpaperDraft} alt="Prévia do papel de parede escolhido" />
                )}
                <WallpaperActions>
                  <WallpaperButton
                    type="button"
                    disabled={!wallpaperDraft}
                    onClick={applyWallpaperToConversation}
                  >
                    Aplicar nesta conversa
                  </WallpaperButton>
                  <WallpaperButton
                    type="button"
                    $secondary
                    disabled={!wallpaperDraft}
                    onClick={applyWallpaperToAll}
                  >
                    Aplicar em todas
                  </WallpaperButton>
                </WallpaperActions>
                {wallpapers.byContact[activeContact.id] && (
                  <WallpaperReset type="button" onClick={useGlobalWallpaper}>
                    Usar papel de parede global
                  </WallpaperReset>
                )}
                {wallpaperError && <WallpaperError role="alert">{wallpaperError}</WallpaperError>}
                <WallpaperHint>
                  {wallpapers.byContact[activeContact.id]
                    ? "Esta conversa está usando um papel de parede individual."
                    : wallpapers.all
                      ? "Esta conversa está usando o papel de parede de todas as conversas."
                      : "Selecione uma imagem de até 512 KB para personalizar suas conversas."}
                </WallpaperHint>
              </WallpaperTools>
            )}
            <ThreadBody aria-live="polite" $wallpaper={activeWallpaper}>
              {messages.length === 0 ? (
                <ThreadEmpty>
                  <EmptyIcon><FiMessageCircle /></EmptyIcon>
                  <EmptyTitle>Uma ideia vira conversa.</EmptyTitle>
                  <EmptyDescription>
                    Mande uma mensagem ou compartilhe um Pin para começar.
                  </EmptyDescription>
                </ThreadEmpty>
              ) : (
                messages.map((message) => (
                  <MessageRow key={message.id}>
                    {message.type === "pin" ? (
                      <PinBubble>
                        <PinPreview src={wallpaper} alt="Pin compartilhado do WA1PAPER" />
                        <span>Pin do WA1PAPER</span>
                      </PinBubble>
                    ) : (
                      <MessageBubble>{message.text}</MessageBubble>
                    )}
                    <DeleteMessageButton
                      type="button"
                      aria-label={message.type === "pin"
                        ? "Apagar Pin compartilhado"
                        : `Apagar mensagem: ${message.text}`}
                      title="Apagar mensagem"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <FiTrash2 />
                    </DeleteMessageButton>
                  </MessageRow>
                ))
              )}
            </ThreadBody>
            <ComposerArea>
              {showPins && (
                <PinPicker>
                  <PinPickerImage src={wallpaper} alt="Prévia do Pin" />
                  <div>
                    <ContactName>Textura de papel</ContactName>
                    <ContactHandle>Pin da coleção WA1PAPER</ContactHandle>
                  </div>
                  <PinPickerButton type="button" onClick={handleSendPin}>
                    Enviar Pin
                  </PinPickerButton>
                </PinPicker>
              )}
              <Composer onSubmit={handleSend}>
                <AttachButton
                  type="button"
                  aria-label="Compartilhar um Pin"
                  aria-expanded={showPins}
                  onClick={() => setShowPins((isVisible) => !isVisible)}
                >
                  <FiImage />
                </AttachButton>
                <input
                  aria-label="Escrever mensagem"
                  placeholder="Escreva uma mensagem..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <SendButton type="submit" aria-label="Enviar mensagem" disabled={!draft.trim()}>
                  <FiSend />
                </SendButton>
              </Composer>
            </ComposerArea>
          </>
        )}
      </Panel>
    </Overlay>
  );
}