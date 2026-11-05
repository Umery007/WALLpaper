import { useNavigate } from 'react-router-dom';
import imagemPaper from '../../assets/img-cards/paper.jpeg';
import * as S from './styles';
import { isProtectedWallpaperImage } from '../../services/api';

const imagensDemo = Array.from({ length: 60 }, (_, index) => ({
	id: index + 1,
	url: imagemPaper,
	alt: `Wallpaper salvo ${index + 1}`,
	proporcao: [0.72, 1.28, 1.65, 0.86, 1.45, 0.98][index % 6],
	invertida: index % 2 === 0,
}));

export function GridCard({ image, index, onOpenPin }) {
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
				$proporcao={image.proporcao}
				$invertida={image.invertida}
			/>
		</S.ItemSalvo>
	);
}

export function ImageGrid({ images = imagensDemo, onOpenPin }) {
	return (
		<S.GaleriaSalvos>
			{images.map((image, index) => (
				<GridCard key={image.id} image={image} index={index} onOpenPin={onOpenPin} />
			))}
		</S.GaleriaSalvos>
	);
}

export default function Salvos({ imagens = imagensDemo }) {
	const navigate = useNavigate();
	return <ImageGrid images={imagens} onOpenPin={() => navigate('/pin')} />;
}
