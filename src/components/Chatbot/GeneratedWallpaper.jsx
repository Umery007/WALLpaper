import { Download, Heart, Pencil } from "lucide-react";
import { API_BASE, isProtectedWallpaperImage } from "../../services/api";
import {
  GeneratedImage,
  GeneratedResult,
  ResultAction,
  ResultActions,
} from "./styles";

export default function GeneratedWallpaper({
  wallpaper,
  onFavorite,
  onEdit,
  favoritePending = false,
}) {
  return (
    <GeneratedResult>
      <GeneratedImage
        src={wallpaper.image_url}
        alt={wallpaper.title || "Wallpaper gerado por IA"}
        crossOrigin={isProtectedWallpaperImage(wallpaper.image_url) ? "use-credentials" : undefined}
      />
      <ResultActions>
        <ResultAction
          as="a"
          href={`${API_BASE}/wallpapers/${encodeURIComponent(wallpaper.id)}/download`}
          aria-label="Baixar imagem"
        >
          <Download size={16} />
          Baixar imagem
        </ResultAction>
        <ResultAction
          type="button"
          aria-label={wallpaper.favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={Boolean(wallpaper.favorited)}
          disabled={favoritePending}
          onClick={() => onFavorite(wallpaper)}
        >
          <Heart size={16} fill={wallpaper.favorited ? "currentColor" : "none"} />
          {wallpaper.favorited ? "Favoritado" : "Favoritar"}
        </ResultAction>
        {wallpaper.source === "ai" && (
          <ResultAction type="button" onClick={() => onEdit(wallpaper)}>
            <Pencil size={16} />
            Editar
          </ResultAction>
        )}
      </ResultActions>
    </GeneratedResult>
  );
}
