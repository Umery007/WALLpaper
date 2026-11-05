import styled from "styled-components";

export const Pagina = styled.main`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 28px 8px 44px;
  box-sizing: border-box;
  background-color: #08090b;

  @media (max-width: 540px) { padding: 14px 8px 30px; }
`;

export const Painel = styled.section`
  width: min(100%, 1100px);
  min-height: 800px;
  align-self: flex-start;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.82);
  border-radius: 20px;
  background: rgba(10, 11, 13, 0.79);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(14px);

  @media (min-width: 1200px) {
    margin-bottom: -180px;
    transform: scale(0.82);
    transform-origin: top center;
  }
  @media (max-width: 700px) { min-height: auto; }
  @media (max-width: 540px) { border-width: 1px; border-radius: 15px; }
`;

export const TopBar = styled.header`
  position: relative;
  display: flex;
  min-height: 68px;
  align-items: center;
  justify-content: center;
  padding: 10px 70px;
  background: #fff;

  @media (max-width: 540px) { min-height: 54px; padding: 8px 50px; }
`;

export const Titulo = styled.h1`
  margin: 0;
  color: #101113;
  font-family: "Inria Serif", "Roboto Slab", serif;
  font-size: clamp(1.35rem, 4vw, 1.8rem);
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
`;

export const BotaoVoltar = styled.button`
  position: absolute;
  top: 50%;
  left: 16px;
  display: grid;
  width: 40px;
  height: 40px;
  transform: translateY(-50%);
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  background: rgba(20, 20, 20, 0.82);
  cursor: pointer;

  &:hover { background: #333; }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }
  @media (max-width: 540px) { left: 9px; width: 36px; height: 36px; }
`;

export const Conteudo = styled.div`
  width: min(92%, 1000px);
  margin: 0 auto;
  padding: 24px 0 28px;

  @media (max-width: 540px) { width: calc(100% - 28px); padding: 20px 0 28px; }
`;

export const Descricao = styled.p`
  margin: 0 0 18px;
  color: #d0d3d1;
  font-size: 1.08rem;
  line-height: 1.55;
  text-align: center;

  @media (max-width: 540px) { font-size: 0.98rem; }
`;

export const ResumoProtecao = styled.section`
  display: grid;
  grid-template-columns: 66px minmax(140px, 1fr) minmax(120px, 280px) auto;
  align-items: center;
  gap: 13px;
  margin-bottom: 15px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: linear-gradient(110deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025));

  @media (max-width: 540px) {
    grid-template-columns: 52px 1fr auto;
    gap: 12px;
    padding: 15px;
  }
`;

export const Progresso = styled.div`
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border-radius: 50%;
  color: #f0f0f0;
  background: conic-gradient(#e0e0e0 0deg 288deg, rgba(255, 255, 255, 0.13) 288deg 360deg);

  @media (max-width: 540px) { width: 48px; height: 48px; }
`;

export const ProgressoInterno = styled.div`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: #17181a;
  @media (max-width: 540px) { width: 40px; height: 40px; }
`;

export const ResumoTexto = styled.div``;

export const ResumoRotulo = styled.div`
  color: #aeb6b0;
  font-size: 0.88rem;
`;

export const ResumoValor = styled.div`
  margin-top: 2px;
  color: #f0f0f0;
  font-size: 1.12rem;
  font-weight: 650;
`;

export const BarraProgresso = styled.div`
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.13);
  @media (max-width: 540px) { grid-column: 2 / 4; grid-row: 2; }
`;

export const BarraPreenchida = styled.div`
  width: ${({ $completa }) => ($completa ? "100%" : "80%")};
  height: 100%;
  border-radius: inherit;
  background: #dedede;
  transition: width 240ms ease;
`;

export const Percentual = styled.span`
  color: #e2e2e2;
  font-size: 0.9rem;
  font-weight: 600;
`;

export const Aviso = styled.div`
  margin: 0 0 14px;
  padding: 13px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #e0e0e0;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.92rem;
  line-height: 1.5;
`;

export const Metodos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

export const Metodo = styled.section`
  display: flex;
  min-width: 0;
  gap: 13px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.055);
  ${({ $larguraTotal }) => $larguraTotal && "grid-column: 1 / -1;"}

  @media (max-width: 540px) { gap: 12px; padding: 16px; }
`;

export const IconeMetodo = styled.div`
  display: grid;
  flex: 0 0 auto;
  width: 50px;
  height: 50px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 9px;
  color: #d5ded8;
  background: rgba(255, 255, 255, 0.065);
`;

export const MetodoConteudo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MetodoTitulo = styled.h2`
  margin: 1px 0 6px;
  color: #f1f3f1;
  font-size: 1.08rem;
  font-weight: 650;
  line-height: 1.35;
`;

export const ValorMetodo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #d1d6d2;
  font-size: 0.96rem;
`;

export const SeloVerificado = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #e5e5e5;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.78rem;
  font-weight: 600;
`;

export const TextoMetodo = styled.p`
  margin: 6px 0 10px;
  color: #aab0ac;
  font-size: 0.9rem;
  line-height: 1.6;
`;

export const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const botaoBase = `
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 13px;
  border-radius: 7px;
  font: inherit;
  font-size: 0.86rem;
  line-height: 1.3;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const BotaoPrimario = styled.button`
  ${botaoBase}
  border: 1px solid #dedede;
  color: #101113;
  background: #dedede;
  &:hover:not(:disabled) { background: #fff; }
`;

export const BotaoSecundario = styled.button`
  ${botaoBase}
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #e3e6e4;
  background: rgba(255, 255, 255, 0.055);
  &:hover:not(:disabled) { border-color: rgba(255, 255, 255, 0.32); background: rgba(255, 255, 255, 0.1); }
`;

export const BotaoTexto = styled.button`
  padding: 7px 8px;
  border: 0;
  color: #b8c0ba;
  background: transparent;
  font: inherit;
  font-size: 0.76rem;
  cursor: pointer;
  &:hover { color: #fff; }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }
`;

export const Formulario = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
`;

export const Campo = styled.input`
  flex: 1 1 220px;
  min-width: 0;
  height: 40px;
  box-sizing: border-box;
  padding: 9px 11px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 7px;
  color: #f4f5f4;
  background: rgba(0, 0, 0, 0.24);
  font: inherit;
  font-size: 0.9rem;
  &:focus { border-color: #d8d8d8; outline: 2px solid rgba(255, 255, 255, 0.18); }
  &::placeholder { color: #939b95; }
`;

export const Confirmacao = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  color: #d2d7d3;
  font-size: 0.86rem;
`;

export const Recomendacoes = styled.section`
  margin-top: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
`;

export const RecomendacoesCabecalho = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconeRecomendacoes = styled.span`
  display: grid;
  color: #d7d7d7;
`;

export const RecomendacoesTitulo = styled.h2`
  margin: 0;
  color: #f0f0f0;
  font-size: 1rem;
  font-weight: 650;
`;

export const ListaRecomendacoes = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 14px;
  margin: 10px 0 0;
  padding-left: 18px;
  color: #c7c7c7;
  font-size: 0.88rem;
  line-height: 1.55;

  li::marker { color: #bcbcbc; }
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 6px; }
`;

export const BotaoVerificar = styled.button`
  display: flex;
  width: 100%;
  min-height: 45px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;
  color: #f0f2f0;
  background: rgba(255, 255, 255, 0.075);
  font: inherit;
  font-size: 0.94rem;
  font-weight: 550;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover { background: rgba(255, 255, 255, 0.13); }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }
`;