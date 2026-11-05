import styled from "styled-components";

function isLightColor(color) {
  const channels = color.match(/[a-f\d]{2}/gi)?.map((channel) => parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) return false;
  const linearChannels = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  const luminance = 0.2126 * linearChannels[0]
    + 0.7152 * linearChannels[1]
    + 0.0722 * linearChannels[2];
  return luminance > 0.45;
}

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(5, 7, 12, 0.78);
  backdrop-filter: blur(9px);
`;

export const Panel = styled.div`
  width: min(760px, 100%);
  max-height: min(96vh, 820px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(174, 180, 194, 0.3) transparent;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  background: linear-gradient(145deg, #171b25, #0d1018);
  color: #f9fafb;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.48);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(174, 180, 194, 0.3);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(174, 180, 194, 0.55);
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;

  p {
    margin: 0 0 7px;
    color: #aeb4c2;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(23px, 4vw, 30px);
  }

  button {
    display: grid;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    cursor: pointer;
  }
`;

export const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 0 0 24px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.055);

  > svg {
    flex-shrink: 0;
    color: #fff;
  }

  strong {
    display: block;
    color: #fff;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0;
    color: #aeb4c2;
    font-size: 12px;
    line-height: 1.5;
  }

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

export const UpgradeButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  padding: 9px 12px;
  border: 0;
  border-radius: 9px;
  background: #f3f4f6;
  color: #111827;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #fff;
  }
`;

export const Category = styled.section`
  margin-top: 22px;

`;

export const CategoryToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 15px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.055);
  color: #e5e7eb;
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover,
  &[aria-expanded="true"] {
    border-color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color-accent);
    outline-offset: 3px;
  }

  > svg {
    flex-shrink: 0;
    transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
    transition: transform 160ms ease;
  }
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin-top: 8px;

  @media (max-width: 620px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 380px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &[hidden] {
    display: none;
  }
`;

export const NormalOption = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ $selected }) =>
    $selected ? "var(--primary-color-accent)" : "rgba(255, 255, 255, 0.14)"};
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.045);
  color: #fff;
  text-align: left;
  cursor: pointer;

  > span {
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 9px;
    background: linear-gradient(135deg, var(--primary-color-accent) 0 49%, #111827 51% 100%);
  }

  > div {
    display: grid;
    gap: 3px;
    flex: 1;
  }

  strong {
    font-size: 13px;
  }

  small {
    color: #aeb4c2;
    font-size: 11px;
  }

  > svg {
    color: var(--primary-color-accent);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color-accent);
    outline-offset: 3px;
  }
`;

export const ColorOption = styled.button`
  position: relative;
  display: grid;
  min-width: 0;
  aspect-ratio: 1;
  place-items: center;
  border: 2px solid ${({ $selected }) =>
    $selected ? "#fff" : "rgba(255, 255, 255, 0.18)"};
  border-radius: 13px;
  background: ${({ $color }) => $color};
  color: ${({ $color }) => (isLightColor($color) ? "#111827" : "#fff")};
  opacity: ${({ $locked }) => ($locked ? 0.58 : 1)};
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 0 2px rgba(255, 255, 255, 0.2)" : "0 5px 14px rgba(0, 0, 0, 0.22)"};
  transition: transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease;

  &:hover:not([aria-disabled="true"]) {
    transform: translateY(-3px);
    box-shadow: 0 9px 20px rgba(0, 0, 0, 0.3);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

export const ColorName = styled.span`
  position: absolute;
  right: 4px;
  bottom: 4px;
  left: 4px;
  overflow: hidden;
  padding: 3px 4px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 9px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`;