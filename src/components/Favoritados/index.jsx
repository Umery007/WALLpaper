import { useEffect, useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { apiRequest } from "../../services/api";
import { Card } from "../Cards";
import { CardsWrapper } from "../Cards/styles";
import {
  BackButton,
  EmptyDescription,
  EmptyIcon,
  EmptyState,
  EmptyTitle,
  FavoritedPage,
  FavoritedPanel,
  Header,
  HeaderTitle,
  LoginButton,
  SignupLink,
} from "./styles";

export default function Favoritados() {
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useAuth();

  // O resultado guarda de qual usuario ele e. Enquanto nao corresponder ao
  // usuario atual, a tela mostra "carregando" -- evita setState no efeito.
  const [result, setResult] = useState({ key: null, wallpapers: [], error: "" });

  useEffect(() => {
    if (loadingUser || !user) return undefined;

    let active = true;
    apiRequest("/favorites")
      .then((data) => {
        if (active) setResult({ key: user.id, wallpapers: data.wallpapers, error: "" });
      })
      .catch((requestError) => {
        if (active) setResult({ key: user.id, wallpapers: [], error: requestError.message });
      });

    return () => {
      active = false;
    };
  }, [user, loadingUser]);

  const { wallpapers, error } = result;
  const status = (() => {
    if (loadingUser) return "loading";
    if (!user) return "anonymous";
    if (result.key !== user.id) return "loading";
    return error ? "error" : "ready";
  })();

  async function removeFavorite(id) {
    await apiRequest(`/favorites/${encodeURIComponent(id)}`, { method: "DELETE" });
    setResult((current) => ({
      ...current,
      wallpapers: current.wallpapers.filter((item) => item.id !== id),
    }));
  }

  function renderBody() {
    if (status === "loading") {
      return (
        <EmptyState>
          <EmptyTitle>Carregando seus favoritos...</EmptyTitle>
        </EmptyState>
      );
    }

    if (status === "anonymous") {
      return (
        <EmptyState>
          <EmptyIcon>
            <Heart size={28} aria-hidden="true" />
          </EmptyIcon>
          <EmptyTitle>Entre na sua conta para ver seus wallpapers favoritos</EmptyTitle>
          <EmptyDescription>
            Os wallpapers que você curtir ficam guardados aqui.
          </EmptyDescription>
          <LoginButton type="button" onClick={() => navigate("/cadastro")}>
            Entrar
          </LoginButton>
          <SignupLink>
            Ainda não tem uma conta? <Link to="/criar-conta">Criar conta</Link>
          </SignupLink>
        </EmptyState>
      );
    }

    if (status === "error") {
      return (
        <EmptyState>
          <EmptyTitle>Não foi possível carregar seus favoritos</EmptyTitle>
          <EmptyDescription role="alert">{error}</EmptyDescription>
        </EmptyState>
      );
    }

    if (wallpapers.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>
            <Heart size={28} aria-hidden="true" />
          </EmptyIcon>
          <EmptyTitle>Você ainda não favoritou nenhum wallpaper</EmptyTitle>
          <EmptyDescription>
            Toque no coração de um wallpaper na galeria para guardá-lo aqui.
          </EmptyDescription>
          <LoginButton type="button" onClick={() => navigate("/")}>
            Explorar a galeria
          </LoginButton>
        </EmptyState>
      );
    }

    return (
      <CardsWrapper>
        {wallpapers.map((wallpaper) => (
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
            liked
            onLikeToggle={removeFavorite}
          />
        ))}
      </CardsWrapper>
    );
  }

  return (
    <FavoritedPage>
      <BackButton type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </BackButton>
      <Header>
        <HeaderTitle>
          Seus favoritos
          {status === "ready" && wallpapers.length > 0 ? ` (${wallpapers.length})` : ""}
        </HeaderTitle>
      </Header>
      <FavoritedPanel>{renderBody()}</FavoritedPanel>
    </FavoritedPage>
  );
}
