import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { apiRequest } from "../../services/api";
import * as S from "./styles";

export default function PublicarWallpaper() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/wallpapers", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <S.Page>
        <S.BackButton type="button" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Voltar</S.BackButton>
        <S.Panel>
          <h1>Entre para publicar</h1>
          <p>Você precisa de uma conta para compartilhar wallpapers.</p>
          <S.SubmitButton type="button" onClick={() => navigate("/cadastro")}>Entrar</S.SubmitButton>
        </S.Panel>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.BackButton type="button" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Voltar</S.BackButton>
      <S.Panel>
        <h1>Publicar wallpaper</h1>
        <p>Informe uma imagem pública em uma URL HTTPS para compartilhar na galeria.</p>
        <form onSubmit={handleSubmit}>
          <S.Field>
            <label htmlFor="wallpaper-title">Título</label>
            <input id="wallpaper-title" value={form.title} maxLength={150} required onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </S.Field>
          <S.Field>
            <label htmlFor="wallpaper-image">URL da imagem</label>
            <input id="wallpaper-image" type="url" maxLength={2048} required placeholder="https://..." value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
          </S.Field>
          <S.Field>
            <label htmlFor="wallpaper-description">Descrição</label>
            <textarea id="wallpaper-description" maxLength={5000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </S.Field>
          <S.Field>
            <label htmlFor="wallpaper-category">Categoria</label>
            <input id="wallpaper-category" maxLength={80} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          </S.Field>
          <S.Field>
            <label htmlFor="wallpaper-tags">Tags (separadas por vírgula)</label>
            <input id="wallpaper-tags" maxLength={500} value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
          </S.Field>
          {error && <S.Error role="alert">{error}</S.Error>}
          <S.SubmitButton type="submit" disabled={loading}>{loading ? "Publicando..." : "Publicar"}</S.SubmitButton>
        </form>
      </S.Panel>
    </S.Page>
  );
}
