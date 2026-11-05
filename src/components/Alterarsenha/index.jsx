import fundo from "../../assets/fundo/fundo.png";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { apiRequest } from "../../services/api";
import PasswordInput from "../PasswordInput";

import {
  Wrapper,
  Card,
  TopBar,
  TopTitle,
  CloseButton,
  Group219,
  Group218,
  PasswordInfo,
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
  const { user } = useAuth();
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.new_password !== form.confirm_password) {
      setError("A confirmação não corresponde à nova senha.");
      return;
    }
    setLoading(true);
    try {
      const result = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
        }),
      });
      setMessage(result.message);
      setForm({ current_password: "", new_password: "", confirm_password: "" });
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
          <TopTitle>Alteração de senha</TopTitle>

          <CloseButton type="button" aria-label="Voltar" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} strokeWidth={1.8} />
          </CloseButton>
        </TopBar>

        <form onSubmit={handleSubmit}>
        <Group219>
          <Group218>

            <PasswordInfo>
              Sua senha deverá conter no mínimo 8 e no máximo 70
            </PasswordInfo>

            <LabelNome>
              Digite sua senha atual
            </LabelNome>

            <PasswordInput
              Input={NomeInput}
              autoComplete="current-password"
              required
              value={form.current_password}
              onChange={(event) => setForm({ ...form, current_password: event.target.value })}
              placeholder="Digite aqui...."
            />

            <LabelEmail>
              Nova senha
            </LabelEmail>

            <PasswordInput
              Input={EmailInput}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={form.new_password}
              onChange={(event) => setForm({ ...form, new_password: event.target.value })}
              placeholder="Digite aqui...."
            />

            <LabelSenha>
              Confirme a senha
            </LabelSenha>

            <PasswordInput
              Input={SenhaInput}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={form.confirm_password}
              onChange={(event) => setForm({ ...form, confirm_password: event.target.value })}
              placeholder="Digite aqui...."
            />

          </Group218>

          <ButtonRect as="button" type="submit" disabled={loading || !user}>
            <ButtonText>{loading ? "Salvando..." : "Alterar senha"}</ButtonText>
          </ButtonRect>
          {!user && <p role="status" style={{ color: "#fff" }}>Entre na sua conta para alterar a senha.</p>}
          {error && <p role="alert" style={{ color: "#ffb4ad" }}>{error}</p>}
          {message && <p role="status" style={{ color: "#95e7a4" }}>{message}</p>}
        </Group219>
        </form>
      </Card>
    </Wrapper>
  );
}