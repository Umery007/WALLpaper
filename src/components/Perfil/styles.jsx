import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #1e1e1e;
  color: #ffffff;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
`;

export const SecaoBanner = styled.div`
  position: relative;
  width: 100%;
  height: 230px;
  background-color: #000000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImagemBanner = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 38%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
  opacity: 0.8;
  filter: brightness(0.75) contrast(1.05);
`;

export const BannerPadrao = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(14, 13, 13, 0.4), rgba(17, 16, 15, 0.4), rgba(0, 0, 0, 0.8));
  opacity: 0.8;
`;

export const BotaoVoltar = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export const CartaoPerfil = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 650px;
  margin: 0 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

/* Virou botao: clicar na bolinha troca a foto de perfil. */
export const ContainerAvatar = styled.button`
  position: relative;
  width: 6rem;
  height: 6rem;
  padding: 0;
  border-radius: 9999px;
  background-color: #ffffff;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;

  &:hover .sobreposicao-avatar,
  &:focus-visible .sobreposicao-avatar {
    opacity: 1;
  }

  &:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  &:disabled { cursor: progress; }
`;

/* Aparece sobre a foto no hover, avisando que da para trocar. */
export const SobreposicaoAvatar = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0;
  transition: opacity 0.18s ease;
`;

/* Numeros de seguidores logo abaixo do nome. */
export const LinhaSeguidores = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
  flex-wrap: wrap;
`;

