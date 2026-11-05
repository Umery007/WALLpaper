import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px clamp(20px, 6vw, 88px) 80px;
  box-sizing: border-box;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.08), transparent 36%),
    linear-gradient(135deg, #06060a 0%, #111827 100%);
  color: #f9fafb;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #d1d5db;
  font: inherit;
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;

  &:hover {
    color: #fff;
    border-color: var(--primary-color-border);
    background: var(--primary-color-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color-accent);
    outline-offset: 3px;
  }
`;

export const Hero = styled.header`
  max-width: 780px;
  margin: 52px auto 32px;
  text-align: center;
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 8px 14px;
  border: 1px solid var(--primary-color-border);
  border-radius: 999px;
  background: var(--primary-color-soft);
  color: #f3f4f6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.08;
`;

export const Subtitle = styled.p`
  max-width: 620px;
  margin: 18px auto 0;
  color: #aeb4c2;
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
`;

export const BillingNotice = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 0 auto 28px;
  color: #e5e7eb;
  font-size: 14px;

  svg {
    color: #fff;
  }
`;

export const CreditGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 700px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    max-width: 390px;
  }
`;

export const CreditCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 252px;
  padding: 30px 22px 22px;
  border: 1px solid ${({ $popular }) =>
    $popular ? "var(--primary-color-border)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 22px;
  background: ${({ $popular }) =>
    $popular
      ? "linear-gradient(155deg, var(--primary-color-soft), rgba(17, 24, 39, 0.96) 55%)"
      : "linear-gradient(155deg, rgba(255, 255, 255, 0.055), rgba(17, 24, 39, 0.92))"};
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color-border);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }
`;

export const PackTag = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--primary-color-accent);
  color: var(--primary-color-ink);
  font-size: 10px;
  font-weight: 800;
`;

export const CreditAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  color: #fff;

  svg {
    color: #d1d5db;
  }

  span {
    font-size: 38px;
    font-weight: 750;
    letter-spacing: -0.04em;
  }

  & + p {
    margin: 1px 0 0 34px;
    color: #aeb4c2;
    font-size: 14px;
  }
`;

export const PackPrice = styled.p`
  margin: 20px 0;
  color: #fff;
  font-size: 29px;
  font-weight: 700;

  span {
    color: #d1d5db;
    font-size: 15px;
    font-weight: 500;
  }
`;

export const BuyButton = styled.button`
  width: 100%;
  min-height: 46px;
  margin-top: auto;
  padding: 11px 16px;
  border: 1px solid ${({ $primary }) =>
    $primary ? "transparent" : "rgba(255, 255, 255, 0.16)"};
  border-radius: 12px;
  background: ${({ $primary }) =>
    $primary ? "var(--primary-button-bg)" : "rgba(255, 255, 255, 0.06)"};
  color: ${({ $primary }) => ($primary ? "var(--primary-button-ink)" : "#fff")};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $primary }) =>
      $primary ? "color-mix(in srgb, var(--primary-button-bg) 88%, #fff)" : "rgba(255, 255, 255, 0.12)"};
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color-accent);
    outline-offset: 3px;
  }
`;

export const SectionDescription = styled.p`
  max-width: 720px;
  margin: 24px auto 78px;
  color: #aeb4c2;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 25px;
  color: #fff;
  font-size: clamp(24px, 3vw, 32px);
  text-align: center;
`;

export const BenefitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    max-width: 540px;
  }
`;

export const BenefitCard = styled.article`
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);

  > svg {
    color: #fff;
  }

  h3 {
    margin: 16px 0 8px;
    color: #f9fafb;
    font-size: 17px;
  }

  p {
    margin: 0;
    color: #aeb4c2;
    font-size: 14px;
    line-height: 1.6;
  }
`;

export const FaqSection = styled.section`
  max-width: 850px;
  margin: 88px auto 0;
`;

export const FaqTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 0 25px;
  color: #fff;
  font-size: clamp(24px, 3vw, 32px);
  text-align: center;
`;

export const FaqList = styled.div`
  display: grid;
  gap: 12px;
`;

export const FaqItem = styled.article`
  padding: 20px 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.035);

  h3 {
    margin: 0;
    color: #f9fafb;
    font-size: 15px;
  }
`;

export const FaqAnswer = styled.p`
  margin: 9px 0 0;
  color: #aeb4c2;
  font-size: 14px;
  line-height: 1.6;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(5, 7, 12, 0.76);
  backdrop-filter: blur(8px);
`;

export const Modal = styled.div`
  position: relative;
  width: min(440px, 100%);
  padding: 34px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: #151923;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
`;

export const ModalTitle = styled.h2`
  margin: 0 38px 12px 0;
  color: #fff;
  font-size: 23px;
`;

export const ModalText = styled.p`
  margin: 0 0 22px;
  color: #b5bbc8;
  font-size: 14px;
  line-height: 1.65;
`;
