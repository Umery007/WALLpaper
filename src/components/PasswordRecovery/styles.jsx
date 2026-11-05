import styled from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  color: #fff;
  background: #0b0c10;
`;

export const Panel = styled.section`
  width: min(100%, 480px);
  padding: 28px;
  background: #15171e;
  border: 1px solid #343843;
  border-radius: 18px;

  h1 { margin: 28px 0 8px; }
  p { color: #c2c5cd; line-height: 1.5; }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  color: #fff;
  background: #20232b;
  border: 1px solid #454955;
  border-radius: 9px;
  cursor: pointer;
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
  margin: 18px 0;

  input {
    padding: 12px;
    color: #fff;
    background: #0f1117;
    border: 1px solid #454955;
    border-radius: 9px;
    font: inherit;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
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

export const Success = styled.p`
  color: #95e7a4 !important;
`;

export const LoginLink = styled(Link)`
  display: inline-block;
  margin-top: 18px;
  color: #d9ddff;
`;
