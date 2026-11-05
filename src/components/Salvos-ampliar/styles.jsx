import styled from 'styled-components';

// ==========================================
// STYLED COMPONENTS
// ==========================================

export const GaleriaSalvos = styled.div`
  width: 100%;
  min-height: 520px;
  column-count: 8;
  column-gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  background: #202020;

  @media (max-width: 1100px) {
    column-count: 6;
  }

  @media (max-width: 800px) {
    column-count: 4;
  }

  @media (max-width: 520px) {
    column-count: 2;
    column-gap: 8px;
  }
`;

export const ItemSalvo = styled.div`
  cursor: pointer;
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  margin: 0 0 10px;
  overflow: hidden;
  border-radius: 4px;
  background: #111;
  animation: entradaCard 0.5s ease both;
  animation-delay: calc(var(--card-index, 0) * 35ms);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.45);
  }

  @keyframes entradaCard {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ImagemSalva = styled.img`
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: ${(props) => props.$proporcao || 1};
  object-fit: cover;
  border-radius: 4px;
  transform: ${(props) => (props.$invertida ? 'rotate(180deg)' : 'none')};
  transition: transform 0.3s ease;
`;

