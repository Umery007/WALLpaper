import styled from "styled-components";

export const Dropdown = styled.aside`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  width: min(390px, calc(100vw - 32px));
  max-height: min(540px, calc(100dvh - 110px));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background:
    radial-gradient(ellipse at 100% 0%, rgba(255, 255, 255, 0.08), transparent 45%),
    rgba(17, 20, 28, 0.96);
  color: #f9fafb;
  box-shadow: 0 22px 65px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(24px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transform: ${({ $open }) => ($open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.98)")};
  transform-origin: top right;
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const DropdownHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
`;

export const DropdownTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
`;

export const MarkReadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #b8beca;
  font: inherit;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, var(--primary-color-accent, #ff3038) 18%, transparent);
    color: #fff;
  }
`;

export const NotificationList = styled.div`
  display: grid;
  gap: 4px;
  overflow-y: auto;
  padding: 8px;
`;

export const NotificationButton = styled.button`
  position: relative;
  display: grid;
  grid-template-columns: 58px 1fr auto;
  align-items: start;
  gap: 11px;
  width: 100%;
  padding: 11px 28px 11px 10px;
  border: 1px solid ${({ $unread }) =>
    $unread ? "color-mix(in srgb, var(--primary-color-accent, #ff3038) 28%, transparent)" : "transparent"};
  border-radius: 13px;
  background: ${({ $unread }) =>
    $unread ? "color-mix(in srgb, var(--primary-color-accent, #ff3038) 11%, rgba(255, 255, 255, 0.045))" : "transparent"};
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover,
  &:focus-visible {
    background: color-mix(in srgb, var(--primary-color-accent, #ff3038) 16%, rgba(255, 255, 255, 0.06));
    outline: none;
  }
`;

export const NotificationImage = styled.img`
  width: 58px;
  height: 62px;
  border-radius: 10px;
  object-fit: cover;
  background: #252a35;
`;

export const NotificationIcon = styled.span`
  position: absolute;
  top: 55px;
  left: 53px;
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border: 2px solid #171a22;
  border-radius: 50%;
  background: ${({ $unread }) =>
    $unread ? "var(--primary-color-accent, #ff3038)" : "#353a45"};
  color: #fff;

  svg {
    width: 11px;
    height: 11px;
  }
`;

export const NotificationCopy = styled.span`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const NotificationTitle = styled.span`
  color: #f7f8fb;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.4;
`;

export const NotificationDescription = styled.span`
  color: #aeb4c2;
  font-size: 11px;
  line-height: 1.45;
`;

export const NotificationTime = styled.span`
  color: #858c99;
  font-size: 10px;
  white-space: nowrap;
`;

export const UnreadDot = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary-color-accent, #ff3038);
  transform: translateY(-50%);
`;

export const EmptyNotifications = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 0;
  padding: 36px 18px;
  color: #aeb4c2;
  font-size: 13px;

  svg {
    color: #fff;
  }
`;

export const DropdownFooter = styled.footer`
  padding: 10px 14px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
`;

export const ViewAllButton = styled.button`
  width: 100%;
  min-height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;

  &:hover {
    border-color: color-mix(in srgb, var(--primary-color-accent, #ff3038) 55%, transparent);
    background: color-mix(in srgb, var(--primary-color-accent, #ff3038) 18%, transparent);
  }
`;

export const NotificationsPage = styled.main`
  width: min(820px, calc(100% - 32px));
  min-height: 60vh;
  margin: 34px auto 72px;
  padding: clamp(18px, 4vw, 32px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.035);
  color: #f9fafb;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(25px, 4vw, 34px);
  }
`;

export const PageDescription = styled.p`
  margin: 0 0 22px;
  color: #aeb4c2;
  font-size: 14px;
`;

export const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;

  button {
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
`;
