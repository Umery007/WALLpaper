import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding: 24px clamp(16px, 4vw, 64px) 80px;
  box-sizing: border-box;
  background:
    radial-gradient(ellipse at 75% 4%, rgba(85, 116, 255, 0.11), transparent 34%),
    radial-gradient(ellipse at 5% 40%, rgba(255, 48, 56, 0.06), transparent 28%),
    linear-gradient(160deg, #080a10 0%, #10131c 55%, #080a0f 100%);
  color: #f4f5f8;
`;

export const TopLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1320px, 100%);
  margin: 0 auto 22px;
  color: #737b8b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;

  @media (max-width: 540px) {
    margin-bottom: 14px;
    span {
      font-size: 8px;
    }
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
  color: #d6d9e0;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.09);
  }
`;

export const MainLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(330px, 0.82fr);
  align-items: start;
  gap: clamp(20px, 3.2vw, 44px);
  width: min(1320px, 100%);
  margin: 0 auto 76px;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin-bottom: 54px;
  }
`;

export const ImageColumn = styled.div`
  min-width: 0;
`;

export const ImageStage = styled.div`
  overflow: hidden;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  background: linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025));
  box-shadow: 0 28px 75px rgba(0, 0, 0, 0.42), 0 0 80px ${({ $tone }) =>
    $tone === "warm" ? "rgba(255, 95, 58, 0.12)" : "rgba(74, 111, 255, 0.12)"};
`;

export const FeaturedImageWrap = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 360px;
  aspect-ratio: 1.08 / 1;
  border-radius: 17px;
  background: #141b31;

  @media (max-width: 560px) {
    min-height: 270px;
    aspect-ratio: 0.95 / 1;
  }
`;

export const FeaturedImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  position: absolute;
  inset: 0;
  object-fit: cover;
  object-position: ${({ $position }) => $position};
  filter: ${({ $tone }) => {
    if ($tone === "warm") return "saturate(1.18) hue-rotate(-12deg) brightness(.92)";
    if ($tone === "violet") return "saturate(1.05) hue-rotate(12deg) brightness(.86)";
    if ($tone === "cool") return "saturate(.9) hue-rotate(-7deg) brightness(.8)";
    if ($tone === "rose") return "saturate(1.1) hue-rotate(22deg) brightness(.9)";
    return "saturate(.94) brightness(.86)";
  }};
  transition: filter 220ms ease, object-position 220ms ease;
`;

export const ImageBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(9, 12, 19, 0.55);
  color: #fff;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.09em;
  backdrop-filter: blur(12px);
`;

export const ImageControls = styled.div`
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: flex;
  gap: 8px;
`;

export const SmallAction = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(9, 12, 19, 0.6);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(12px);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

export const ImageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 5px 2px;
  color: #858c9b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
`;

export const DetailColumn = styled.section`
  min-width: 0;
  padding: 9px 0;
  color: #b7bdc9;
  font-size: 13px;
  line-height: 1.7;

  > p {
    margin: 21px 0 17px;
    color: #c3c8d2;
    line-height: 1.8;
  }
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

export const DetailLabel = styled.span`
  display: block;
  margin-bottom: 9px;
  color: #939aab;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.16em;
`;

export const PinTitle = styled.h1`
  max-width: 540px;
  margin: 0;
  color: #fff;
  font-size: clamp(27px, 3.1vw, 43px);
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1.08;
`;

