import styled from "styled-components";

const glass = "rgba(255, 255, 255, 0.12)";
const glassBorder = "rgba(255, 255, 255, 0.22)";

export const Launcher = styled.button`
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 1000;
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: ${glass};
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  span {
    position: absolute;
    right: 78px;
    top: 50%;
    padding: 10px 15px;
    border: 1px solid ${glassBorder};
    border-radius: 12px;
    background: rgba(10, 14, 24, 0.78);
    color: #fff;
    font: 600 14px Arial, sans-serif;
    white-space: nowrap;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(14px);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  span::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -7px;
    width: 12px;
    height: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(10, 14, 24, 0.78);
    transform: translateY(-50%) rotate(45deg);
  }

  svg {
    width: 34px;
    height: 34px;
    stroke-width: 2.2;
  }

  &:hover {
    transform: translateY(-3px) scale(1.04);
    background: rgba(255, 255, 255, 0.22);
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);

    span {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
`;

export const LauncherHint = styled.span``;

export const ChatWindow = styled.section`
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: ${({ $isExpanded }) => ($isExpanded ? "min(760px, calc(100vw - 40px))" : "min(400px, calc(100vw - 32px))")};
  height: ${({ $isExpanded }) => ($isExpanded ? "min(720px, calc(100vh - 48px))" : "min(560px, calc(100vh - 48px))")};
  overflow: hidden;
  border-radius: 28px;
  background: rgba(10, 14, 24, 0.82);
  border: 1px solid ${glassBorder};
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);

  @media (max-width: 520px) {
    inset: auto 10px 10px;
    width: auto;
    height: min(72dvh, 620px);
    border-radius: 22px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88px;
  padding: 0 22px 0 26px;
  background: rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid ${glassBorder};
  color: #fff;
`;

export const Title = styled.h2`
  margin: 0;
  font-family: "Roboto Slab", serif;
  font-size: 17px;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  font-family: "Roboto Slab", serif;
  font-size: 12px;
  opacity: 0.9;
`;

export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 50%;
  margin-left: 6px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;

  svg {
    width: 21px;
    height: 21px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

export const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
`;

export const HeaderButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${glassBorder};
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  opacity: 0.52;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.24);
    opacity: 1;
    transform: translateY(-1px);
  }
`;

export const WindowIcon = styled.span`
  position: relative;
  display: block;
  width: 22px;
  height: 18px;
  box-sizing: border-box;
  color: #fff;

  ${({ $variant }) => $variant === "mini" && `
    border: 3px solid currentColor;
    border-radius: 2px;

    &::after {
      content: "";
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 8px;
      height: 6px;
      border-radius: 2px;
      background: currentColor;
    }
  `}

  ${({ $variant }) => $variant === "window" && `
    border: 3px solid currentColor;
    border-radius: 2px;
  `}

  ${({ $variant }) => $variant === "corners" && `
    background:
      linear-gradient(currentColor, currentColor) left top / 3px 9px no-repeat,
      linear-gradient(currentColor, currentColor) left top / 9px 3px no-repeat,
      linear-gradient(currentColor, currentColor) right top / 3px 9px no-repeat,
      linear-gradient(currentColor, currentColor) right top / 9px 3px no-repeat,
      linear-gradient(currentColor, currentColor) left bottom / 3px 9px no-repeat,
      linear-gradient(currentColor, currentColor) left bottom / 9px 3px no-repeat,
      linear-gradient(currentColor, currentColor) right bottom / 3px 9px no-repeat,
      linear-gradient(currentColor, currentColor) right bottom / 9px 3px no-repeat;
  `}
`;

export const Messages = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 24px 18px;
  overflow-y: auto;
  background: transparent;
  color: #f5f7ff;
  font-family: "Roboto Slab", serif;

  small {
    margin: 1px 0 0 2px;
    font-size: 12px;
    color: rgba(245, 247, 255, 0.68);
  }
`;

export const Message = styled.div`
  position: relative;
  max-width: 84%;
  padding: 15px 20px;
  border: 1px solid ${glassBorder};
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
  font-size: 15px;
  line-height: 1.35;

  &::before {
    content: "";
    position: absolute;
    bottom: 9px;
    left: -13px;
    width: 18px;
    height: 18px;
    border-bottom: 1px solid ${glassBorder};
    border-left: 1px solid ${glassBorder};
    background: rgba(255, 255, 255, 0.12);
    transform: skewX(-28deg) rotate(22deg);
  }
`;

export const GeneratedResult = styled.div`
  display: grid;
  gap: 10px;
  width: min(100%, 440px);
  margin-top: 12px;
`;

export const GeneratedImage = styled.img`
  display: block;
  width: 100%;
  max-height: min(42vh, 480px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  object-fit: contain;
  background: #111115;
`;

export const ResultActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ResultAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid ${glassBorder};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font: 600 12px "Roboto Slab", serif;
  text-decoration: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

export const MessageIcon = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1px solid ${glassBorder};
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    stroke-width: 2;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

export const MessageActions = styled.div`
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Composer = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 76px;
  padding: 9px 18px;
  background: rgba(255, 255, 255, 0.12);
  border-top: 1px solid ${glassBorder};
`;

export const ComposerInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 58px;
  padding: 0 18px;
  border: 1px solid ${glassBorder};
  border-radius: 30px;
  outline: none;
  background: rgba(255, 255, 255, 0.14);
  color: #f5f7ff;
  font: 15px "Roboto Slab", serif;
`;

export const ComposerButton = styled.button`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-left: -57px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;

  svg {
    width: 23px;
    height: 23px;
    fill: #fff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;
