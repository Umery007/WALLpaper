import styled, { keyframes } from "styled-components";

export const Bloco = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
`;

export const Abas = styled.div`
  display: flex;
  gap: 8px;
`;

export const Aba = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  padding: 9px 12px;
  border: 1px solid ${({ $ativa }) => ($ativa ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)")};
  border-radius: 10px;
  background: ${({ $ativa }) => ($ativa ? "rgba(255,255,255,0.20)" : "transparent")};
  color: #fff;
  font-size: 14px;
  font-weight: ${({ $ativa }) => ($ativa ? 600 : 400)};
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover { background: rgba(255, 255, 255, 0.14); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const CampoBusca = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;

  &::placeholder { color: rgba(255, 255, 255, 0.5); }
  &:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.7); outline-offset: 1px; }
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
`;

export const Miniatura = styled.button`
  position: relative;
  aspect-ratio: 9 / 16;
  padding: 0;
  border: 2px solid ${({ $marcada }) => ($marcada ? "#fff" : "transparent")};
  border-radius: 9px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${({ $marcada }) => ($marcada ? 1 : 0.78)};
  }

  &:hover { transform: translateY(-2px); }
  &:hover img { opacity: 1; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const Selo = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  color: #111;
`;

export const AreaIA = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CampoPrompt = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;

  &::placeholder { color: rgba(255, 255, 255, 0.5); }
  &:disabled { opacity: 0.6; }
  &:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.7); outline-offset: 1px; }
`;

const girar = keyframes`to { transform: rotate(360deg); }`;

export const BotaoGerar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.26); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

  .girando { animation: ${girar} 1s linear infinite; }
`;

export const Aviso = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.45;
`;

export const Resumo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
`;

export const BotaoLimpar = styled.button`
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background: transparent;
  color: #fff;
  font-size: 12px;
  cursor: pointer;

  &:hover { background: rgba(255, 255, 255, 0.14); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;
