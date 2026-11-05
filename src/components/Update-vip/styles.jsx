import styled, { css } from "styled-components";

export const Container = styled.main`
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
  transition: color 180ms ease, background 180ms ease, border-color 180ms ease;

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
  margin: 52px auto 44px;
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

export const PlanGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 22px;
  max-width: 1160px;
  margin: 0 auto;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    max-width: 540px;
  }
`;

export const PlanCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 420px;
  padding: 30px;
  border: 1px solid ${({ $popular }) =>
    $popular ? "var(--primary-color-border)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 22px;
  background: ${({ $popular }) =>
    $popular
      ? "linear-gradient(155deg, var(--primary-color-soft), rgba(17, 24, 39, 0.96) 48%)"
      : "linear-gradient(155deg, rgba(255, 255, 255, 0.055), rgba(17, 24, 39, 0.92))"};
  box-shadow: ${({ $popular }) =>
    $popular ? "0 18px 55px var(--primary-color-glow)" : "0 14px 40px rgba(0, 0, 0, 0.18)"};
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color-border);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
  }

  ${({ $popular }) => $popular && css`
    @media (min-width: 851px) {
      transform: translateY(-8px);

      &:hover {
        transform: translateY(-12px);
      }
    }
  `}

  @media (max-width: 850px) {
    min-height: 0;
  }
`;

export const PopularBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 7px 11px;
  border-radius: 999px;
  background: var(--primary-color-accent);
  color: var(--primary-color-ink);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const PlanHeader = styled.div`
  min-height: 82px;
  padding-right: 48px;
`;

export const PlanName = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 25px;
`;

export const Description = styled.p`
  margin: 8px 0 0;
  color: #aeb4c2;
  font-size: 14px;
  line-height: 1.5;
`;

export const Price = styled.p`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 22px 0;
  color: #fff;
  font-size: clamp(34px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: -0.04em;

  span {
    color: #d1d5db;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
  }
`;

export const PricePeriod = styled.span`
  color: #9299a8 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
`;

export const FeatureList = styled.ul`
  display: grid;
  gap: 14px;
  margin: 0 0 28px;
  padding: 22px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #d4d8e1;
    font-size: 14px;
    line-height: 1.45;
  }

  svg {
    flex-shrink: 0;
    color: #fff;
  }
`;

export const PlanButton = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: auto;
  padding: 12px 16px;
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
  transition: transform 180ms ease, filter 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
    background: ${({ $primary }) =>
      $primary ? "color-mix(in srgb, var(--primary-button-bg) 88%, #fff)" : "rgba(255, 255, 255, 0.12)"};
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color-accent);
    outline-offset: 3px;
  }
`;

export const BillingNote = styled.p`
  max-width: 760px;
  margin: 22px auto 0;
  color: #858c9b;
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
`;

export const BenefitsSection = styled.section`
  max-width: 1160px;
  margin: 104px auto 0;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: clamp(27px, 4vw, 38px);
  letter-spacing: -0.03em;
`;

export const SectionDescription = styled.p`
  max-width: 600px;
  margin: 12px auto 34px;
  color: #aeb4c2;
  font-size: 15px;
  line-height: 1.7;
`;

export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Benefit = styled.article`
  padding: 26px 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);
  text-align: left;

  h3 {
    margin: 18px 0 8px;
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

export const BenefitIcon = styled.div`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
`;