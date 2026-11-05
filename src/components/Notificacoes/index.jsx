import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { initialNotifications } from "./data";
import NotificationItem from "./NotificationItem";
import {
  NotificationsPage,
  NotificationList,
  PageActions,
  PageDescription,
} from "./styles";

export default function Notificacoes() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [notifications, setNotifications] = useState(
    () => state?.notifications ?? initialNotifications,
  );

  function markRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  function markAllRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  return (
    <NotificationsPage>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 22,
          padding: "9px 12px",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: 10,
          background: "rgba(255,255,255,.05)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar
      </button>
      <h1>Notificações</h1>
      <PageDescription>
        Acompanhe as novidades e interações nas suas criações.
      </PageDescription>
      <PageActions>
        <button type="button" onClick={markAllRead}>
          <Check size={14} aria-hidden="true" /> Marcar todas como lidas
        </button>
      </PageActions>
      <NotificationList>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={markRead}
          />
        ))}
      </NotificationList>
    </NotificationsPage>
  );
}
