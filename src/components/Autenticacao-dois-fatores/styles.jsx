import styled from "styled-components";

export const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: 30px 20px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 35%),
    linear-gradient(180deg, #050507 0%, #0d0d12 100%);

  @media (max-width: 600px) { padding: 16px 8px 32px; min-height: auto; }
`;

export const Card = styled.section`
  position: relative;
  width: min(94vw, 1100px);
  border: 3px solid #fff;
  border-radius: 22px;
  background: rgba(10, 10, 12, 0.92);
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: 1200px) {
    margin-bottom: -170px;
    transform: scale(0.82);
    transform-origin: top center;
  }
  @media (max-width: 600px) { width: 100%; border-width: 1px; border-radius: 16px; }
`;

export const TopBar = styled.header`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  padding: 8px 72px;
  background: #fff;

  @media (max-width: 600px) { min-height: 54px; padding: 8px 50px; }
`;

export const Title = styled.h1`
  margin: 0;
  color: #000;
  font-family: "Inria Serif", serif;
  font-size: clamp(1.45rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  left: 18px;
  display: grid;
  width: 44px;
  height: 44px;
  transform: translateY(-50%);
  place-items: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  color: #fff;
  background: rgba(20, 20, 20, 0.78);
  cursor: pointer;

  &:hover { background: #333; }
  &:focus-visible { outline: 2px solid #222; outline-offset: 2px; }
  @media (max-width: 600px) { left: 9px; width: 36px; height: 36px; }
`;

export const Content = styled.div`
  width: min(92%, 1000px);
  margin: 0 auto;
  padding: 20px 0 24px;

  @media (max-width: 600px) { width: calc(100% - 28px); padding: 20px 0 24px; }
`;

export const Description = styled.p`
  margin: 0 0 14px;
  color: #e4e4e4;
  font-size: 1rem;
  line-height: 1.55;
  text-align: center;
`;

export const StatusCard = styled.section`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 16px;
  padding: 13px 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.58);

  @media (max-width: 650px) { flex-wrap: wrap; gap: 12px; padding: 15px; }
`;

export const StatusIcon = styled.div`
  display: grid;
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#fff" : "#aaa")};
  background: rgba(255, 255, 255, ${({ $active }) => ($active ? "0.12" : "0.04")});
`;

export const StatusText = styled.div`
  flex: 1 1 300px;
  min-width: 0;
`;

export const StatusTitle = styled.h2`
  margin: 0 0 4px;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 650;
`;

export const StatusDescription = styled.p`
  margin: 0;
  color: #c1c1c1;
  font-size: 0.86rem;
  line-height: 1.5;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  border-radius: 999px;
  color: #f0f0f0;
  background: rgba(255, 255, 255, 0.075);
  font-size: 0.8rem;
  font-weight: 600;

  @media (max-width: 650px) { margin-left: 60px; }
`;

export const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#f1f1f1" : "#777")};
`;

export const ReativarButton = styled.button`
  min-height: 36px;
  padding: 8px 11px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 7px;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.15); }
`;

export const Notice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -10px 0 20px;
  padding: 11px 13px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  color: #e4e4e4;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.83rem;
  line-height: 1.5;

  button { display: grid; flex: 0 0 auto; width: 28px; height: 28px; place-items: center; border: 0; border-radius: 5px; color: inherit; background: transparent; cursor: pointer; }
  button:hover { background: rgba(255, 255, 255, 0.1); }
`;

export const SectionTitle = styled.h2`
  margin: 16px 0 8px;
  color: #fff;
  font-family: "Inria Serif", serif;
  font-size: 1.35rem;
  font-weight: 700;
`;

export const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

export const MethodCard = styled.section`
  display: flex;
  min-width: 0;
  gap: 13px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.58);
  ${({ $wide }) => $wide && "grid-column: 1 / -1;"}

  @media (max-width: 500px) { gap: 10px; padding: 13px; }
`;

export const MethodIcon = styled.div`
  display: grid;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 9px;
  color: #e9e9e9;
  background: rgba(255, 255, 255, 0.07);
`;

export const MethodContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MethodHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 10px;
`;

export const MethodTitle = styled.h3`
  margin: 1px 0 0;
  color: #fff;
  font-size: 0.98rem;
  font-weight: 650;
  line-height: 1.4;
`;

export const Configured = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #e5e5e5;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.7rem;
  font-weight: 600;
`;

export const MethodDescription = styled.p`
  margin: 5px 0 8px;
  color: #c4c4c4;
  font-size: 0.83rem;
  line-height: 1.5;
`;

export const PhoneNumber = styled.div`
  margin-top: 5px;
  color: #e2e2e2;
  font-size: 0.84rem;
`;

const buttonBase = `
  display: inline-flex;
  min-height: 35px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 7px;
  font: inherit;
  font-size: 0.77rem;
  line-height: 1.3;
  cursor: pointer;
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  border: 1px solid #fff;
  color: #101113;
  background: #fff;
  &:hover:not(:disabled) { background: #dedede; }
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #eee;
  background: rgba(255, 255, 255, 0.055);
  &:hover:not(:disabled) { border-color: rgba(255, 255, 255, 0.38); background: rgba(255, 255, 255, 0.11); }
`;

export const TextButton = styled.button`
  padding: 7px 8px;
  border: 0;
  color: #c8c8c8;
  background: transparent;
  font: inherit;
  font-size: 0.77rem;
  cursor: pointer;
  &:hover { color: #fff; }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
`;

export const PhoneForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
`;

export const PhoneInput = styled.input`
  flex: 1 1 170px;
  min-width: 0;
  height: 35px;
  box-sizing: border-box;
  padding: 7px 9px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 7px;
  color: #fff;
  background: rgba(0, 0, 0, 0.25);
  font: inherit;
  font-size: 0.8rem;
  &:focus { border-color: #fff; outline: 2px solid rgba(255, 255, 255, 0.16); }
  &::placeholder { color: #999; }
`;

export const CodeList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(80px, 1fr));
  gap: 7px;
  margin-top: 12px;

  code { padding: 8px 6px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; color: #f1f1f1; background: rgba(255, 255, 255, 0.045); font-size: 0.8rem; text-align: center; }
  @media (max-width: 500px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const Confirmation = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  color: #ddd;
  font-size: 0.78rem;
`;

export const LoginSettings = styled.section`
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.56);
`;

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 11px 15px;
  & + & { border-top: 1px solid rgba(255, 255, 255, 0.1); }
  @media (max-width: 500px) { align-items: flex-start; gap: 12px; padding: 13px; }
`;

export const SettingCopy = styled.div`
  min-width: 0;
`;

export const SettingTitle = styled.h3`
  margin: 0;
  color: #f5f5f5;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const SettingDescription = styled.p`
  margin: 4px 0 0;
  color: #bcbcbc;
  font-size: 0.8rem;
  line-height: 1.5;
`;

export const Switch = styled.button`
  display: flex;
  flex: 0 0 auto;
  width: 46px;
  height: 26px;
  align-items: center;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.23);
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "#e5e5e5" : "#383838")};
  cursor: pointer;
  transition: background 150ms ease;
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const SwitchKnob = styled.span`
  width: 18px;
  height: 18px;
  transform: translateX(${({ $checked }) => ($checked ? "20px" : "0")});
  border-radius: 50%;
  background: ${({ $checked }) => ($checked ? "#171717" : "#eee")};
  transition: transform 150ms ease;
`;

