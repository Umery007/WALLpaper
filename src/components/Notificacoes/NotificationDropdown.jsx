import { FiCheck, FiCheckCircle } from "react-icons/fi";
import NotificationItem from "./NotificationItem";
import {
  Dropdown,
  DropdownFooter,
  DropdownHeader,
  DropdownTitle,
  EmptyNotifications,
  MarkReadButton,
  NotificationList,
  ViewAllButton,
} from "./styles";

export default function NotificationDropdown({
  notifications,
  isOpen,
  onRead,
  onMarkAllRead,
  onViewAll,
}) {
  return (
    <Dropdown
      id="notification-dropdown"
      role="dialog"
      aria-label="Notificações"
      aria-hidden={!isOpen}
      inert={!isOpen}
      $open={isOpen}
    >
      <DropdownHeader>
        <DropdownTitle>Notificações</DropdownTitle>
        <MarkReadButton type="button" onClick={onMarkAllRead}>
          <FiCheck aria-hidden="true" />
          Marcar todas como lidas
        </MarkReadButton>
      </DropdownHeader>

      {notifications.length > 0 ? (
        <NotificationList>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
            />
          ))}
        </NotificationList>
      ) : (
        <EmptyNotifications>
          <FiCheckCircle aria-hidden="true" />
          Você está em dia com as notificações.
        </EmptyNotifications>
      )}

      <DropdownFooter>
        <ViewAllButton type="button" onClick={onViewAll}>
          Ver todas as notificações
        </ViewAllButton>
      </DropdownFooter>
    </Dropdown>
  );
}
