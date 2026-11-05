import styled from "styled-components";

const border = "rgba(255, 255, 255, 0.09)";
const muted = "rgba(236, 238, 245, 0.58)";

export const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 68% 10%, rgba(82, 73, 108, 0.13), transparent 38%),
    #0b0b0e;
  color: #f5f5f7;
  font-family: "Roboto Slab", serif;
`;

export const Rail = styled.aside`
  display: flex;
  flex: 0 0 68px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  background: rgba(14, 14, 18, 0.88);
  border-right: 1px solid ${border};

  @media (max-width: 720px) {
    display: none;
  }
`;

export const BrandMark = styled.div`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 13px;
  background: linear-gradient(145deg, #f5f2ea, #d8d1c5);
  color: #242126;
  font: 700 21px "Im FELL French Canon SC", serif;
`;

export const RailButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.13)" : "transparent")};
  border-radius: 12px;
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.09)" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.62)")};
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  svg {
    width: 19px;
    height: 19px;
    stroke-width: 1.7;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const ChatSidebar = styled.aside`
  display: flex;
  flex: 0 0 244px;
  flex-direction: column;
  gap: 12px;
  padding: 28px 16px;
  background: rgba(17, 17, 21, 0.72);
  border-right: 1px solid ${border};

  @media (max-width: 920px) {
    flex-basis: 208px;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

export const Brand = styled.div`
  margin: 2px 8px 17px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.07);
  color: #f6f5f7;
  font: 13px "Roboto Slab", serif;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.24);
    background: rgba(255, 255, 255, 0.11);
  }
`;

export const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;

  p {
    margin: 2px 9px;
    color: ${muted};
    font: 12px/1.5 "Roboto Slab", serif;
  }
`;

export const SidebarLabel = styled.h2`
  margin: 0 8px 3px;
  color: rgba(236, 238, 245, 0.42);
  font: 600 10px "Roboto Slab", serif;
  letter-spacing: 0.1em;
`;

export const SidebarSelection = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 10px 9px;
  overflow: hidden;
  border: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.075);
  color: rgba(255, 255, 255, 0.88);
  font: 12px "Roboto Slab", serif;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    flex: 0 0 15px;
    width: 15px;
    height: 15px;
    color: rgba(255, 255, 255, 0.66);
  }
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.header`
  flex: 0 0 auto;
  padding: 16px 28px 0;

  @media (max-width: 520px) {
    padding: 10px 14px 0;
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  padding: 0 4px 12px;
  border-bottom: 1px solid ${border};

  .back-button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid ${border};
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.045);
    color: rgba(255, 255, 255, 0.82);
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
`;

export const HeaderUser = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
`;

export const ProfileAvatar = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: #25252b;
  color: #f1f1f2;

  svg {
    width: 17px;
    height: 17px;
  }
`;

export const ChatPanel = styled.section`
  display: flex;
  width: min(860px, calc(100% - 64px));
  min-height: 0;
  flex: 1;
  flex-direction: column;
  align-self: center;
  padding: 20px 0 12px;

  @media (max-width: 720px) {
    width: calc(100% - 36px);
  }

  @media (max-width: 520px) {
    width: calc(100% - 24px);
    padding-top: 12px;
  }
`;

export const Conversation = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  padding: 18px 8px 24px;
  overflow-y: auto;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  scrollbar-width: thin;
`;

export const ChatMessage = styled.article`
  align-self: ${({ $fromUser }) => ($fromUser ? "flex-end" : "flex-start")};
  width: fit-content;
  max-width: min(76%, 620px);
  padding: ${({ $fromUser }) => ($fromUser ? "13px 17px" : "5px 0")};
  border: ${({ $fromUser }) => ($fromUser ? "1px solid rgba(255,255,255,0.09)" : "0")};
  border-radius: 16px;
  background: ${({ $fromUser }) => ($fromUser ? "rgba(255,255,255,0.075)" : "transparent")};
  color: ${({ $fromUser }) => ($fromUser ? "#f6f5f7" : "rgba(246,245,247,0.9)")};
  font-size: 14px;
  line-height: 1.65;

  img {
    display: block;
    width: min(100%, 560px);
    max-height: min(48vh, 520px);
    margin-top: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    object-fit: contain;
    background: #111115;
  }

  @media (max-width: 520px) {
    max-width: 90%;
    font-size: 13px;
  }
`;

export const MessageText = styled.p`
  margin: 0;
`;

export const Notice = styled.p`
  margin: 10px 0 0;
  color: rgba(236, 238, 245, 0.4);
  font: 10px/1.4 "Roboto Slab", serif;
  text-align: center;
`;
