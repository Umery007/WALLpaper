import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px 20px 64px;
  color: #fff;
  background: #0b0c10;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  color: #fff;
  background: #20232b;
  border: 1px solid #454955;
  border-radius: 10px;
  cursor: pointer;
`;

export const Panel = styled.section`
  width: min(100%, 640px);
  margin: 28px auto;
  padding: 28px;
  background: #15171e;
  border: 1px solid #343843;
  border-radius: 18px;

  h1 { margin: 0 0 8px; }
  p { color: #c2c5cd; }
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
  margin: 18px 0;

  input, textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    color: #fff;
    background: #0f1117;
    border: 1px solid #454955;
    border-radius: 9px;
    font: inherit;
  }

  textarea { min-height: 110px; resize: vertical; }
`;

export const SubmitButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 13px 18px;
  color: #101116;
  background: #fff;
  border: 0;
  border-radius: 9px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:disabled { cursor: wait; opacity: 0.7; }
`;

export const Error = styled.p`
  color: #ffb4ad !important;
`;
