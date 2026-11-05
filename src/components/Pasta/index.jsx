import { useState } from 'react';
import { Folder, MoreHorizontal } from 'lucide-react';
import * as S from './styles';

export { GridPastas, LinhaPastas } from './styles';

export default function Pasta({
  imagemCapa,
  titulo = 'Sem título',
  quantidadeItens = 0,
  largura,
  compacto = false,
  visibilidade,
  onClick,
  onDelete,
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <S.PastaCardWrapper>
      <S.CartaoPasta $largura={largura} type="button" onClick={onClick}>
        <S.VisualizacaoPasta>
          {imagemCapa ? (
            <S.ImagemCapa src={imagemCapa} alt={`Capa da pasta ${titulo}`} />
          ) : (
            <Folder size={40} aria-hidden="true" />
          )}
        </S.VisualizacaoPasta>
        <S.InfoPasta $compacto={compacto}>
          <S.TituloPasta $compacto={compacto}>{titulo}</S.TituloPasta>
          <S.ContadorPasta $compacto={compacto}>+{quantidadeItens} PINS salvos</S.ContadorPasta>
        </S.InfoPasta>
      </S.CartaoPasta>
      {visibilidade && (
        <S.SeloVisibilidade $publica={visibilidade === 'public'}>
          {visibilidade === 'public' ? 'Pública' : 'Privada'}
        </S.SeloVisibilidade>
      )}
      {onDelete && (
        <S.AcoesPasta>
          <S.BotaoOpcoes
            type="button"
            aria-label={`Opções da pasta ${titulo}`}
            aria-expanded={menuAberto}
            onClick={(event) => {
              event.stopPropagation();
              setMenuAberto((aberto) => !aberto);
            }}
          >
            <MoreHorizontal size={20} />
          </S.BotaoOpcoes>
          {menuAberto && (
            <S.MenuPasta>
              <S.BotaoAcaoMenu
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuAberto(false);
                  onDelete(event);
                }}
              >
                Excluir pasta
              </S.BotaoAcaoMenu>
            </S.MenuPasta>
          )}
        </S.AcoesPasta>
      )}
    </S.PastaCardWrapper>
  );
}
