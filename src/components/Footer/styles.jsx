import styled from "styled-components";

export const FooterBar = styled.footer`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background:
    radial-gradient(circle at 12% 0%, rgba(76, 111, 148, 0.22), transparent 30%),
    linear-gradient(135deg, #10151e 0%, #11131a 52%, #1a1717 100%);
  color: rgba(255, 255, 255, 0.78);
  box-shadow: 0 -18px 45px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 64px;
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  padding: 48px 0 42px;

  @media (max-width: 780px) {
    flex-direction: column;
    gap: 34px;
    padding: 36px 0;
  }
`;

export const FooterHeading = styled.div`
  flex: 0 1 280px;
`;

export const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: #fff;
  font: 22px "Im FELL French Canon SC", serif;
`;

export const FooterMark = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #16191f;
  font-size: 20px;
`;

export const FooterDescription = styled.p`
  max-width: 250px;
  margin: 18px 0 16px;
  color: rgba(255, 255, 255, 0.58);
  font: 13px/1.6 "Roboto Slab", serif;
`;

export const FooterStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #b5d6c1;
  font: 11px "Roboto Slab", serif;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const FooterNav = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 48px;
  flex: 1;

  @media (max-width: 560px) {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 18px;
  }
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const FooterColumnTitle = styled.h3`
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.46);
  font: 10px/1 "Roboto Slab", serif;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const FooterLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.76);
  font: 13px "Roboto Slab", serif;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.65;
  }

  &:hover,
  &:focus-visible {
    color: #fff;
    transform: translateX(3px);
    outline: none;
  }
`;

export const FooterLinks = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(90px, 1fr));
  gap: 9px;
  width: 100%;
  margin-bottom: 7px;
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.72);
  font: 12px "Roboto Slab", serif;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover,
  &:focus-visible {
    color: #fff;
    transform: translateX(3px);
    outline: none;
  }
`;

export const SocialLabel = styled.span``;

export const FooterDivider = styled.hr`
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  padding: 20px 0 24px;

  > div {
    display: flex;
    gap: 20px;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`;

export const FooterText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.48);
  font: 11px "Roboto Slab", serif;

  svg {
    width: 12px;
    height: 12px;
    vertical-align: -2px;
    color: #d9a5a5;
  }
`;

export const FooterBottomLink = styled.a`
  color: rgba(255, 255, 255, 0.48);
  font: 11px "Roboto Slab", serif;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: #fff;
    outline: none;
  }
`;
