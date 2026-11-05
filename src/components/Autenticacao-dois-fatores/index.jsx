import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Download,
  KeyRound,
  LockKeyhole,
  Monitor,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import fundo from "../../assets/fundo/fundo.png";
import * as S from "./styles";

function gerarCodigosReserva() {
  const valores = new Uint32Array(8);
  window.crypto.getRandomValues(valores);
  return Array.from(valores, (valor) => {
    const primeiro = String(valor % 10000).padStart(4, "0");
    const segundo = String(Math.floor(valor / 10000) % 10000).padStart(4, "0");
    return `${primeiro}-${segundo}`;
  });
}

export default function AutenticacaoDoisFatores() {
  const navigate = useNavigate();
  const [ativada, setAtivada] = useState(true);
  const [confiarNesteDispositivo, setConfiarNesteDispositivo] = useState(false);
  const [solicitarNovosDispositivos, setSolicitarNovosDispositivos] = useState(true);
  const [telefone, setTelefone] = useState("(**) *****-1234");
  const [editarTelefone, setEditarTelefone] = useState(false);
  const [novoTelefone, setNovoTelefone] = useState("");
  const [codigos, setCodigos] = useState(gerarCodigosReserva);
  const [mostrarCodigos, setMostrarCodigos] = useState(false);
  const [confirmarGeracao, setConfirmarGeracao] = useState(false);
  const [confirmarDesativacao, setConfirmarDesativacao] = useState(false);
  const [aviso, setAviso] = useState("");

  function salvarTelefone(event) {
    event.preventDefault();
    const numeros = novoTelefone.replace(/\D/g, "");
    if (numeros.length < 6) return;
    setTelefone(`(**) *****-${numeros.slice(-4)}`);
    setNovoTelefone("");
    setEditarTelefone(false);
    setAviso("Número atualizado. Confirme-o para continuar recebendo códigos por SMS.");
  }

  function baixarCodigos() {
    const arquivo = new Blob([`Códigos de reserva\n\n${codigos.join("\n")}\n`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "codigos-de-reserva-2fa.txt";
    link.click();
    URL.revokeObjectURL(url);
    setAviso("Download dos códigos iniciado. Guarde-os em um local seguro.");
  }

  function confirmarNovosCodigos() {
    setCodigos(gerarCodigosReserva());
    setMostrarCodigos(true);
    setConfirmarGeracao(false);
    setAviso("Novos códigos gerados. Os códigos anteriores foram substituídos.");
  }

  function confirmarDesativar() {
    setAtivada(false);
    setConfirmarDesativacao(false);
    setAviso("A autenticação de dois fatores foi desativada.");
  }

  return (
    <S.Wrapper
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <S.Card>
        <S.TopBar>
          <S.Title>Autenticação de dois fatores</S.Title>
          <S.CloseButton type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} strokeWidth={1.8} />
          </S.CloseButton>
        </S.TopBar>

        <S.Content>
          <S.Description>
            Adicione uma camada extra de segurança à sua conta solicitando uma segunda forma de verificação ao entrar.
          </S.Description>

          <S.StatusCard $active={ativada}>
            <S.StatusIcon $active={ativada}><ShieldCheck size={25} /></S.StatusIcon>
            <S.StatusText>
              <S.StatusTitle>Proteção adicional</S.StatusTitle>
              <S.StatusDescription>
                Quando ativada, será necessário confirmar sua identidade usando um segundo método de autenticação.
              </S.StatusDescription>
            </S.StatusText>
            <S.StatusBadge $active={ativada}>
              <S.StatusDot $active={ativada} />
              {ativada ? "Ativada" : "Desativada"}
            </S.StatusBadge>
            {!ativada && (
              <S.ReativarButton type="button" onClick={() => setAtivada(true)}>Ativar proteção</S.ReativarButton>
            )}
          </S.StatusCard>

          {aviso && (
            <S.Notice role="status">
              <span>{aviso}</span>
              <button type="button" aria-label="Fechar aviso" onClick={() => setAviso("")}><X size={17} /></button>
            </S.Notice>
          )}

          <S.SectionTitle>Métodos de autenticação</S.SectionTitle>
          <S.MethodGrid>
            <S.MethodCard>
              <S.MethodIcon><Shield size={22} /></S.MethodIcon>
              <S.MethodContent>
                <S.MethodHeading>
                  <S.MethodTitle>Aplicativo autenticador</S.MethodTitle>
                  <S.Configured><Check size={13} /> Configurado</S.Configured>
                </S.MethodHeading>
                <S.MethodDescription>Use um aplicativo autenticador para gerar códigos temporários de segurança.</S.MethodDescription>
                <S.SecondaryButton
                  type="button"
                  onClick={() => setAviso("Seu aplicativo autenticador está configurado para esta conta.")}
                  disabled={!ativada}
                >
                  Gerenciar
                </S.SecondaryButton>
              </S.MethodContent>
            </S.MethodCard>

            <S.MethodCard>
              <S.MethodIcon><Phone size={22} /></S.MethodIcon>
              <S.MethodContent>
                <S.MethodHeading>
                  <S.MethodTitle>Código por SMS</S.MethodTitle>
                  <S.Configured><Check size={13} /> Configurado</S.Configured>
                </S.MethodHeading>
                <S.PhoneNumber>{telefone}</S.PhoneNumber>
                <S.MethodDescription>Receba um código de verificação no telefone cadastrado.</S.MethodDescription>
                {editarTelefone ? (
                  <S.PhoneForm onSubmit={salvarTelefone}>
                    <S.PhoneInput
                      autoFocus
                      type="tel"
                      aria-label="Novo número de telefone"
                      placeholder="Digite o novo número"
                      value={novoTelefone}
                      onChange={(event) => setNovoTelefone(event.target.value)}
                      required
                    />
                    <S.PrimaryButton type="submit">Salvar número</S.PrimaryButton>
                    <S.TextButton type="button" onClick={() => setEditarTelefone(false)}>Cancelar</S.TextButton>
                  </S.PhoneForm>
                ) : (
                  <S.SecondaryButton type="button" onClick={() => setEditarTelefone(true)} disabled={!ativada}>Alterar número</S.SecondaryButton>
                )}
              </S.MethodContent>
            </S.MethodCard>

            <S.MethodCard $wide>
              <S.MethodIcon><KeyRound size={22} /></S.MethodIcon>
              <S.MethodContent>
                <S.MethodHeading>
                  <S.MethodTitle>Códigos de reserva</S.MethodTitle>
                  <S.Configured>{codigos.length} códigos disponíveis</S.Configured>
                </S.MethodHeading>
                <S.MethodDescription>Use um código de reserva caso não consiga utilizar seu método principal de autenticação.</S.MethodDescription>
                <S.ButtonRow>
                  <S.PrimaryButton type="button" onClick={() => setMostrarCodigos((mostrar) => !mostrar)} disabled={!ativada}>
                    {mostrarCodigos ? "Ocultar códigos" : "Gerenciar códigos"}
                    <ChevronDown size={15} />
                  </S.PrimaryButton>
                  <S.SecondaryButton type="button" onClick={baixarCodigos} disabled={!ativada}>
                    <Download size={15} /> Baixar códigos
                  </S.SecondaryButton>
                  {confirmarGeracao ? (
                    <S.Confirmation>
                      <span>Os códigos atuais serão substituídos.</span>
                      <S.SecondaryButton type="button" onClick={confirmarNovosCodigos}>Confirmar geração</S.SecondaryButton>
                      <S.TextButton type="button" onClick={() => setConfirmarGeracao(false)}>Cancelar</S.TextButton>
                    </S.Confirmation>
                  ) : (
                    <S.SecondaryButton type="button" onClick={() => setConfirmarGeracao(true)} disabled={!ativada}>
                      <RefreshCw size={15} /> Gerar novos códigos
                    </S.SecondaryButton>
                  )}
                </S.ButtonRow>
                {mostrarCodigos && (
                  <S.CodeList aria-label="Códigos de reserva">
                    {codigos.map((codigo) => <code key={codigo}>{codigo}</code>)}
                  </S.CodeList>
                )}
              </S.MethodContent>
            </S.MethodCard>
          </S.MethodGrid>

          <S.SectionTitle>Configurações de login</S.SectionTitle>
          <S.LoginSettings>
            <S.SettingRow>
              <S.SettingCopy>
                <S.SettingTitle>Confiar neste dispositivo</S.SettingTitle>
                <S.SettingDescription>Não solicitar o código de autenticação novamente neste dispositivo durante um período definido.</S.SettingDescription>
              </S.SettingCopy>
              <S.Switch
                type="button"
                role="switch"
                aria-label="Confiar neste dispositivo"
                aria-checked={confiarNesteDispositivo}
                $checked={confiarNesteDispositivo}
                onClick={() => setConfiarNesteDispositivo((valor) => !valor)}
              ><S.SwitchKnob $checked={confiarNesteDispositivo} /></S.Switch>
            </S.SettingRow>
            <S.SettingRow>
              <S.SettingCopy>
                <S.SettingTitle>Solicitar autenticação em novos dispositivos</S.SettingTitle>
                <S.SettingDescription>Exigir uma segunda etapa de verificação sempre que sua conta for acessada em um novo dispositivo.</S.SettingDescription>
              </S.SettingCopy>
              <S.Switch
                type="button"
                role="switch"
                aria-label="Solicitar autenticação em novos dispositivos"
                aria-checked={solicitarNovosDispositivos}
                $checked={solicitarNovosDispositivos}
                onClick={() => setSolicitarNovosDispositivos((valor) => !valor)}
              ><S.SwitchKnob $checked={solicitarNovosDispositivos} /></S.Switch>
            </S.SettingRow>
          </S.LoginSettings>

          <S.Recommendations>
            <S.RecommendationsTitle><LockKeyhole size={20} /> Recomendações de segurança</S.RecommendationsTitle>
            <S.RecommendationList>
              <li><ShieldCheck size={17} /> Mantenha seu método de autenticação atualizado.</li>
              <li><KeyRound size={17} /> Guarde seus códigos de reserva em um local seguro.</li>
              <li><CircleAlert size={17} /> Nunca compartilhe seus códigos de autenticação.</li>
              <li><Monitor size={17} /> Revise regularmente os dispositivos conectados à sua conta.</li>
            </S.RecommendationList>
          </S.Recommendations>

          <S.DangerArea>
            <S.DangerCopy>
              <S.DangerTitle>Desativar autenticação de dois fatores</S.DangerTitle>
              <S.DangerDescription>Desativar essa proteção reduzirá a segurança da sua conta.</S.DangerDescription>
            </S.DangerCopy>
            {confirmarDesativacao ? (
              <S.Confirmation>
                <span>Tem certeza que deseja desativar?</span>
                <S.DangerButton type="button" onClick={confirmarDesativar}>Confirmar desativação</S.DangerButton>
                <S.TextButton type="button" onClick={() => setConfirmarDesativacao(false)}>Cancelar</S.TextButton>
              </S.Confirmation>
            ) : (
              <S.DangerButton type="button" onClick={() => setConfirmarDesativacao(true)} disabled={!ativada}>Desativar</S.DangerButton>
            )}
          </S.DangerArea>
        </S.Content>
      </S.Card>
    </S.Wrapper>
  );
}