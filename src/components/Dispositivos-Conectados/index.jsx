import { useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Laptop,
  MapPin,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
  Wifi,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import fundo from "../../assets/fundo/fundo.png";
import * as S from "./styles";

const dispositivosIniciais = [
  {
    id: "windows-pc",
    nome: "Windows PC",
    sistema: "Windows 11",
    navegador: "Chrome",
    localizacao: "Belo Horizonte, MG",
    ultimoAcesso: "Ativo agora",
    ativo: true,
    Icone: Monitor,
  },
  {
    id: "galaxy-s24",
    nome: "Galaxy S24",
    sistema: "Android",
    navegador: "Chrome",
    localizacao: "Belo Horizonte, MG",
    ultimoAcesso: "Há 2 horas",
    ativo: false,
    Icone: Smartphone,
  },
  {
    id: "notebook",
    nome: "Notebook",
    sistema: "Windows 11",
    navegador: "Edge",
    localizacao: "São Paulo, SP",
    ultimoAcesso: "Há 3 dias",
    ativo: false,
    Icone: Laptop,
  },
  {
    id: "ipad",
    nome: "iPad",
    sistema: "iPadOS",
    navegador: "Safari",
    localizacao: "Belo Horizonte, MG",
    ultimoAcesso: "Há 1 semana",
    ativo: false,
    Icone: Tablet,
  },
];

export default function DispositivosConectados() {
  const navigate = useNavigate();
  const [dispositivos, setDispositivos] = useState(dispositivosIniciais);
  const [confirmarTodos, setConfirmarTodos] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function desconectar(dispositivo) {
    setDispositivos((atuais) => atuais.filter(({ id }) => id !== dispositivo.id));
    setMensagem(`${dispositivo.nome} foi desconectado da sua conta.`);
  }

  function desconectarTodos() {
    const sessoesEncerradas = dispositivos.filter(({ ativo }) => !ativo).length;
    setDispositivos((atuais) => atuais.filter(({ ativo }) => ativo));
    setConfirmarTodos(false);
    setMensagem(
      sessoesEncerradas
        ? `${sessoesEncerradas} ${sessoesEncerradas === 1 ? "dispositivo desconectado" : "dispositivos desconectados"}. Este dispositivo continua conectado.`
        : "Não há outros dispositivos conectados.",
    );
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
          <S.BotaoVoltar type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={21} strokeWidth={1.8} />
          </S.BotaoVoltar>
          <S.Titulo>Dispositivos conectados</S.Titulo>
        </S.TopBar>

        <S.Conteudo>
          <S.Cabecalho>
            <S.IconeSeguranca aria-hidden="true">
              <ShieldCheck size={22} />
            </S.IconeSeguranca>
            <S.Subtitulo>Gerencie os dispositivos que estão conectados à sua conta.</S.Subtitulo>
          </S.Cabecalho>

          <S.Resumo aria-label={`${dispositivos.length} dispositivos conectados`}>
            <Wifi size={16} aria-hidden="true" />
            <span>{dispositivos.length} dispositivos conectados</span>
          </S.Resumo>

          {mensagem && (
            <S.Mensagem role="status">
              <span>{mensagem}</span>
              <button type="button" aria-label="Fechar aviso" onClick={() => setMensagem("")}>
                <X size={16} />
              </button>
            </S.Mensagem>
          )}

          <S.Lista aria-label="Lista de dispositivos">
            {dispositivos.map((dispositivo) => {
              const Icone = dispositivo.Icone;

              return (
                <S.Cartao key={dispositivo.id}>
                  <S.IconeDispositivo $ativo={dispositivo.ativo} aria-hidden="true">
                    <Icone size={23} strokeWidth={1.8} />
                  </S.IconeDispositivo>

                  <S.Informacoes>
                    <S.NomeLinha>
                      <S.Nome>{dispositivo.nome}</S.Nome>
                      {dispositivo.ativo && (
                        <S.SeloAtivo>
                          <S.PontoAtivo />
                          Ativo agora
                        </S.SeloAtivo>
                      )}
                    </S.NomeLinha>
                    <S.Detalhes>{dispositivo.sistema} · {dispositivo.navegador}</S.Detalhes>
                    <S.Metadados>
                      <span><MapPin size={14} aria-hidden="true" />{dispositivo.localizacao}</span>
                      <span><Clock3 size={14} aria-hidden="true" />{dispositivo.ultimoAcesso}</span>
                    </S.Metadados>
                  </S.Informacoes>

                  {dispositivo.ativo ? (
                    <S.BotaoAtual type="button" disabled aria-label="Este dispositivo está ativo">
                      Este dispositivo
                    </S.BotaoAtual>
                  ) : (
                    <S.BotaoDesconectar
                      type="button"
                      onClick={() => desconectar(dispositivo)}
                      aria-label={`Desconectar ${dispositivo.nome}`}
                    >
                      Desconectar
                    </S.BotaoDesconectar>
                  )}
                </S.Cartao>
              );
            })}
            {dispositivos.length === 0 && (
              <S.EstadoVazio>Nenhum dispositivo conectado.</S.EstadoVazio>
            )}
          </S.Lista>

          <S.AreaSeguranca>
            <S.SegurancaTexto>
              <S.SegurancaTitulo>Proteja sua conta</S.SegurancaTitulo>
              <S.SegurancaDescricao>
                Encerre as sessões em outros dispositivos caso não os reconheça.
              </S.SegurancaDescricao>
            </S.SegurancaTexto>
            {confirmarTodos ? (
              <S.Confirmacao>
                <span>Desconectar todos os outros dispositivos?</span>
                <button type="button" onClick={desconectarTodos}>Confirmar</button>
                <button type="button" onClick={() => setConfirmarTodos(false)}>Cancelar</button>
              </S.Confirmacao>
            ) : (
              <S.BotaoTodos
                type="button"
                onClick={() => setConfirmarTodos(true)}
                disabled={!dispositivos.some(({ ativo }) => !ativo)}
              >
                Desconectar todos os dispositivos
              </S.BotaoTodos>
            )}
          </S.AreaSeguranca>
        </S.Conteudo>
      </S.Painel>
    </S.Pagina>
  );
}