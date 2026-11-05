import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;

  padding: 30px 20px 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;

  background:
    radial-gradient(
      circle at top,
      rgba(255, 255, 255, 0.08),
      transparent 35%
    ),
    linear-gradient(180deg, #050507 0%, #0d0d12 100%);

  @media (max-width: 480px) {
    padding: 16px 8px 40px;
    min-height: auto;
  }
`;

export const Card = styled.div`
  position: relative;

  width: min(85vw, 800px);

  background: rgba(255, 255, 255, 0.09);

  border: 3px solid #ffffff;
  border-radius: 22px;

  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 100%;
    border-radius: 16px;
  }
`;

export const TopBar = styled.div`
  position: relative;

  width: 100%;
  height: 70px;

  background: #ffffff;

  border-radius: 22px 22px 0 0;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    height: 48px;
    border-radius: 16px 16px 0 0;
  }
`;

export const TopTitle = styled.h1`
  margin: 0;

  font-family: "Inria Serif", serif;
  font-style: normal;
  font-weight: 700;

  font-size: 2.5rem;
  line-height: 1;

  color: #000000;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;

  top: 50%;
  right: 24px;

  transform: translateY(-50%);

  width: 44px;
  height: 44px;

  background: rgba(20, 20, 20, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  color: #ffffff;

  cursor: pointer;
  padding: 0;

  display: grid;
  place-items: center;

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.05);
    background: rgba(45, 45, 45, 0.9);
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    right: 12px;
  }
`;

export const CloseIcon = styled.span`
  position: relative;

  width: 30px;
  height: 30px;

  display: block;

  &::before,
  &::after {
    content: "";

    position: absolute;

    width: 4px;
    height: 30px;

    background: #000000;

    border-radius: 12px;

    left: 50%;
    top: 50%;

    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;

    &::before,
    &::after {
      width: 3px;
      height: 24px;
    }
  }
`;

export const Group219 = styled.div`
  width: 88%;

  margin: 35px auto 0;

  padding-bottom: 35px;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    width: 95%;
    margin: 16px auto 0;
    padding-bottom: 20px;
  }
`;

export const Group218 = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 18px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const PasswordInfo = styled.p`
  width: 100%;

  margin: 0 0 2px;

  text-align: center;

  font-family: "Inria Serif", serif;
  font-style: normal;
  font-weight: 700;

  font-size: 20px;
  line-height: 1.3;

  color: #fffbfb;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const baseLabel = `
  display: block;

  font-family: "Inria Serif", serif;
  font-style: normal;
  font-weight: 700;

  font-size: 1.8rem;
  line-height: 1.2;

  color: #ffffff;

  margin-bottom: 10px;
`;

export const LabelNome = styled.span`
  ${baseLabel}

  width: 100%;
`;

export const NomeInput = styled.input`
  width: 100%;
  height: 60px;

  box-sizing: border-box;

  background: rgba(255, 248, 248, 0.2);

  border: 2px solid #ffffff;
  border-radius: 15px;

  padding: 12px 16px;

  color: #ffffff;

  font-family: "Inria Serif", serif;
  font-weight: 700;

  font-size: 1.2rem;
  line-height: 1.2;

  outline: none;

  backdrop-filter: blur(16px);

  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255, 255, 255, 0.9);

    background: rgba(255, 248, 248, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.75);

    font-family: "Inria Serif", serif;
    font-weight: 700;

    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    height: 44px;

    border-radius: 12px;

    padding: 12px;

    font-size: 0.9rem;
  }
`;

export const LabelEmail = styled.span`
  ${baseLabel}

  width: 100%;
`;

export const EmailInput = styled.input`
  width: 100%;
  height: 60px;

  box-sizing: border-box;

  background: rgba(255, 248, 248, 0.2);

  border: 2px solid #ffffff;
  border-radius: 15px;

  padding: 12px 16px;

  color: #ffffff;

  font-family: "Inria Serif", serif;
  font-weight: 700;

  font-size: 1.2rem;
  line-height: 1.2;

  outline: none;

  backdrop-filter: blur(16px);

  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255, 255, 255, 0.9);

    background: rgba(255, 248, 248, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.75);

    font-family: "Inria Serif", serif;
    font-weight: 700;

    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    height: 44px;

    border-radius: 12px;

    padding: 12px;

    font-size: 0.9rem;
  }
`;

export const LabelSenha = styled.span`
  ${baseLabel}

  width: 100%;
`;

export const SenhaInput = styled.input`
  width: 100%;
  height: 60px;

  box-sizing: border-box;

  background: rgba(255, 255, 255, 0.1);

  border: 2px solid #ffffff;
  border-radius: 15px;

  padding: 12px 16px;

  color: #ffffff;

  font-family: "Inria Serif", serif;
  font-weight: 700;

  font-size: 1.2rem;
  line-height: 1.2;

  outline: none;

  backdrop-filter: blur(16px);

  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255, 255, 255, 0.9);

    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.75);

    font-family: "Inria Serif", serif;
    font-weight: 700;

    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    height: 44px;

    border-radius: 12px;

    padding: 12px;

    font-size: 0.9rem;
  }
`;

export const ButtonRect = styled.div`
  width: min(55%, 350px);

  min-height: 55px;

  margin-top: 20px;

  background: #ffffff;

  border: 2px solid #ffffff;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);

    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;

    min-height: 44px;

    border-radius: 12px;
  }
`;

export const ButtonText = styled.span`
  font-family: "Inria Serif", serif;

  font-style: normal;
  font-weight: 700;

  font-size: 1.5rem;

  line-height: 1;

  color: #000000;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;