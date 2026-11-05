import styled from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.main`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 24px;
  text-align: center;
  background-image: linear-gradient(135deg, #06060a 0%, #111827 100%);
  color: #f5f5f7;
`;

export const Code = styled.p`
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(26px, 5vw, 40px);
`;

export const Description = styled.p`
  margin: 0;
  max-width: 420px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.68);
`;

export const HomeLink = styled(Link)`
  margin-top: 10px;
  padding: 12px 26px;
  border-radius: 999px;
  border: 1px solid var(--primary-color-border);
  background: var(--primary-color-soft);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
`;
