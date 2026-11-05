import {
  FiArrowLeft,
  FiMessageSquare,
  FiPlus,
  FiShare2,
  FiUser,
} from "react-icons/fi";
import Prompt from "../Prompt";
import GeneratedWallpaper from "../Chatbot/GeneratedWallpaper";
import {
  Brand,
  BrandMark,
  ChatMessage,
  ChatPanel,
  ChatSidebar,
  Conversation,
  Header,
  HeaderUser,
  Main,
  MessageText,
  NewChatButton,
  Notice,
  ProfileAvatar,
  Rail,
  RailButton,
  Screen,
  SidebarLabel,
  SidebarSection,
  SidebarSelection,
  TopBar,
} from "./styles";

export default function TelaCheia({
  onClose,
  onNewChat,
  conversation = [],
  isGenerating = false,
  message = "",
  onChange,
  onSubmit,
  onFavorite,
  onEdit,
  onSelectHistory,
  favoritePendingId,
  generationHistory = [],
  user,
  editTarget,
}) {
  return (
    <Screen aria-label="Tela cheia do gerador de wallpapers">
      <Rail>
        <BrandMark aria-label="WA1PAPER">W</BrandMark>
        <RailButton type="button" aria-label="Conversas" title="Conversas" $active>
          <FiMessageSquare />
        </RailButton>
        <RailButton type="button" aria-label="Compartilhar" title="Compartilhar">
          <FiShare2 />
        </RailButton>
      </Rail>

      <ChatSidebar>
        <Brand>WA1PAPER</Brand>
        <NewChatButton type="button" onClick={onNewChat}>
          <FiPlus /> Novo chat
        </NewChatButton>
        <SidebarSection>
          <SidebarLabel>HISTÓRICO DE GERAÇÕES</SidebarLabel>
          {generationHistory.length > 0 ? generationHistory.slice(0, 12).map((generation) => (
            <SidebarSelection
              key={generation.id}
              type="button"
              title={generation.prompt}
              onClick={() => onSelectHistory(generation)}
            >
              <FiMessageSquare />
              <span>{generation.title || generation.prompt}</span>
            </SidebarSelection>
          )) : <p>Nenhuma geração anterior.</p>}
        </SidebarSection>
        <SidebarSection>
          <SidebarLabel>PROJETOS</SidebarLabel>
          <p>Seus projetos aparecerão aqui.</p>
        </SidebarSection>
      </ChatSidebar>

      <Main>
        <Header>
          <TopBar>
            <button
              type="button"
              className="back-button"
              onClick={onClose}
              aria-label="Voltar para o chatbot"
              title="Voltar"
            >
              <FiArrowLeft />
            </button>
            <HeaderUser>
              <span>{user?.name || "WA1PAPER"}</span>
              <ProfileAvatar aria-label="Perfil">
                <FiUser />
              </ProfileAvatar>
            </HeaderUser>
          </TopBar>
        </Header>

        <ChatPanel>
          <Conversation aria-live="polite">
            {conversation.map(({ id, text, wallpaper, fromUser }) => (
              <ChatMessage key={id} $fromUser={fromUser}>
                <MessageText>{text}</MessageText>
                {wallpaper && (
                  <GeneratedWallpaper
                    wallpaper={wallpaper}
                    onFavorite={onFavorite}
                    onEdit={onEdit}
                    favoritePending={favoritePendingId === wallpaper.id}
                  />
                )}
              </ChatMessage>
            ))}
            {isGenerating && (
              <ChatMessage role="status">
                <MessageText>Gerando seu wallpaper...</MessageText>
              </ChatMessage>
            )}
          </Conversation>

          <Prompt
            value={message}
            onChange={onChange}
            onSubmit={onSubmit}
            disabled={isGenerating}
            placeholder={editTarget ? "Descreva o que deseja editar..." : undefined}
          />
          <Notice>Nosso site pode cometer erros enquanto está em crescimento.</Notice>
        </ChatPanel>
      </Main>
    </Screen>
  );
}