export const ActionRow = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 7px;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) =>
    $active ? "rgba(255, 48, 56, .5)" : "rgba(255, 255, 255, .13)"};
  border-radius: 13px;
  background: ${({ $active }) =>
    $active ? "rgba(255, 48, 56, .13)" : "rgba(255, 255, 255, .055)"};
  color: ${({ $active }) => ($active ? "#ff666d" : "#f5f6f8")};
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ArtistCard = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 24px;
  padding: 13px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.035);

  > button {
    margin-left: auto;
    padding: 7px 13px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: 11px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const ArtistAvatar = styled.div`
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: linear-gradient(145deg, #6074bd, #212b48);
  color: #fff;
  font-size: 14px;
  font-weight: 750;
`;

export const ArtistInfo = styled.div`
  display: grid;
  min-width: 0;

  strong {
    overflow: hidden;
    color: #f5f6f8;
    font-size: 12px;
    text-overflow: ellipsis;
  }

  span {
    color: #858c9b;
    font-size: 10px;
  }
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 17px 0 21px;
`;

export const Tag = styled.span`
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #aeb5c3;
  font-size: 10px;
`;

export const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  background: linear-gradient(100deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.075));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.09);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 150ms ease, transform 150ms ease;

  span {
    margin-left: 4px;
    padding: 3px 6px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.12);
    color: #dce0e8;
    font-size: 9px;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const Comments = styled.div`
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: ${({ $related }) => ($related ? "19px" : "15px")};
  color: #9199a9;

  h2 {
    margin: 0;
    color: #f7f8fb;
    font-size: ${({ $related }) => ($related ? "22px" : "14px")};
    font-weight: 650;
    letter-spacing: ${({ $related }) => ($related ? "-0.025em" : "0")};
  }

  span {
    color: #7d8492;
    font-size: 10px;
  }

  > div > span {
    display: block;
    margin-top: 3px;
  }

  @media (max-width: 560px) {
    ${({ $related }) => $related && "align-items: flex-start;"}
    ${({ $related }) => $related && "> span { display: none; }"}
  }
`;

export const Comment = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 12px 0;

  > div:last-child {
    min-width: 0;
  }

  strong {
    color: #e5e8ee;
    font-size: 11px;
  }

  p {
    margin: 1px 0 0;
    color: #aeb4c1;
    font-size: 11px;
    line-height: 1.5;
  }
`;

export const CommentAvatar = styled.span`
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #252d3c;
  color: #d9deea;
  font-size: 10px;
  font-weight: 700;
`;

export const CommentComposer = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 5px 6px 5px 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 13px;
  background: rgba(0, 0, 0, 0.16);

  button {
    display: grid;
    width: 33px;
    height: 33px;
    flex: 0 0 auto;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.11);
    color: #fff;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;

export const CommentInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 11px;

  &::placeholder {
    color: #737b8b;
  }
`;

export const PinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  align-items: start;
  gap: 14px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

export const PinCard = styled.button`
  display: grid;
  gap: 9px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover img {
    transform: scale(1.05);
  }

  &:hover > div > span {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PinImageWrap = styled.div`
  position: relative;
  overflow: hidden;
  height: ${({ $height }) => {
    if ($height === "tall") return "250px";
    if ($height === "short") return "160px";
    return "205px";
  }};
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  background: #161d2d;

  > span {
    position: absolute;
    right: 8px;
    bottom: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 10px;
    background: rgba(8, 10, 16, 0.72);
    color: #fff;
    font-size: 10px;
    opacity: 0;
    transform: translateY(5px);
    transition: opacity 160ms ease, transform 160ms ease;
    backdrop-filter: blur(10px);
  }

  @media (max-width: 560px) {
    height: ${({ $height }) => ($height === "tall" ? "205px" : "165px")};
  }
`;

export const PinImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $position }) => $position};
  filter: ${({ $tone }) => {
    if ($tone === "warm") return "saturate(1.2) hue-rotate(-12deg) brightness(.88)";
    if ($tone === "violet") return "saturate(1.12) hue-rotate(12deg) brightness(.8)";
    if ($tone === "cool") return "saturate(.82) hue-rotate(-8deg) brightness(.82)";
    if ($tone === "rose") return "saturate(1.15) hue-rotate(24deg) brightness(.88)";
    return "saturate(.95) brightness(.8)";
  }};
  transition: transform 240ms ease;
`;

export const PinMeta = styled.div`
  display: grid;
  gap: 2px;
  padding: 0 2px;

  strong {
    overflow: hidden;
    color: #e8eaf0;
    font-size: 11px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #838b9a;
    font-size: 10px;
  }
`;

export const Toast = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1500;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(24, 28, 38, 0.96);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 12px;
  animation: pin-toast-in 180ms ease-out;

  @keyframes pin-toast-in {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
