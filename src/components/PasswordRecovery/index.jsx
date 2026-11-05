import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import * as S from "./styles";
import PasswordInput from "../PasswordInput";

export default function PasswordRecovery({ reset = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = reset
        ? await apiRequest("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ token: searchParams.get("token"), password }),
        })
        : await apiRequest("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
      setMessage(result.message);
      if (reset) window.setTimeout(() => navigate("/cadastro", { replace: true }), 1500);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <S.Page>
      <S.Panel>
        <S.BackButton type="button" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Voltar</S.BackButton>
        <h1>{reset ? "Criar nova senha" : "Recuperar senha"}</h1>
        <p>{reset ? "Escolha uma nova senha para sua conta." : "Informe o e-mail da conta para receber um link seguro de recuperação."}</p>
        <form onSubmit={handleSubmit}>
          {!reset && (
            <S.Field>
              <label htmlFor="recovery-email">E-mail</label>
              <input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </S.Field>
          )}
          {reset && (
            <S.Field>
              <label htmlFor="recovery-password">Nova senha</label>
              <PasswordInput id="recovery-password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </S.Field>
          )}
          {error && <S.Error role="alert">{error}</S.Error>}
          {message && <S.Success role="status">{message}</S.Success>}
          <S.SubmitButton type="submit" disabled={loading}>
            {loading ? "Aguarde..." : reset ? "Salvar nova senha" : "Enviar link"}
          </S.SubmitButton>
        </form>
        <S.LoginLink to="/cadastro">Voltar para entrar</S.LoginLink>
      </S.Panel>
    </S.Page>
  );
}
