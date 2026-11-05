import styled from "styled-components";

const border = "rgba(255, 255, 255, 0.13)";

export const PromptBar = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 58px;
  padding: 7px 9px;
  box-sizing: border-box;
  border: 1px solid ${border};
  border-radius: 17px;
  background: rgba(25, 25, 30, 0.92);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.2);
  transition: border-color 0.18s ease, background 0.18s ease;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.28);
    background: #1b1b20;
  }

  @media (max-width: 520px) {
    gap: 4px;
    min-height: 54px;
    padding: 6px;
  }
`;

export const PromptInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 10px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f5f7ff;
  font: 13px "Roboto Slab", serif;
  text-align: left;

  &::placeholder {
    color: rgba(255, 255, 255, 0.48);
    opacity: 1;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const PromptSide = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FormatToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid ${border};
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.05);
`;

export const FormatOption = styled.button`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: ${(props) => (props.$ativo ? "rgba(255, 255, 255, 0.18)" : "transparent")};
  color: ${(props) => (props.$ativo ? "#ffffff" : "rgba(255, 255, 255, 0.55)")};
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.8;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActionButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 1.7;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(ActionButton)`
  background: #eeeaf2;
  color: #17151a;

  &:hover {
    background: #fff;
    color: #17151a;
  }
`;