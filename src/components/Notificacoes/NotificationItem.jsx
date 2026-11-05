import { FiBell, FiHeart, FiMessageCircle, FiStar, FiZap } from "react-icons/fi";
import {
  NotificationButton,
  NotificationCopy,
  NotificationDescription,
  NotificationIcon,
  NotificationImage,
  NotificationTime,
  NotificationTitle,
  UnreadDot,
} from "./styles";

const notificationIcons = {
  heart: FiHeart,
  generated: FiZap,
  message: FiMessageCircle,
  crown: FiStar,
};

export default function NotificationItem({ notification, onRead }) {
  const Icon = notificationIcons[notification.icon] ?? FiBell;

  return (
    <NotificationButton
      type="button"
      $unread={!notification.read}
      onClick={() => onRead(notification.id)}
      aria-label={`${notification.title} ${notification.read ? "Lida" : "Não lida"}`}
    >
      <NotificationImage src={notification.image} alt="" />
      <NotificationIcon $unread={!notification.read}>
        <Icon aria-hidden="true" />
      </NotificationIcon>
      <NotificationCopy>
        <NotificationTitle>{notification.title}</NotificationTitle>
        <NotificationDescription>{notification.description}</NotificationDescription>
      </NotificationCopy>
      <NotificationTime>{notification.time}</NotificationTime>
      {!notification.read && <UnreadDot aria-label="Não lida" />}
    </NotificationButton>
  );
}
