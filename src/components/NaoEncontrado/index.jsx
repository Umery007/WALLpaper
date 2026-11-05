import { useLocation } from "react-router-dom";
import { Code, Description, HomeLink, Page, Title } from "./styles";

/** Qualquer endereco fora das rotas conhecidas cai aqui, em vez de uma pagina em branco. */
export default function NaoEncontrado() {
  const { pathname } = useLocation();

  return (
    <Page>
      <Code>Erro 404</Code>
      <Title>Esta página não existe</Title>
      <Description>
        Não encontramos nada em <strong>{pathname}</strong>. O endereço pode ter mudado
        de lugar ou ter sido digitado com um caractere a mais.
      </Description>
      <HomeLink to="/">Voltar para a galeria</HomeLink>
    </Page>
  );
}
