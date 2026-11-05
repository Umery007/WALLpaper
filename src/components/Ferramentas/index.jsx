import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tema from "../Tema";
import useAuth from "../../contexts/useAuth";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  CardsContainer,
  Card,
  CardTitle,
  CardContent,
  ToolButton,
} from "./styles";

export function Ferramentas({ onClose, isVip = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isTemaOpen, setIsTemaOpen] = useState(false);
  const overlayRef = useRef(null);

  // Esc fecha o modal (ou volta do Tema para as ferramentas).
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      if (isTemaOpen) setIsTemaOpen(false);
      else onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isTemaOpen, onClose]);

  // Enquanto o modal esta aberto, a pagina atras nao rola junto.
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = anterior; };
  }, []);

  /** Fecha ao clicar no fundo, mas nao ao clicar dentro do modal. */
  function handleOverlayClick(event) {
    if (event.target === overlayRef.current) onClose();
  }

  function handleCreateAccount() {
    onClose();
    navigate("/criar-conta");
  }

  function handleAlterarSenha() {
    onClose();
    navigate("/alterar-senha");
  }

  function handleCadastrar() {
    onClose();
    navigate("/cadastro");
  }

  function handleLogout() {
    logout();
    onClose();
  }

  function handlePerfil() {
    onClose();
    navigate("/perfil");
  }

  function handleBaixados() {
    onClose();
    navigate("/baixados");
  }

  function handleFavoritados() {
    onClose();
    navigate("/favoritados");
  }

  function handleComunidades() {
    onClose();
    navigate("/comunidade");
  }

  function handleDispositivosConectados() {
    onClose();
    navigate("/dispositivos-conectados");
  }

  function handleRecuperacaoConta() {
    onClose();
    navigate("/recuperacao-conta");
  }

  function handleAutenticacaoDoisFatores() {
    onClose();
    navigate("/autenticacao-dois-fatores");
  }

  function handleUpdateVip() {
    onClose();
    navigate("/planos");
  }

  function handleComprarCreditos() {
    onClose();
    navigate("/credito");
  }

  function handleUpgradeFromTema() {
    setIsTemaOpen(false);
    handleUpdateVip();
  }

  return (
    <Overlay ref={overlayRef} onMouseDown={handleOverlayClick}>
      <Modal>

        <CloseButton type="button" onClick={onClose} aria-label="Fechar ferramentas">
          ×
        </CloseButton>

        <Header>
          <Title>Ferramentas do Usuário</Title>
        </Header>

        <CardsContainer>

          {/* CONTA */}
          <Card>
            <CardTitle>Conta</CardTitle>

            <CardContent>
              <ToolButton onClick={handleCadastrar}>
                {user ? "Entrar com outra conta" : "Entrar"}
              </ToolButton>

              <ToolButton onClick={handleLogout} disabled={!user}>
                Sair da conta
              </ToolButton>

              <ToolButton onClick={handleCreateAccount}>
                {user ? "Adicionar conta" : "Criar conta"}
              </ToolButton>

              <ToolButton onClick={handlePerfil}>
                Perfil
              </ToolButton>
            </CardContent>
          </Card>


          {/* WALLPAPERS */}
          <Card>
            <CardTitle>Wallpapers</CardTitle>

            <CardContent>
              <ToolButton onClick={handleBaixados}>
                Baixados
              </ToolButton>

              <ToolButton onClick={handleFavoritados}>
                Favoritos
              </ToolButton>

              <ToolButton onClick={handleComunidades}>
                Explorar Comunidades
              </ToolButton>

              <ToolButton onClick={handleAlterarSenha}>
                Alterar senha 
              </ToolButton>
            </CardContent>
          </Card>


          {/* SEGURANÇA */}
          <Card>
            <CardTitle>Segurança</CardTitle>

            <CardContent>
              <ToolButton onClick={handleDispositivosConectados}>
                Dispositivos Conectados
              </ToolButton>

              <ToolButton onClick={handleRecuperacaoConta}>
                Recuperação da conta
              </ToolButton>

              <ToolButton onClick={handleAutenticacaoDoisFatores}>
                Autenticação de dois fatores
              </ToolButton>
            </CardContent>
          </Card>


          {/* PREMIUM */}
          <Card>
            <CardTitle>Premium</CardTitle>

            <CardContent>
              <ToolButton onClick={handleUpdateVip}>
                Botão de Update
              </ToolButton>

              <ToolButton onClick={handleComprarCreditos}>
                Comprar Créditos Avulsos
              </ToolButton>

              <ToolButton type="button" onClick={() => setIsTemaOpen(true)}>
                Personalizar Tema (VIP)
              </ToolButton>
            </CardContent>
          </Card>

        </CardsContainer>

      </Modal>

      {isTemaOpen && (
        <Tema
          isVip={isVip}
          onClose={() => setIsTemaOpen(false)}
          onUpgrade={handleUpgradeFromTema}
        />
      )}
    </Overlay>
  );
}