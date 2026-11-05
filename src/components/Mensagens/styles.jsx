import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

export const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  width: min(440px, 100%);
  height: 100dvh;
  color: #f7f7fa;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  background:
    radial-gradient(ellipse at 100% 0%, rgba(255, 255, 255, 0.08), transparent 42%),
    linear-gradient(155deg, #16161b, #0b0b0d 56%, #151519);
  box-shadow: -24px 0 70px rgba(0, 0, 0, 0.4);
  animation: panel-arrive 240ms ease-out both;

  @keyframes panel-arrive {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 92px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const HeadingGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Eyebrow = styled.p`
  margin: 0 0 5px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
`;

export const PanelTitle = styled.h2`
  overflow: hidden;
  margin: 0;
  color: #fff;
  font-size: 21px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderButton = styled.button`
  display: grid;
  flex: 0 0 40px;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;

  svg { width: 18px; height: 18px; }
  &:hover { color: #fff; background: rgba(255, 255, 255, 0.14); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 22px;
`;

export const SectionHeading = styled.h3`
  margin: 0 0 14px;
  color: rgba(255, 255, 255, 0.56);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 48px;
  margin-bottom: 27px;
  color: #f8f8fa;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  svg { width: 17px; height: 17px; }
  &:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-1px); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
`;

export const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  padding: 70px 18px 30px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);

  svg { width: 27px; height: 27px; }
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
`;

export const EmptyDescription = styled.p`
  max-width: 270px;
  margin: 9px 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  line-height: 1.6;
`;

export const SearchField = styled.label`
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 48px;
  margin-bottom: 26px;
  padding: 0 14px;
  color: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);

  > svg { flex: 0 0 17px; width: 17px; height: 17px; }
  input {
    flex: 1;
    min-width: 0;
    color: #fff;
    border: 0;
    outline: 0;
    background: transparent;
    font: inherit;
    font-size: 13px;
  }
  input::placeholder { color: rgba(255, 255, 255, 0.42); }
  button {
    display: grid;
    place-items: center;
    padding: 3px;
    color: inherit;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
`;

export const ContactList = styled.div`
  display: grid;
  gap: 5px;
`;

export const ContactButton = styled.button`
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 70px;
  padding: 10px;
  color: inherit;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.06);
  }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
  .contact-arrow { width: 16px; height: 16px; margin-left: auto; transform: rotate(135deg); opacity: 0.55; }
`;

export const Avatar = styled.span`
  display: grid;
  flex: 0 0 44px;
  place-items: center;
  width: 44px;
  height: 44px;
  color: #111813;
  border-radius: 15px;
  background: ${({ $color }) => $color};
  font-size: 18px;
  font-weight: 700;
`;

export const ContactInfo = styled.span`
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 4px;
`;

export const ContactName = styled.strong`
  overflow: hidden;
  color: rgba(255, 255, 255, 0.94);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ContactHandle = styled.span`
  overflow: hidden;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ThreadContact = styled.div`
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 4px;
`;

export const WallpaperTools = styled.div`
  display: grid;
  gap: 11px;
  padding: 15px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);

  ${SectionHeading} { margin-bottom: 0; }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 0 12px;
    color: #f4f4f6;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  label:hover { background: rgba(255, 255, 255, 0.14); }
  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }
  label:focus-within { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const WallpaperPreview = styled.img`
  display: block;
  width: 100%;
  max-height: 120px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
`;

export const WallpaperActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const WallpaperButton = styled.button`
  min-height: 38px;
  padding: 7px 9px;
  color: #f4f4f6;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: ${({ $secondary }) =>
    $secondary ? "transparent" : "rgba(255, 255, 255, 0.14)"};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.22); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const WallpaperReset = styled.button`
  justify-self: start;
  padding: 0;
  color: rgba(255, 255, 255, 0.72);
  border: 0;
  background: transparent;
  font-size: 11px;
  text-decoration: underline;
  cursor: pointer;
  &:hover { color: #fff; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const WallpaperError = styled.p`
  margin: 0;
  color: #ffb4ad;
  font-size: 12px;
  line-height: 1.4;
`;

export const WallpaperHint = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  line-height: 1.45;
`;

export const ThreadBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  overflow-y: auto;
  padding: 20px 18px;
  background-image: ${({ $wallpaper }) => $wallpaper
    ? `linear-gradient(rgba(11, 11, 13, 0.36), rgba(11, 11, 13, 0.48)), url("${$wallpaper}")`
    : "none"};
  background-position: center;
  background-size: cover;
`;

export const ThreadEmpty = styled.div`
  display: grid;
  flex: 1;
  align-content: center;
  justify-items: center;
  width: 100%;
  padding: 30px;
  text-align: center;
`;

export const MessageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  width: 100%;
`;

export const DeleteMessageButton = styled.button`
  display: grid;
  flex: 0 0 30px;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(11, 11, 13, 0.45);
  cursor: pointer;

  svg { width: 14px; height: 14px; }
  &:hover { color: #fff; background: rgba(160, 45, 45, 0.8); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const MessageBubble = styled.p`
  max-width: min(82%, 310px);
  margin: 0;
  padding: 12px 15px;
  color: #f4f4f6;
  border-radius: 16px 16px 4px 16px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const PinBubble = styled.div`
  display: grid;
  gap: 9px;
  width: min(78%, 255px);
  padding: 8px;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px 14px 4px 14px;
  background: rgba(255, 255, 255, 0.07);
  font-size: 11px;
`;

export const PinPreview = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1.55;
  object-fit: cover;
  border-radius: 9px;
`;

export const ComposerArea = styled.div`
  padding: 13px 16px max(16px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PinPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  > div { display: grid; flex: 1; min-width: 0; gap: 4px; }
`;

export const PinPickerImage = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 7px;
`;

export const PinPickerButton = styled.button`
  padding: 8px 10px;
  color: #f4f4f6;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`;

export const Composer = styled.form`
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 50px;
  padding: 5px 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.055);

  input {
    flex: 1;
    min-width: 0;
    color: #fff;
    border: 0;
    outline: 0;
    background: transparent;
    font: inherit;
    font-size: 13px;
  }
  input::placeholder { color: rgba(255, 255, 255, 0.42); }
`;

export const AttachButton = styled.button`
  display: grid;
  flex: 0 0 38px;
  place-items: center;
  width: 38px;
  height: 38px;
  color: rgba(255, 255, 255, 0.86);
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  svg { width: 18px; height: 18px; }
  &:hover { background: rgba(255, 255, 255, 0.18); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const SendButton = styled.button`
  display: grid;
  flex: 0 0 38px;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #f4f4f6;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  cursor: pointer;
  &:disabled { color: rgba(255, 255, 255, 0.36); background: rgba(255, 255, 255, 0.08); cursor: default; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  svg { width: 17px; height: 17px; }
`;