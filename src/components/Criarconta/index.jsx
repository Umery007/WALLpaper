import fundo from "../../assets/fundo/fundo.png";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../contexts/useAuth";
import { startCheckout } from "../../services/billing";
import PasswordInput from "../PasswordInput";
import {
  Wrapper,
  Card,
  TopBar,
  TopTitle,
  CloseButton,
  Group219,
  Group218,
  LabelNome,
  NomeInput,
  LabelEmail,
  EmailInput,
  LabelSenha,
  SenhaInput,
  ButtonRect,
  ButtonText,
} from "./styles";

export default function Criarconta() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // A intencao de compra chega na query e continua valendo se a pessoa
  // trocar para a tela de login.
  const productKey = searchParams.get("plano") || searchParams.get("produto");
  const queryString = searchParams.toString();
  const comQuery = (path) => (queryString ? `${path}?${queryString}` : path);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      if (productKey && productKey !== "gratis") {
        await startCheckout(productKey);
        return;
      }
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card>
        <TopBar>
          <TopTitle>Criar</TopTitle>
          <CloseButton type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} strokeWidth={1.8} />
          </CloseButton>
        </TopBar>

        <form onSubmit={handleSubmit}>
        <Group219>
          <Group218>
            <LabelNome htmlFor="register-name">Nome</LabelNome>
            <NomeInput id="register-name" autoComplete="name" required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Digite aqui...." />

            <LabelEmail htmlFor="register-email">E-mail</LabelEmail>
            <EmailInput id="register-email" autoComplete="email" type="email" required maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Digite aqui...." />

            <LabelSenha htmlFor="register-password">Senha</LabelSenha>
            <PasswordInput Input={SenhaInput} id="register-password" autoComplete="new-password" required minLength={8} maxLength={72} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo de 8 caracteres" />
          </Group218>

          <ButtonRect type="submit" disabled={loading}>
            <ButtonText>{loading ? "Criando..." : "Criar"}</ButtonText>
          </ButtonRect>
          {error && <p role="alert" style={{ color: "#ffb4ad", textAlign: "center" }}>{error}</p>}
          <p style={{ textAlign: "center", color: "#fff" }}>
            Já tem conta?{" "}
            <Link style={{ color: "#fff", fontWeight: 700 }} to={comQuery("/cadastro")}>Entrar</Link>
          </p>
        </Group219>
        </form>
      </Card>
    </Wrapper>
  );
}
