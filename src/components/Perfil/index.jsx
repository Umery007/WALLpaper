import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, FolderPlus, Maximize2, Minimize2 } from 'lucide-react';
import imagemPadraoBanner from '../../assets/perfil/pages.png';
import imagemPasta from '../../assets/img-cards/paper.jpeg';
import Pasta, { GridPastas, LinhaPastas } from '../Pasta';
import { Card } from '../Cards';
import { CardsWrapper } from '../Cards/styles';
import SeletorWallpapers from '../SeletorWallpapers';
import { reduzirImagemQuadrada } from '../../utils/reduzirImagem';
import { apiRequest } from '../../services/api';
import Salvos from '../Salvos-ampliar';
import SalvosEncolher from '../Salvos-encolher';
import { readSavedWallpaperFolders, writeSavedWallpaperFolders } from '../../utils/savedWallpapers';
import * as S from './styles';
import useAuth from '../../contexts/useAuth';

const DEFAULT_PROFILE = { name: '', username: '', isPrivate: false };

function carregarPerfilLocal(ownerId) {
  try {
    const savedProfile = window.localStorage.getItem(`wa1paper-profile:${ownerId ?? 'guest'}`);
    return savedProfile ? { ...DEFAULT_PROFILE, ...JSON.parse(savedProfile) } : DEFAULT_PROFILE;
  } catch (error) {
    return { ...DEFAULT_PROFILE, storageError: error.message };
  }
}

function carregarVisualizacoesPerfil(ownerId) {
  try {
    return {
      count: Number(window.localStorage.getItem(`wa1paper-profile-views:${ownerId ?? 'guest'}`)) || 0,
      error: '',
    };
  } catch (error) {
    return {
      count: 0,
      error: error.message || 'Não foi possível carregar as visualizações do perfil.',
    };
  }
}

function carregarPastasSalvas(ownerId) {
  try {
    return { pastas: readSavedWallpaperFolders(ownerId), erro: '' };
  } catch (error) {
    return {
      pastas: [],
      erro: error.message || 'Não foi possível carregar suas pastas salvas.',
    };
  }
}

export default function Perfil(props) {
  const auth = useAuth();
  return <PerfilContent key={auth.user?.id ?? 'guest'} {...props} {...auth} />;
}