export const ContadorSeguidores = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.85rem;
  cursor: ${({ $clicavel }) => ($clicavel ? 'pointer' : 'default')};

  strong { color: #fff; font-weight: 700; }
  &:hover { color: ${({ $clicavel }) => ($clicavel ? '#fff' : 'rgba(255,255,255,0.82)')}; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; border-radius: 4px; }
`;

export const ImagemAvatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DetalhesUsuario = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CabecalhoUsuario = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const NomeUsuario = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SeloPremium = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 9px;
  padding: 3px 8px;
  border: 1px solid rgba(245, 199, 89, 0.45);
  border-radius: 999px;
  background: rgba(245, 199, 89, 0.12);
  color: #f5d27a;
  font-size: 0.65rem;
  font-weight: 700;
  vertical-align: middle;
`;

export const VerificacaoEmail = styled.div`
  display: grid;
  justify-items: start;
  gap: 6px;
  margin-top: 10px;
  color: #ffd48a;
  font-size: 0.75rem;

  button {
    padding: 5px 9px;
    border: 1px solid rgba(255, 212, 138, 0.35);
    border-radius: 8px;
    background: rgba(255, 212, 138, 0.1);
    color: inherit;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  small {
    color: #fff;
  }
`;

export const NomeUsuarioHandle = styled.p`
  margin: 0.2rem 0 0;
  color: #c4c6d0;
  font-size: 0.85rem;
`;

export const BotaoEditar = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const BioUsuario = styled.p`
  font-size: 0.75rem;
  color: #d1d5db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1rem;
`;

export const VisualizacoesPerfil = styled.p`
  margin: 0;
  color: #aaa4ff;
  font-size: 0.78rem;
`;

export const AvisoPerfil = styled.p`
  margin: 0.2rem 0 0;
  color: #a9abb7;
  font-size: 0.78rem;
  line-height: 1.45;
`;

export const ContainerEstatisticas = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CaixaEstatistica = styled.div``;

export const RotuloEstatistica = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const ValorEstatistica = styled.div`
  font-size: 0.875rem;
  font-weight: 1000;
`;

export const BarraNavegacao = styled.div`
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  background-color: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 0.5rem;
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

export const ContainerAbas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  grid-column: 2;

  @media (max-width: 640px) {
    grid-column: 1;
  }
`;

export const TituloPasta = styled.h2`
  grid-column: 2;
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;

  @media (max-width: 640px) {
    grid-column: 1;
  }
`;

export const BotaoAba = styled.button`
  padding: 0.375rem 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => (props.$ativo ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)')};
  background-color: ${(props) => (props.$ativo ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)')};
  color: ${(props) => (props.$ativo ? '#ffffff' : '#d1d5db')};
  font-weight: ${(props) => (props.$ativo ? '500' : 'normal')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const ContainerAcoes = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  grid-column: 3;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    grid-column: 1;
  }
`;

export const BotaoCriarPasta = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.875rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const BotaoIcone = styled.button`
  padding: 0.375rem;
  border-radius: 0.375rem;
  background-color: ${(props) => (props.$ativo ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)')};
  border: 1px solid ${(props) => (props.$ativo ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)')};
  color: ${(props) => (props.$ativo ? '#ffffff' : '#d1d5db')};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const AreaConteudo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 3.125rem 2rem 2rem;
  box-sizing: border-box;
`;

export const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(4, 6, 10, 0.78);
  backdrop-filter: blur(12px);
`;

export const Dialog = styled.section`
  width: min(100%, 540px);
  max-height: min(90vh, 760px);
  overflow-y: auto;
  padding: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.25rem;
  background:
    radial-gradient(ellipse at top right, rgba(105, 82, 144, 0.2), transparent 50%),
    linear-gradient(145deg, #202127, #111216 75%);
  color: #f8fafc;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

export const DialogCabecalho = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const DialogRotulo = styled.p`
  margin: 0 0 0.4rem;
  color: #aaa4ff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
`;

export const DialogTitulo = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 650;
`;

export const DialogFechar = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
  }
`;

export const DialogDescricao = styled.p`
  margin: 0 0 1.5rem;
  color: #c4c6d0;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export const FormularioPasta = styled.form`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  label {
    margin-top: 0.4rem;
    color: #d6d7df;
    font-size: 0.84rem;
    font-weight: 550;
  }

  input:not([type='file']),
  select,
  input[type='file'] {
    width: 100%;
    min-width: 0;
    padding: 0.75rem 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.65rem;
    background-color: #17181e;
    color: #f5f5f7;
    color-scheme: dark;
    font: inherit;
    box-sizing: border-box;
  }

  input[type='file'] {
    padding: 0.55rem;
    color: #bfc1cb;
    cursor: pointer;
  }

  input[type='file']::file-selector-button,
  input[type='file']::-webkit-file-upload-button {
    margin-right: 0.8rem;
    padding: 0.55rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.45rem;
    background: #30313a;
    color: #f5f5f7;
    font: inherit;
    cursor: pointer;
  }

  input[type='file']::file-selector-button:hover {
    background: #41424e;
  }

  input:focus-visible,
  select:focus-visible {
    outline: 2px solid #aaa4ff;
    outline-offset: 2px;
  }
`;

export const FormularioPerfil = styled.form`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  label {
    margin-top: 0.4rem;
    color: #d6d7df;
    font-size: 0.84rem;
    font-weight: 550;
  }

  input,
  select {
    width: 100%;
    min-width: 0;
    padding: 0.75rem 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.65rem;
    background-color: #17181e;
    color: #f5f5f7;
    color-scheme: dark;
    font: inherit;
    box-sizing: border-box;
  }

  input:focus-visible,
  select:focus-visible {
    outline: 2px solid #aaa4ff;
    outline-offset: 2px;
  }
`;

export const PreviewCapa = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.75rem;
`;

export const ErroDialog = styled.p`
  margin: 0.35rem 0 0;
  color: #ffaaa4;
  font-size: 0.85rem;
  line-height: 1.45;
`;

export const AcoesFormulario = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 0.75rem;

  @media (max-width: 420px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

export const BotaoCancelar = styled.button`
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.05);
  color: #dedfe5;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BotaoSalvarPerfil = styled.button`
  padding: 0.7rem 1rem;
  border: 1px solid rgba(170, 164, 255, 0.4);
  border-radius: 0.65rem;
  background: rgba(128, 112, 230, 0.28);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(128, 112, 230, 0.42);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BotaoExcluirConfirmacao = styled.button`
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 106, 106, 0.36);
  border-radius: 0.65rem;
  background: rgba(190, 47, 57, 0.18);
  color: #ffaaa4;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(190, 47, 57, 0.32);
  }
`;

export const CaixaVazia = styled.div`
  width: 100%;
  max-width: 56rem;
  height: 20rem;
  background-color: #141414;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const ConteudoVazio = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  max-width: 32rem;
  padding: 1rem;
`;

export const TextoVazio = styled.p`
  margin: 0;
  color: #f3f4f6;
  font-size: 1.305rem;
  line-height: 1.5;
  text-align: center;
`;

export const BotaoCriar = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
