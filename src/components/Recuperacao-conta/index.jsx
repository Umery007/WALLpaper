import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  KeyRound,
  Laptop,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import fundo from "../../assets/fundo/fundo.png";
import * as S from "./styles";

function criarCodigosReserva() {
  return Array.from({ length: 8 }, () => {
    const valores = new Uint32Array(2);
    window.crypto.getRandomValues(valores);
    const primeiro = String(valores[0] % 10000).padStart(4, "0");
    const segundo = String(valores[1] % 10000).padStart(4, "0");
    return `${primeiro}-${segundo}`;
  });
}

function ocultarEmail(email) {
  const [usuario, dominio] = email.split("@");
  if (!usuario || !dominio) return email;
  return `${usuario[0]}***@${dominio}`;
}

function ocultarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length < 6) return telefone;
  return `(${numeros.slice(0, 2)}) *****-${numeros.slice(-4)}`;
}

export default function RecuperacaoConta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("u***@gmail.com");
  const [telefone, setTelefone] = useState("(31) *****-1234");
  const [metodoEditando, setMetodoEditando] = useState("");
  const [valorEditando, setValorEditando] = useState("");
  const [codigos, setCodigos] = useState(criarCodigosReserva);
  const [confirmarGeracao, setConfirmarGeracao] = useState(false);
  const [autenticadorConfigurado, setAutenticadorConfigurado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [verificado, setVerificado] = useState(false);

  function abrirEdicao(metodo) {
    setMetodoEditando(metodo);
    setValorEditando("");
    setAviso("");
  }

  function salvarMetodo(event) {
    event.preventDefault();
    const valor = valorEditando.trim();
    if (!valor) return;

    if (metodoEditando === "email") {
      setEmail(ocultarEmail(valor));
    } else {
      setTelefone(ocultarTelefone(valor));
    }

    setMetodoEditando("");
    setAviso("Método de recuperação atualizado. A confirmação será solicitada ao entrar na sua conta.");
    setVerificado(false);
  }

  function baixarCodigos() {
    const arquivo = new Blob([`Códigos de reserva da conta\n\n${codigos.join("\n")}\n`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "codigos-de-reserva.txt";
    link.click();
    URL.revokeObjectURL(url);
    setAviso("Download dos códigos de reserva iniciado. Guarde o arquivo em um local seguro.");
  }

  function gerarNovosCodigos() {
    setCodigos(criarCodigosReserva());
    setConfirmarGeracao(false);
    setAviso("Novos códigos gerados. Os códigos anteriores não devem mais ser utilizados.");
  }

  function verificarConfiguracoes() {
    setVerificado(true);
    setAviso("Verificação concluída. Seus métodos de recuperação estão disponíveis.");
  }

  return (
    <S.Pagina
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <S.Painel>
        <S.TopBar>
          <S.Titulo>Recuperação da conta</S.Titulo>
          <S.BotaoVoltar type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={21} strokeWidth={1.8} />
          </S.BotaoVoltar>
        </S.TopBar>

        <S.Conteudo>
          <S.Descricao>
            Configure métodos de recuperação para recuperar sua conta caso perca o acesso.
          </S.Descricao>

          <S.ResumoProtecao>
            <S.Progresso aria-label="Proteção da conta em 80 por cento">
              <S.ProgressoInterno>
                <ShieldCheck size={23} />
              </S.ProgressoInterno>
            </S.Progresso>
            <S.ResumoTexto>
              <S.ResumoRotulo>Proteção da conta</S.ResumoRotulo>
              <S.ResumoValor>Boa</S.ResumoValor>
            </S.ResumoTexto>
            <S.BarraProgresso role="progressbar" aria-label="Nível de proteção" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
              <S.BarraPreenchida $completa={verificado} />
            </S.BarraProgresso>
            <S.Percentual>{verificado ? "100%" : "80%"}</S.Percentual>
          </S.ResumoProtecao>

          {aviso && <S.Aviso role="status">{aviso}</S.Aviso>}

          <S.Metodos>
            <S.Metodo>
              <S.IconeMetodo><Mail size={21} /></S.IconeMetodo>
              <S.MetodoConteudo>
                <S.MetodoTitulo>E-mail de recuperação</S.MetodoTitulo>
                <S.ValorMetodo>{email} <S.SeloVerificado><Check size={13} /> Verificado</S.SeloVerificado></S.ValorMetodo>
                <S.TextoMetodo>Use este e-mail para recuperar o acesso à sua conta.</S.TextoMetodo>
                {metodoEditando === "email" ? (
                  <S.Formulario onSubmit={salvarMetodo}>
                    <S.Campo
                      autoFocus
                      type="email"
                      aria-label="Novo e-mail de recuperação"
                      placeholder="Digite o novo e-mail"
                      value={valorEditando}
                      onChange={(event) => setValorEditando(event.target.value)}
                      required
                    />
                    <S.BotaoPrimario type="submit">Salvar e-mail</S.BotaoPrimario>
                    <S.BotaoTexto type="button" onClick={() => setMetodoEditando("")}>Cancelar</S.BotaoTexto>
                  </S.Formulario>
                ) : (
                  <S.BotaoSecundario type="button" onClick={() => abrirEdicao("email")}>Alterar e-mail</S.BotaoSecundario>
                )}
              </S.MetodoConteudo>
            </S.Metodo>

            <S.Metodo>
              <S.IconeMetodo><Phone size={21} /></S.IconeMetodo>
              <S.MetodoConteudo>
                <S.MetodoTitulo>Telefone de recuperação</S.MetodoTitulo>
                <S.ValorMetodo>{telefone} <S.SeloVerificado><Check size={13} /> Verificado</S.SeloVerificado></S.ValorMetodo>
                <S.TextoMetodo>Receba códigos de recuperação através do telefone cadastrado.</S.TextoMetodo>
                {metodoEditando === "telefone" ? (
                  <S.Formulario onSubmit={salvarMetodo}>
                    <S.Campo
                      autoFocus
                      type="tel"
                      aria-label="Novo telefone de recuperação"
                      placeholder="Digite o novo telefone"
                      value={valorEditando}
                      onChange={(event) => setValorEditando(event.target.value)}
                      required
                    />
                    <S.BotaoPrimario type="submit">Salvar telefone</S.BotaoPrimario>
                    <S.BotaoTexto type="button" onClick={() => setMetodoEditando("")}>Cancelar</S.BotaoTexto>
                  </S.Formulario>
                ) : (
                  <S.BotaoSecundario type="button" onClick={() => abrirEdicao("telefone")}>Alterar telefone</S.BotaoSecundario>
                )}
              </S.MetodoConteudo>
            </S.Metodo>

            <S.Metodo>
              <S.IconeMetodo><KeyRound size={21} /></S.IconeMetodo>
              <S.MetodoConteudo>
                <S.MetodoTitulo>Códigos de reserva</S.MetodoTitulo>
                <S.ValorMetodo>{codigos.length} códigos disponíveis</S.ValorMetodo>
                <S.TextoMetodo>Use os códigos de reserva caso não consiga acessar seus outros métodos de recuperação.</S.TextoMetodo>
                <S.Acoes>
                  <S.BotaoPrimario type="button" onClick={baixarCodigos}><Download size={15} /> Baixar códigos</S.BotaoPrimario>
                  {confirmarGeracao ? (
                    <S.Confirmacao>
                      <span>Os códigos atuais serão substituídos.</span>
                      <S.BotaoSecundario type="button" onClick={gerarNovosCodigos}>Confirmar geração</S.BotaoSecundario>
                      <S.BotaoTexto type="button" onClick={() => setConfirmarGeracao(false)}>Cancelar</S.BotaoTexto>
                    </S.Confirmacao>
                  ) : (
                    <S.BotaoSecundario type="button" onClick={() => setConfirmarGeracao(true)}><RefreshCw size={15} /> Gerar novos códigos</S.BotaoSecundario>
                  )}
                </S.Acoes>
              </S.MetodoConteudo>
            </S.Metodo>

            <S.Metodo>
              <S.IconeMetodo><ShieldCheck size={21} /></S.IconeMetodo>
              <S.MetodoConteudo>
                <S.MetodoTitulo>Aplicativo autenticador</S.MetodoTitulo>
                <S.ValorMetodo>{autenticadorConfigurado ? "Configurado" : "Ainda não configurado"}</S.ValorMetodo>
                <S.TextoMetodo>Use um aplicativo autenticador para gerar códigos de segurança.</S.TextoMetodo>
                <S.BotaoSecundario
                  type="button"
                  onClick={() => {
                    setAutenticadorConfigurado(true);
                    setAviso("Configuração do autenticador iniciada. Vincule seu aplicativo para concluir a ativação.");
                  }}
                  disabled={autenticadorConfigurado}
                >
                  {autenticadorConfigurado ? "Configuração iniciada" : "Configurar"}
                </S.BotaoSecundario>
              </S.MetodoConteudo>
            </S.Metodo>

            <S.Metodo $larguraTotal>
              <S.IconeMetodo><Laptop size={21} /></S.IconeMetodo>
              <S.MetodoConteudo>
                <S.MetodoTitulo>Dispositivos confiáveis</S.MetodoTitulo>
                <S.TextoMetodo>Gerencie os dispositivos que podem ajudar na recuperação da sua conta.</S.TextoMetodo>
                <S.BotaoSecundario type="button" onClick={() => navigate("/dispositivos-conectados")}>Gerenciar dispositivos</S.BotaoSecundario>
              </S.MetodoConteudo>
            </S.Metodo>
          </S.Metodos>

          <S.Recomendacoes>
            <S.RecomendacoesCabecalho>
              <S.IconeRecomendacoes><CheckCircle2 size={19} /></S.IconeRecomendacoes>
              <S.RecomendacoesTitulo>Recomendações de segurança</S.RecomendacoesTitulo>
            </S.RecomendacoesCabecalho>
            <S.ListaRecomendacoes>
              <li>Mantenha seu e-mail de recuperação atualizado.</li>
              <li>Confirme se seu telefone ainda está disponível.</li>
              <li>Guarde seus códigos de reserva em um local seguro.</li>
              <li>Não compartilhe códigos de recuperação com outras pessoas.</li>
            </S.ListaRecomendacoes>
          </S.Recomendacoes>

          <S.BotaoVerificar type="button" onClick={verificarConfiguracoes}>
            <ShieldCheck size={17} /> Verificar configurações de recuperação
          </S.BotaoVerificar>
        </S.Conteudo>
      </S.Painel>
    </S.Pagina>
  );
}