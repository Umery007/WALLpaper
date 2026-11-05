import styled from 'styled-components';

export const GaleriaSalvos = styled.div`
  width: 100%;
  min-height: 520px;
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
  box-sizing: border-box;
  background: #18181c;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 14px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ItemSalvo = styled.div`
  position: relative;
  cursor: pointer;
  min-width: 0;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: #000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  animation: entradaCard 0.45s ease both;
  animation-delay: calc(var(--card-index, 0) * 25ms);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);

    img {
      transform: scale(1.08);
    }
  }

  @keyframes entradaCard {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;

    img {
      transition: none;
    }
  }
`;

export const ImagemSalva = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.35s ease;
`;

export const BotaoCurtir = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: ${(props) => (props.$curtido ? 'var(--primary-color-accent)' : '#fff')};
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease, color 0.2s ease;

  ${(props) => props.$curtido && `
    animation: pulsoCoracao 0.35s ease;

    @keyframes pulsoCoracao {
      0% { transform: scale(1); }
      50% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  `}

  svg {
    fill: ${(props) => (props.$curtido ? 'var(--primary-color-accent)' : 'none')};
  }

  &:hover {
    transform: scale(1.12);
  }

  &:active {
    transform: scale(0.9);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;
