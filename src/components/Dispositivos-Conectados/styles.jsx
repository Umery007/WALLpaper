import styled from "styled-components";

export const Pagina = styled.main`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 28px 8px 44px;
  box-sizing: border-box;
  background-color: #08090b;
  background-size: cover;
  background-position: center;

  @media (max-width: 540px) { padding: 16px 8px 30px; }
`;

export const Painel = styled.section`
  width: min(100%, 760px);
  background: rgba(10, 11, 13, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(14px);
  overflow: hidden;
`;

export const TopBar = styled.header`
  position: relative;
  display: flex;
  min-height: 68px;
  align-items: center;
  justify-content: center;
  padding: 12px 70px;
  background: #fff;
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
  border: 1px solid rgba(20, 20, 20, 0.15);
  border-radius: 50%;
  color: #fff;
  background: rgba(20, 20, 20, 0.9);
  cursor: pointer;

  &:hover { background: #333; }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }

  @media (max-width: 540px) { left: 9px; width: 36px; height: 36px; }
`;

export const Titulo = styled.h1`
  margin: 0;
  color: #101113;
  font-family: "Inria Serif", "Roboto Slab", serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
`;

export const Conteudo = styled.div`
  width: min(92%, 1000px);
  margin: 0 auto;
  padding: 20px 0 28px;

  @media (max-width: 540px) { width: calc(100% - 28px); padding: 20px 0 28px; }
`;

export const Cabecalho = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 20px;
  color: #dfe5e2;
`;

export const IconeSeguranca = styled.div`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  color: #d5d9d6;
  background: rgba(255, 255, 255, 0.05);
`;

export const Subtitulo = styled.p`
  margin: 0;
  color: #d0d4d2;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const Resumo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #c7d0cb;
  font-size: 0.82rem;

  svg { color: #b4bfbb; }
`;

export const Mensagem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #dfe9e1;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.88rem;

  button {
    display: grid;
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    place-items: center;
    border: 0;
    border-radius: 6px;
    color: inherit;
    background: transparent;
    cursor: pointer;
  }

  button:hover { background: rgba(255, 255, 255, 0.08); }
`;

export const Lista = styled.div`
  display: grid;
  gap: 12px;
`;

export const Cartao = styled.article`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 18px 18px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    padding: 15px;
  }
`;

export const IconeDispositivo = styled.div`
  display: grid;
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid ${({ $ativo }) => ($ativo ? "rgba(163, 211, 174, 0.26)" : "rgba(255, 255, 255, 0.14)")};
  border-radius: 10px;
  color: ${({ $ativo }) => ($ativo ? "#bbd9c2" : "#d2d8d5")};
  background: ${({ $ativo }) => ($ativo ? "rgba(94, 151, 112, 0.12)" : "rgba(255, 255, 255, 0.04)")};
`;

export const Informacoes = styled.div`
  flex: 1 1 260px;
  min-width: 0;
`;

export const NomeLinha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const Nome = styled.h2`
  margin: 0;
  color: #f2f4f3;
  font-size: 1.02rem;
  font-weight: 600;
`;

export const SeloAtivo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid rgba(99, 190, 120, 0.25);
  border-radius: 999px;
  color: #b8e9be;
  background: rgba(67, 142, 88, 0.11);
  font-size: 0.72rem;
  font-weight: 600;
`;

export const PontoAtivo = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7ece8e;
  box-shadow: 0 0 8px rgba(126, 206, 142, 0.5);
`;

export const Detalhes = styled.p`
  margin: 5px 0 8px;
  color: #d0d7d3;
  font-size: 0.84rem;
`;

export const Metadados = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: #9aa4a0;
  font-size: 0.76rem;

  span { display: inline-flex; align-items: center; gap: 6px; }
  svg { flex: 0 0 auto; }
`;

export const BotaoDesconectar = styled.button`
  flex: 0 0 auto;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  color: #d9dfdb;
  background: rgba(255, 255, 255, 0.04);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease, background 160ms ease;

  &:hover { border-color: rgba(209, 160, 146, 0.5); color: #f0b7a7; background: rgba(164, 73, 58, 0.1); }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }

  @media (max-width: 640px) { margin-left: 60px; }
`;

export const BotaoAtual = styled.button`
  flex: 0 0 auto;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #9ba5a2;
  background: rgba(255, 255, 255, 0.02);
  font: inherit;
  font-size: 0.78rem;
  cursor: not-allowed;

  @media (max-width: 640px) { margin-left: 60px; }
`;

export const EstadoVazio = styled.p`
  margin: 0;
  padding: 26px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 9px;
  color: #b3bbb7;
  text-align: center;
`;

export const AreaSeguranca = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 22px;
  padding: 18px 0 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; gap: 14px; }
`;

export const SegurancaTexto = styled.div`
  min-width: 0;
`;

export const SegurancaTitulo = styled.h2`
  margin: 0;
  color: #edf0ee;
  font-size: 0.96rem;
  font-weight: 600;
`;

export const SegurancaDescricao = styled.p`
  margin: 5px 0 0;
  color: #a4aaa6;
  font-size: 0.82rem;
  line-height: 1.5;
`;

export const BotaoTodos = styled.button`
  flex: 0 0 auto;
  padding: 9px 13px;
  border: 1px solid rgba(206, 154, 134, 0.28);
  border-radius: 8px;
  color: #e2b19f;
  background: rgba(164, 73, 58, 0.08);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover:not(:disabled) { border-color: rgba(206, 154, 134, 0.48); background: rgba(164, 73, 58, 0.14); }
  &:focus-visible { outline: 2px solid #d8d8d8; outline-offset: 2px; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }

  @media (max-width: 640px) { width: 100%; }
`;

export const Confirmacao = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  color: #d6ddd9;
  font-size: 0.82rem;

  button {
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 6px;
    color: #e1e5e3;
    background: rgba(255, 255, 255, 0.05);
    font: inherit;
    cursor: pointer;
  }

  button:first-of-type { border-color: rgba(206, 154, 134, 0.35); color: #f1c1af; }
  button:hover { background: rgba(255, 255, 255, 0.09); }

  @media (max-width: 640px) { justify-content: flex-start; }
`;