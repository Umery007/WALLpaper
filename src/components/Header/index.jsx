import { useEffect, useRef, useState } from "react";
import {
  FiMessageSquare,
  FiBell,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Mensagens from "../Mensagens";
import NotificationDropdown from "../Notificacoes/NotificationDropdown";
import { initialNotifications } from "../Notificacoes/data";
import {
  Container,
  TopBar,
  Logo,
  Menu,
  SearchArea,
  SearchBox,
  Categories,
  Category,
  NotificationAnchor,
  UnreadBadge,
} from "./styles";

export default function Header({ onOpenFerramentas, onSearch, onCategoryChange }) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function markNotificationRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  function markAllNotificationsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  return (
    <Container ref={headerRef}>
      <TopBar>
        <Logo>Logomarca</Logo>

        <Menu>
          <button
            type="button"
            className="messages-trigger"
            aria-controls="messages-panel"
            aria-expanded={isMessagesOpen}
            onClick={() => setIsMessagesOpen(true)}
          >
            <FiMessageSquare />
            <span>Mensagens</span>
          </button>

          <NotificationAnchor>
            <button
              type="button"
              className="notification-trigger"
              aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ""}`}
              aria-controls="notification-dropdown"
              aria-expanded={isNotificationsOpen}
              onClick={() => setIsNotificationsOpen((open) => !open)}
            >
              <FiBell />
              <span>Notificações</span>
              {unreadCount > 0 && (
                <UnreadBadge aria-hidden="true">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </UnreadBadge>
              )}
            </button>
            <NotificationDropdown
              isOpen={isNotificationsOpen}
              notifications={notifications}
              onRead={markNotificationRead}
              onMarkAllRead={markAllNotificationsRead}
              onViewAll={() => {
                setIsNotificationsOpen(false);
                navigate("/notificacoes", { state: { notifications } });
              }}
            />
          </NotificationAnchor>

          <button type="button" onClick={onOpenFerramentas} aria-label="Ferramentas do usuário">
            <FiUser />
          </button>
        </Menu>
      </TopBar>

      <SearchArea>
        <SearchBox>
          <input
            type="search"
            placeholder="Procurar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSearch?.(search.trim());
              }
            }}
          />
          <FiSearch />
        </SearchBox>

        <Categories>
          {["Anime", "3D", "Natureza", "Jogos", "Galáxias", "Pixel Art", "Minimalista", "Arquitetura", "Futuro", "Cyberpunk", "Astral", "HD", "Filmes", "Magia", "Y2K", "Oceanos", "Japão", "8K"].map((category) => (
            <Category
              as="button"
              type="button"
              key={category}
              onClick={() => onCategoryChange?.(category)}
            >
              {category}
            </Category>
          ))}
        </Categories>
      </SearchArea>

      {isMessagesOpen && (
        <Mensagens onClose={() => setIsMessagesOpen(false)} />
      )}
    </Container>
  );
}
