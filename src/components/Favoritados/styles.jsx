import styled from "styled-components";

export const FavoritedPage = styled.main`
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24px clamp(14px, 4vw, 32px) 42px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 32%),
    linear-gradient(180deg, #0b0d12 0%, #0d1118 100%);
  color: #f5f5f5;
  font-family: Arial, sans-serif;
`;

export const Header = styled.header`
  position: relative;
  width: min(760px, calc(100% - 64px));
  max-width: 100%;
  box-sizing: border-box;
  height: 58px;
  margin: 0 auto 28px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24), inset 0 1px rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  max-width: 100%;
  margin: 0;
  padding: 0 18px;
  text-align: center;
  font-size: clamp(20px, 2.4vw, 29px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.01em;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 18px;
  left: clamp(14px, 2vw, 28px);
  z-index: 2;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #f8f8f8;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const FavoritedPanel = styled.section`
  position: relative;
  width: min(1040px, 100%);
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 24px 26px 22px;
  min-height: 700px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  backdrop-filter: blur(16px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35), inset 0 1px rgba(255,255,255,0.12);
  display: flex;
  flex-direction: column;

  @media (max-width: 560px) {
    padding: 14px 12px 12px;
    min-height: 620px;
  }
`;

export const CountLabel = styled.p`
  width: min(300px, 76%);
  height: 40px;
  box-sizing: border-box;
  margin: 0 auto 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px rgba(255,255,255,0.12);
  display: grid;
  place-items: center;
  color: #f2f2f2;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 0.02em;
`;

export const PageIndicator = styled.p`
  margin: -2px auto 18px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1;
`;

export const EmptyState = styled.div`
  flex: 1;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 62px;
  height: 62px;
  margin-bottom: 20px;
  display: grid;
  place-items: center;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.14);
`;

export const EmptyTitle = styled.h2`
  max-width: 520px;
  margin: 0;
  color: #fff;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const EmptyDescription = styled.p`
  max-width: 440px;
  margin: 12px 0 24px;
  color: rgba(238, 241, 248, 0.7);
  font-size: 15px;
  line-height: 1.6;
`;

export const LoginButton = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 22px;
  color: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  background: #f6f7fb;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: #fff;
  }
`;

export const SignupLink = styled.p`
  margin: 18px 0 0;
  color: rgba(238, 241, 248, 0.64);
  font-size: 13px;

  a {
    margin-left: 4px;
    color: #fff;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const WallpaperGrid = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: visible;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 560px) {
    gap: 8px;
  }
`;

export const GalleryButton = styled.button`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: clamp(-48px, -4vw, -18px);
  width: 42px;
  height: 58px;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  color: #f5f5f5;
  background: rgba(255, 255, 255, 0.05);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 1;
  backdrop-filter: blur(10px);
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-50%) scale(1.03);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 560px) {
    ${({ $side }) => $side}: 2px;
    width: 34px;
    height: 50px;
  }
`;

export const WallpaperCard = styled.article`
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(20, 20, 20, 0.9);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.28);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

  &:hover {
    z-index: 1;
    border-color: rgba(255, 255, 255, 0.24);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 16px 28px rgba(0, 0, 0, 0.45);
  }
`;

export const WallpaperImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.08);
`;

export const FavoriteIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(10, 10, 12, 0.54);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  color: var(--primary-color-accent);
  display: grid;
  place-items: center;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
`;
