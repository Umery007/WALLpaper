import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as S from './styles';
import { isProtectedWallpaperImage } from '../../services/api';

const imagensDemo = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  url: `https://picsum.photos/300/450?random=${index + 1}`,
  alt: `Card ${index + 1}`,
  isLiked: [0, 4, 7, 11, 15].includes(index),
}));

export function GridCard({ image, onToggleLike, index, onOpenPin }) {
  return (
    <S.ItemSalvo
      style={{ '--card-index': index }}
      role="link"
      tabIndex={0}
      aria-label={`Abrir ${image.alt}`}
      onClick={onOpenPin}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onOpenPin?.();
        }
      }}
    >
      <S.ImagemSalva
        src={image.url}
        alt={image.alt}
        crossOrigin={isProtectedWallpaperImage(image.url) ? 'use-credentials' : undefined}
      />
      <S.BotaoCurtir
        type="button"
        aria-label={image.isLiked ? 'Descurtir wallpaper' : 'Curtir wallpaper'}
        aria-pressed={image.isLiked}
        $curtido={image.isLiked}
        onClick={(event) => {
          event.stopPropagation();
          onToggleLike(image.id);
        }}
      >
        <Heart size={16} strokeWidth={2.5} />
      </S.BotaoCurtir>
    </S.ItemSalvo>
  );
}

export function ImageGrid({ images = imagensDemo }) {
  const [cards, setCards] = useState(images);
  const navigate = useNavigate();

  const toggleLike = (id) => {
    setCards((currentCards) => currentCards.map((card) => (
      card.id === id ? { ...card, isLiked: !card.isLiked } : card
    )));
  };

  return (
    <S.GaleriaSalvos>
      {cards.map((image, index) => (
        <GridCard
          key={image.id}
          image={image}
          index={index}
          onToggleLike={toggleLike}
          onOpenPin={() => navigate('/pin')}
        />
      ))}
    </S.GaleriaSalvos>
  );
}

export default function SalvosEncolher({ imagens = imagensDemo }) {
  return <ImageGrid images={imagens} />;
}