function PerfilContent({
  imagemBanner = imagemPadraoBanner,
  imagemAvatar,
  dadosPastas = [],
  mostrarSalvos = false,
  salvosAmpliadoInicial = false,
  user,
  updateProfile,
  refreshUser,
}) {
  const entradaAvatarRef = useRef(null);
  const [enviandoAvatar, setEnviandoAvatar] = useState(false);
  const [erroAvatar, setErroAvatar] = useState('');
  // Numeros de seguidores; chegam da API depois que o perfil carrega.
  // Guarda de qual usuario sao estes numeros; enquanto nao bater com o atual,
  // mostramos zero em vez dos numeros da conta anterior.
  const [seguidores, setSeguidores] = useState({ de: null, followers_count: 0, following_count: 0 });

  const [abaAtiva, setAbaAtiva] = useState('pastas');
  const [salvosAmpliado, setSalvosAmpliado] = useState(salvosAmpliadoInicial);
  const [pastasState] = useState(() => carregarPastasSalvas(user?.id ?? null));
  const [pastasSalvas, setPastasSalvas] = useState(user ? [] : pastasState.pastas);
  const pastasOwner = user?.id ?? null;
  const [erroPastas, setErroPastas] = useState(pastasState.erro);
  const [criandoPasta, setCriandoPasta] = useState(false);
  const [nomeNovaPasta, setNomeNovaPasta] = useState('');
  const [visibilidadeNovaPasta, setVisibilidadeNovaPasta] = useState('private');
  const [capaNovaPasta, setCapaNovaPasta] = useState(null);
  // Wallpapers escolhidos (dos favoritos ou gerados) para ja nascer com conteudo.
  const [itensNovaPasta, setItensNovaPasta] = useState([]);
  const [previewCapa, setPreviewCapa] = useState('');
  const [salvandoPasta, setSalvandoPasta] = useState(false);
  const [pastaParaExcluir, setPastaParaExcluir] = useState(null);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfilLocal, setPerfilLocal] = useState(() => carregarPerfilLocal(user?.id ?? null));
  const [nomeEditado, setNomeEditado] = useState('');
  const [nomeUsuarioEditado, setNomeUsuarioEditado] = useState('');
  const [contaPrivadaEditada, setContaPrivadaEditada] = useState(false);
  const [visualizacoesIniciais] = useState(() => carregarVisualizacoesPerfil(user?.id ?? null));
  const [criados, setCriados] = useState({ ownerId: null, wallpapers: [], erro: '' });
  const [erroPerfil, setErroPerfil] = useState(perfilLocal.storageError || '');
  const [mensagemVerificacao, setMensagemVerificacao] = useState('');
  const [enviandoVerificacao, setEnviandoVerificacao] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const visualizacaoRegistrada = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ownerId = user?.id ?? null;

  useEffect(() => {
    if (!ownerId) return undefined;

    let active = true;
    apiRequest('/folders')
      .then((data) => {
        if (active) {
          setPastasSalvas(data.folders);
          setErroPastas('');
        }
      })
      .catch((error) => {
        if (active) setErroPastas(error.message || 'Não foi possível carregar suas pastas.');
      });
    return () => { active = false; };
  }, [ownerId]);

  // Wallpapers publicados/gerados pela propria pessoa, para a aba "Criados".
  useEffect(() => {
    // Sem conta nao ha o que buscar; wallpapersCriados ja filtra pelo dono.
    if (!ownerId) return undefined;

    let active = true;
    apiRequest('/wallpapers/mine')
      .then((data) => {
        if (active) setCriados({ ownerId, wallpapers: data.wallpapers, erro: '' });
      })
      .catch((error) => {
        if (active) {
          setCriados({
            ownerId,
            wallpapers: [],
            erro: error.message || 'Não foi possível carregar seus wallpapers.',
          });
        }
      });
    return () => { active = false; };
  }, [ownerId]);

  useEffect(() => {
    if (mostrarSalvos || visualizacaoRegistrada.current) return;
    visualizacaoRegistrada.current = true;
    const novasVisualizacoes = carregarVisualizacoesPerfil(ownerId).count + 1;
    try {
      window.localStorage.setItem(`wa1paper-profile-views:${ownerId ?? 'guest'}`, String(novasVisualizacoes));
    } catch (error) {
      console.error('Não foi possível salvar as visualizações do perfil.', error);
    }
  }, [mostrarSalvos, ownerId]);

  useEffect(() => () => {
    if (previewCapa) URL.revokeObjectURL(previewCapa);
  }, [previewCapa]);

  useEffect(() => {
    if (!editandoPerfil) return undefined;

    function fecharComEscape(event) {
      if (event.key === 'Escape' && !salvandoPerfil) setEditandoPerfil(false);
    }

    window.addEventListener('keydown', fecharComEscape);
    return () => window.removeEventListener('keydown', fecharComEscape);
  }, [editandoPerfil, salvandoPerfil]);

  async function salvarPerfil(event) {
    event.preventDefault();
    setErroPerfil('');
    setSalvandoPerfil(true);
    try {
      const profile = {
        name: nomeEditado.trim(),
        username: nomeUsuarioEditado.trim().replace(/^@/, ''),
        isPrivate: contaPrivadaEditada,
      };
      if (user) await updateProfile(profile);
      window.localStorage.setItem(`wa1paper-profile:${ownerId ?? 'guest'}`, JSON.stringify(profile));
      setPerfilLocal(profile);
      setEditandoPerfil(false);
    } catch (error) {
      setErroPerfil(error.message || 'Não foi possível salvar as alterações do perfil.');
    } finally {
      setSalvandoPerfil(false);
    }
  }

  // Busca os numeros de seguidores sempre que o usuario logado muda.
  useEffect(() => {
    if (!user) return undefined;

    let ativo = true;
    apiRequest('/users/me/follow-stats')
      .then((dados) => {
        if (ativo && dados?.stats) setSeguidores({ ...dados.stats, de: user.id });
      })
      .catch(() => {
        // Sem os numeros a tela continua util; nao vale alarmar.
      });

    return () => { ativo = false; };
  }, [user]);

  async function trocarAvatar(event) {
    const arquivo = event.target.files?.[0];
    // Permite escolher o mesmo arquivo de novo depois de um erro.
    event.target.value = '';
    if (!arquivo) return;

    setEnviandoAvatar(true);
    setErroAvatar('');
    try {
      // Reduz no navegador: a foto do celular nao caberia no corpo da requisicao.
      const imagem = await reduzirImagemQuadrada(arquivo);
      await apiRequest('/users/me/avatar', { method: 'PUT', body: JSON.stringify({ image: imagem }) });
      await refreshUser();
    } catch (error) {
      setErroAvatar(error.message || 'Não foi possível trocar a foto.');
    } finally {
      setEnviandoAvatar(false);
    }
  }

  async function reenviarVerificacao() {
    setEnviandoVerificacao(true);
    setMensagemVerificacao('');
    try {
      const result = await apiRequest('/auth/verify-email/resend', { method: 'POST' });
      setMensagemVerificacao(result.message);
    } catch (error) {
      setMensagemVerificacao(error.message || 'Não foi possível enviar o link de verificação.');
    } finally {
      setEnviandoVerificacao(false);
    }
  }

  async function criarPasta(event) {
    event.preventDefault();
    const nome = nomeNovaPasta.trim();
    if (!nome) {
      setErroPastas('Digite um nome para a pasta.');
      return;
    }
    setSalvandoPasta(true);
    try {
      let coverImage = '';
      if (capaNovaPasta) {
        if (capaNovaPasta.size > 700 * 1024) {
          throw new Error('A capa de uma pasta deve ter no máximo 700 KB.');
        }
        coverImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Não foi possível ler a imagem escolhida.'));
          reader.readAsDataURL(capaNovaPasta);
        });
      }

      let novaPasta;
      const cover = coverImage;
      if (user) {
        const { folder } = await apiRequest('/folders', {
          method: 'POST',
          body: JSON.stringify({
            name: nome,
            visibility: visibilidadeNovaPasta,
            cover_image: cover,
            wallpaper_ids: itensNovaPasta.map((item) => item.id),
          }),
        });
        novaPasta = folder;
        setPastasSalvas((current) => [
          ...(pastasOwner === ownerId ? current : []),
          novaPasta,
        ]);
      } else {
        novaPasta = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: nome,
          visibility: visibilidadeNovaPasta,
          coverImage: cover,
          items: itensNovaPasta,
        };
        const novasPastas = [...pastasSalvas, novaPasta];
        setPastasSalvas(novasPastas);
        writeSavedWallpaperFolders(novasPastas);
      }
      setErroPastas('');
      setNomeNovaPasta('');
      setCapaNovaPasta(null);
      setItensNovaPasta([]);
      setVisibilidadeNovaPasta('private');
      setCriandoPasta(false);
    } catch (error) {
      setErroPastas(error.message || 'Não foi possível criar a pasta.');
    } finally {
      setSalvandoPasta(false);
    }
  }

  async function confirmarExclusaoPasta() {
    if (!pastaParaExcluir) return;
    const pasta = pastaParaExcluir;
    if (user) {
      try {
        await apiRequest(`/folders/${encodeURIComponent(pasta.id)}`, { method: 'DELETE' });
      } catch (error) {
        setErroPastas(error.message || 'Não foi possível excluir a pasta.');
        return;
      }
    }
    const novasPastas = pastasSalvas.filter((item) => item.id !== pasta.id);
    if (!user) writeSavedWallpaperFolders(novasPastas);
    setPastasSalvas(novasPastas);
    setErroPastas('');
    setPastaParaExcluir(null);
  }

  const pastasExibidas = [
    ...dadosPastas,
    ...(pastasOwner === ownerId ? pastasSalvas : []).map((pasta) => ({
      id: pasta.id,
      titulo: pasta.name,
      quantidadeItens: pasta.items.length,
      imagemCapa: pasta.coverImage || pasta.items[0]?.image || imagemPasta,
      visibilidade: pasta.visibility,
      pastaSalva: pasta,
    })),
  ];

  // So mostra os wallpapers que ja pertencem ao usuario atual: a resposta
  // anterior continua em memoria por um instante quando a conta muda.
  const wallpapersCriados = criados.ownerId === ownerId ? criados.wallpapers : [];

  // A foto do usuario logado tem prioridade sobre a prop recebida.
  const fotoDePerfil = user?.avatar_url || imagemAvatar || '';
  const numerosDoPerfil = seguidores.de === user?.id
    ? seguidores
    : { followers_count: 0, following_count: 0 };

  const pastaSelecionada = location.state?.folderId
    ? (pastasOwner === ownerId ? pastasSalvas : []).find((pasta) => pasta.id === location.state.folderId)
    : null;
  const imagensDaPasta = pastaSelecionada
    ? pastaSelecionada.items.map((item) => ({
      id: item.id,
      url: item.image,
      alt: item.title,
    }))
    : undefined;

  return (
    <S.Container>
      <S.SecaoBanner>
        {imagemBanner ? (
          <S.ImagemBanner src={imagemBanner} alt="Banner" />
        ) : (
          <S.BannerPadrao />
        )}

        <S.BotaoVoltar aria-label="Voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#fff" />
        </S.BotaoVoltar>

        <S.CartaoPerfil>
          <S.ContainerAvatar
            type="button"
            disabled={enviandoAvatar}
            aria-label={fotoDePerfil ? 'Trocar a foto de perfil' : 'Adicionar uma foto de perfil'}
            onClick={() => entradaAvatarRef.current?.click()}
          >
            {fotoDePerfil && <S.ImagemAvatar src={fotoDePerfil} alt="" />}
            {!fotoDePerfil && <Camera size={26} aria-hidden="true" />}
            <S.SobreposicaoAvatar className="sobreposicao-avatar" aria-hidden="true">
              <Camera size={18} />
              {enviandoAvatar ? 'enviando' : 'trocar'}
            </S.SobreposicaoAvatar>
          </S.ContainerAvatar>
          <input
            ref={entradaAvatarRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={trocarAvatar}
          />

          <S.DetalhesUsuario>
            <S.CabecalhoUsuario>
              <div>
                <S.NomeUsuario>
                  {user ? user.name : perfilLocal.name || 'Seu perfil'}
                  {user?.plan === 'premium' && <S.SeloPremium>Premium</S.SeloPremium>}
                </S.NomeUsuario>
                {((user && user.username) || (!user && perfilLocal.username)) && (
                  <S.NomeUsuarioHandle>@{(user?.username || perfilLocal.username).replace(/^@/, '')}</S.NomeUsuarioHandle>
                )}
              </div>
              <S.BotaoEditar type="button" onClick={() => {
                setNomeEditado(user?.name || perfilLocal.name || '');
                setNomeUsuarioEditado(user?.username || perfilLocal.username || '');
                setContaPrivadaEditada(user?.isPrivate ?? perfilLocal.isPrivate);
                setErroPerfil('');
                setEditandoPerfil(true);
              }}>
                <span>Editar perfil</span>
              </S.BotaoEditar>
            </S.CabecalhoUsuario>

            <S.LinhaSeguidores>
              <S.ContadorSeguidores as="span">
                <strong>{numerosDoPerfil.followers_count}</strong>
                {numerosDoPerfil.followers_count === 1 ? ' seguidor' : ' seguidores'}
              </S.ContadorSeguidores>
              <S.ContadorSeguidores as="span">
                <strong>{numerosDoPerfil.following_count}</strong>
                {' seguindo'}
              </S.ContadorSeguidores>
            </S.LinhaSeguidores>

            {erroAvatar && <S.ErroDialog role="alert">{erroAvatar}</S.ErroDialog>}

            <S.BioUsuario>
              {user?.email || (perfilLocal.isPrivate ? 'Conta privada' : 'Conta pública')}
            </S.BioUsuario>
            {user && !user.isEmailVerified && (
              <S.VerificacaoEmail>
                <span>Confirme seu e-mail para liberar os benefícios vinculados à conta.</span>
                <button type="button" onClick={reenviarVerificacao} disabled={enviandoVerificacao}>
                  {enviandoVerificacao ? 'Enviando...' : 'Reenviar link'}
                </button>
                {mensagemVerificacao && <small role="status">{mensagemVerificacao}</small>}
              </S.VerificacaoEmail>
            )}
            <S.VisualizacoesPerfil>
              {visualizacoesIniciais.count + (mostrarSalvos ? 0 : 1)} visualizações do perfil neste dispositivo
            </S.VisualizacoesPerfil>
          </S.DetalhesUsuario>
        </S.CartaoPerfil>
      </S.SecaoBanner>

      {editandoPerfil && (
        <S.DialogOverlay onClick={(event) => {
          if (event.target === event.currentTarget && !salvandoPerfil) setEditandoPerfil(false);
        }}>
          <S.Dialog role="dialog" aria-modal="true" aria-labelledby="editar-perfil-titulo">
            <S.DialogCabecalho>
              <div>
                <S.DialogRotulo>SEUS DADOS</S.DialogRotulo>
                <S.DialogTitulo id="editar-perfil-titulo">Editar perfil</S.DialogTitulo>
              </div>
              <S.DialogFechar
                type="button"
                aria-label="Fechar"
                disabled={salvandoPerfil}
                onClick={() => setEditandoPerfil(false)}
              >
                ×
              </S.DialogFechar>
            </S.DialogCabecalho>
            <S.FormularioPerfil onSubmit={salvarPerfil}>
              <label htmlFor="profile-name">Nome</label>
              <input
                id="profile-name"
                autoFocus
                required
                maxLength={100}
                value={nomeEditado}
                onChange={(event) => setNomeEditado(event.target.value)}
              />
              <label htmlFor="profile-username">Nome de usuário</label>
              <input
                id="profile-username"
                required
                maxLength={30}
                pattern="[A-Za-z0-9._-]+"
                title="Use letras, números, ponto, hífen ou sublinhado."
                value={nomeUsuarioEditado}
                onChange={(event) => setNomeUsuarioEditado(event.target.value)}
                placeholder="exemplo"
              />
              <label htmlFor="profile-privacy">Privacidade da conta</label>
              <select
                id="profile-privacy"
                value={contaPrivadaEditada ? 'private' : 'public'}
                onChange={(event) => setContaPrivadaEditada(event.target.value === 'private')}
              >
                <option value="public">Pública — qualquer pessoa pode ver</option>
                <option value="private">Privada — somente pessoas autorizadas</option>
              </select>
              <S.AvisoPerfil>
                A preferência fica salva neste navegador; restringir o acesso de outras pessoas depende do backend.
              </S.AvisoPerfil>
              {erroPerfil && <S.ErroDialog role="alert">{erroPerfil}</S.ErroDialog>}
              <S.AcoesFormulario>
                <S.BotaoCancelar
                  type="button"
                  disabled={salvandoPerfil}
                  onClick={() => setEditandoPerfil(false)}
                >
                  Cancelar
                </S.BotaoCancelar>
                <S.BotaoSalvarPerfil type="submit" disabled={salvandoPerfil}>
                  {salvandoPerfil ? 'Salvando...' : 'Salvar alterações'}
                </S.BotaoSalvarPerfil>
              </S.AcoesFormulario>
            </S.FormularioPerfil>
          </S.Dialog>
        </S.DialogOverlay>
      )}

      <S.BarraNavegacao>
        {mostrarSalvos ? (
          <S.TituloPasta>{pastaSelecionada?.name || 'Pastas-NANA'}</S.TituloPasta>
        ) : (
          <S.ContainerAbas>
            <S.BotaoAba
              $ativo={abaAtiva === 'criados'}
              onClick={() => setAbaAtiva('criados')}
            >
              Criados
            </S.BotaoAba>
            <S.BotaoAba
              $ativo={abaAtiva === 'pastas'}
              onClick={() => setAbaAtiva('pastas')}
            >
              Pastas
            </S.BotaoAba>
          </S.ContainerAbas>
        )}

        <S.ContainerAcoes>
        {!mostrarSalvos && abaAtiva === 'pastas' && (
          <S.BotaoCriarPasta type="button" onClick={() => {
            setErroPastas('');
            setCriandoPasta((aberta) => !aberta);
          }}>
            <FolderPlus size={16} />
            Criar pasta
          </S.BotaoCriarPasta>
        )}
        <S.BotaoIcone
            type="button"
            aria-label="Expandir"
            aria-pressed={salvosAmpliado}
            $ativo={salvosAmpliado}
            onClick={() => setSalvosAmpliado(true)}
          >
            <Maximize2 size={16} />
          </S.BotaoIcone>
          <S.BotaoIcone
            type="button"
            aria-label="Reduzir"
            aria-pressed={!salvosAmpliado}
            $ativo={!salvosAmpliado}
            onClick={() => setSalvosAmpliado(false)}
          >
            <Minimize2 size={16} />
          </S.BotaoIcone>
        </S.ContainerAcoes>
      </S.BarraNavegacao>

      <S.AreaConteudo>
        {criandoPasta && !mostrarSalvos && abaAtiva === 'pastas' && (
          <S.DialogOverlay onClick={(event) => {
            if (event.target === event.currentTarget && !salvandoPasta) setCriandoPasta(false);
          }}>
            <S.Dialog role="dialog" aria-modal="true" aria-labelledby="criar-pasta-titulo">
              <S.DialogCabecalho>
                <div>
                  <S.DialogRotulo>ORGANIZE SUA COLEÇÃO</S.DialogRotulo>
                  <S.DialogTitulo id="criar-pasta-titulo">Criar pasta</S.DialogTitulo>
                </div>
                <S.DialogFechar
                  type="button"
                  aria-label="Fechar"
                  disabled={salvandoPasta}
                  onClick={() => setCriandoPasta(false)}
                >
                  ×
                </S.DialogFechar>
              </S.DialogCabecalho>
              <S.FormularioPasta onSubmit={criarPasta}>
                <label htmlFor="nome-nova-pasta">Nome da pasta</label>
                <input
                  id="nome-nova-pasta"
                  autoFocus
                  maxLength={80}
                  required
                  value={nomeNovaPasta}
                  onChange={(event) => setNomeNovaPasta(event.target.value)}
                  placeholder="Ex.: Meus wallpapers"
                />
                <label htmlFor="visibilidade-nova-pasta">Privacidade</label>
                <select
                  id="visibilidade-nova-pasta"
                  value={visibilidadeNovaPasta}
                  onChange={(event) => setVisibilidadeNovaPasta(event.target.value)}
                >
                  <option value="private">Privada — só você vê</option>
                  <option value="public">
                    Pública — visível neste navegador
                  </option>
                </select>
                <label htmlFor="capa-nova-pasta">Imagem de capa (opcional)</label>
                <input
                  id="capa-nova-pasta"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    const limite = visibilidadeNovaPasta === 'public' ? 5 : 1;
                    if (file && file.size > limite * 1024 * 1024) {
                      setErroPastas(`A imagem da capa deve ter no máximo ${limite} MB.`);
                      event.target.value = '';
                      setCapaNovaPasta(null);
                      setPreviewCapa('');
                      return;
                    }
                    setErroPastas('');
                    setCapaNovaPasta(file);
                    setPreviewCapa(file ? URL.createObjectURL(file) : '');
                  }}
                />
                {previewCapa && (
                  <S.PreviewCapa
                    src={previewCapa}
                    alt="Prévia da capa selecionada"
                  />
                )}
                <label>Wallpapers da pasta (opcional)</label>
                <SeletorWallpapers
                  selecionados={itensNovaPasta}
                  onChange={setItensNovaPasta}
                />
                {erroPastas && <S.ErroDialog role="alert">{erroPastas}</S.ErroDialog>}
                <S.AcoesFormulario>
                  <S.BotaoCancelar type="button" disabled={salvandoPasta} onClick={() => {
                    setCriandoPasta(false);
                    setNomeNovaPasta('');
                    setCapaNovaPasta(null);
                    setItensNovaPasta([]);
                    setPreviewCapa('');
                    setVisibilidadeNovaPasta('private');
                    setErroPastas('');
                  }}>
                    Cancelar
                  </S.BotaoCancelar>
                  <S.BotaoCriar type="submit" disabled={salvandoPasta}>
                    {salvandoPasta ? 'Salvando...' : 'Criar pasta'}
                  </S.BotaoCriar>
                </S.AcoesFormulario>
              </S.FormularioPasta>
            </S.Dialog>
          </S.DialogOverlay>
        )}
        {pastaParaExcluir && (
          <S.DialogOverlay onClick={(event) => {
            if (event.target === event.currentTarget) setPastaParaExcluir(null);
          }}>
            <S.Dialog role="alertdialog" aria-modal="true" aria-labelledby="excluir-pasta-titulo">
              <S.DialogCabecalho>
                <div>
                  <S.DialogRotulo>ESTA AÇÃO NÃO PODE SER DESFEITA</S.DialogRotulo>
                  <S.DialogTitulo id="excluir-pasta-titulo">Excluir pasta?</S.DialogTitulo>
                </div>
              </S.DialogCabecalho>
              <S.DialogDescricao>
                A pasta “{pastaParaExcluir.name}” e os wallpapers guardados nela serão removidos.
              </S.DialogDescricao>
              {erroPastas && <S.ErroDialog role="alert">{erroPastas}</S.ErroDialog>}
              <S.AcoesFormulario>
                <S.BotaoCancelar type="button" onClick={() => {
                  setPastaParaExcluir(null);
                  setErroPastas('');
                }}>
                  Manter pasta
                </S.BotaoCancelar>
                <S.BotaoExcluirConfirmacao type="button" onClick={confirmarExclusaoPasta}>
                  Excluir pasta
                </S.BotaoExcluirConfirmacao>
              </S.AcoesFormulario>
            </S.Dialog>
          </S.DialogOverlay>
        )}
        {mostrarSalvos && abaAtiva === 'pastas' ? (
          salvosAmpliado
            ? <Salvos imagens={imagensDaPasta} />
            : <SalvosEncolher imagens={imagensDaPasta} />
        ) : abaAtiva === 'criados' ? (
          wallpapersCriados.length > 0 ? (
            <>
              {criados.erro && <p role="alert" style={{ color: '#ffb4ad' }}>{criados.erro}</p>}
              <CardsWrapper>
                {wallpapersCriados.map((wallpaper) => (
                  <Card
                    key={wallpaper.id}
                    id={wallpaper.id}
                    image={wallpaper.image_url}
                    title={wallpaper.title}
                    description={wallpaper.description}
                    category={wallpaper.category}
                    creatorName={wallpaper.creator_name}
                    creatorId={wallpaper.creator_id}
                    tags={wallpaper.tags}
                    liked={wallpaper.favorited}
                  />
                ))}
              </CardsWrapper>
            </>
          ) : (
            <S.CaixaVazia>
              <S.ConteudoVazio>
                <S.TextoVazio>
                  {criados.erro || 'Sua arte pode ser o próximo Wallpapers favorito de alguém'}
                </S.TextoVazio>
                <S.BotaoCriar type="button" onClick={() => navigate('/wallpapers/novo')}>Publicar wallpaper</S.BotaoCriar>
              </S.ConteudoVazio>
            </S.CaixaVazia>
          )
        ) : (
          <GridPastas>
            {erroPastas && <p role="alert" style={{ color: '#ffb4ad' }}>{erroPastas}</p>}
            {pastasExibidas.length > 0 ? (
              Array.from({ length: Math.ceil(pastasExibidas.length / 3) }, (_, linhaIndex) =>
                pastasExibidas.slice(linhaIndex * 3, linhaIndex * 3 + 3),
              ).map((linha, linhaIndex) => (
                <LinhaPastas key={linhaIndex} $invertida={linhaIndex === 1}>
                  {linha.map((pasta, index) => (
                    <Pasta
                      key={pasta.id || index}
                      {...pasta}
                      onClick={() => navigate(
                        '/salvos',
                        pasta.pastaSalva
                          ? { state: { folderId: pasta.pastaSalva.id } }
                          : undefined,
                      )}
                      onDelete={pasta.pastaSalva
                        ? (event) => {
                          event.stopPropagation();
                          setErroPastas('');
                          setPastaParaExcluir(pasta.pastaSalva);
                        }
                        : undefined}
                    />
                  ))}
                </LinhaPastas>
              ))
            ) : (
              <S.CaixaVazia>
                <p style={{ color: '#9ca3af' }}>Nenhuma pasta encontrada.</p>
              </S.CaixaVazia>
            )}
          </GridPastas>
        )}
      </S.AreaConteudo>
    </S.Container>
  );
}