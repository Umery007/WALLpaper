import styled from "styled-components";

export const DownloadedPage = styled.main`
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

export const DownloadedPanel = styled.section`
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
    position: relative;
    z-index: 1;
    border-color: rgba(255, 255, 255, 0.24);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 16px 28px rgba(0, 0, 0, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

export const WallpaperImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.08);
`;