export const Recommendations = styled.section`
  margin-top: 14px;
  padding: 13px 15px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
`;

export const RecommendationsTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #f2f2f2;
  font-size: 0.96rem;
  font-weight: 650;
`;

export const RecommendationList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 14px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;

  li { display: flex; align-items: flex-start; gap: 8px; color: #ccc; font-size: 0.8rem; line-height: 1.5; }
  li svg { flex: 0 0 auto; margin-top: 1px; color: #ddd; }
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 8px; }
`;

export const DangerArea = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  padding: 13px 15px;
  border: 1px solid rgba(188, 125, 119, 0.34);
  border-radius: 10px;
  background: rgba(105, 46, 42, 0.12);
  @media (max-width: 600px) { align-items: flex-start; flex-direction: column; padding: 14px; }
`;

export const DangerCopy = styled.div`
  min-width: 0;
`;

export const DangerTitle = styled.h2`
  margin: 0;
  color: #f0e7e6;
  font-size: 0.92rem;
  font-weight: 650;
`;

export const DangerDescription = styled.p`
  margin: 5px 0 0;
  color: #c9b9b7;
  font-size: 0.8rem;
  line-height: 1.5;
`;

export const DangerButton = styled.button`
  display: inline-flex;
  min-height: 37px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: 1px solid rgba(212, 147, 139, 0.55);
  border-radius: 7px;
  color: #f0c3bd;
  background: rgba(105, 46, 42, 0.25);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover:not(:disabled) { background: rgba(142, 60, 52, 0.38); }
  &:focus-visible { outline: 2px solid #f0c3bd; outline-offset: 2px; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;