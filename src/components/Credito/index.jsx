import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Coins,
  Image,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { startCheckout } from "../../services/billing";
import { apiRequest } from "../../services/api";
import {
  BackButton,
  BenefitCard,
  BenefitGrid,
  BillingNotice,
  BuyButton,
  CreditAmount,
  CreditCard,
  CreditGrid,
  FaqAnswer,
  FaqItem,
  FaqList,
  FaqSection,
  FaqTitle,
  Hero,
  HeroBadge,
  PackPrice,
  PackTag,
  Page,
  SectionDescription,
  SectionTitle,
  Subtitle,
  Title,
} from "./styles";

const packs = [
  { credits: 50, price: "5,90" },
  { credits: 100, price: "9,90" },
  { credits: 250, price: "19,90", popular: true },
  { credits: 500, price: "34,90" },
];

const usageExamples = [
  {
    title: "Geração de imagem",
    description: "Use créditos para transformar uma ideia em um novo wallpaper.",
    Icon: Image,
  },
  {
    title: "Alta qualidade",
    description: "Escolha opções de geração com mais definição quando disponíveis.",
    Icon: Sparkles,
  },
  {
    title: "Recursos especiais",
    description: "Aplique ferramentas e estilos especiais que podem consumir créditos.",
    Icon: WandSparkles,
  },
];

const questions = [
  {
    question: "Os créditos avulsos exigem uma assinatura?",
    answer:
      "Não. Os pacotes de créditos avulsos podem ser comprados sem contratar um plano de assinatura.",
  },
  {
    question: "Por quanto tempo os créditos ficam disponíveis?",
    answer: "Os créditos não expiram enquanto a conta estiver ativa.",
  },
  {
    question: "Como posso pagar pelo pacote?",
    answer: "O checkout protegido é feito pelo Mercado Pago.",
  },
  {
    question: "Como os créditos são utilizados?",
    answer: "Os créditos podem ser usados para gerar imagens e acessar recursos especiais.",
  },
];

export default function Credito() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    apiRequest("/billing/me")
      .then((accountInfo) => {
        if (active) setAccount(accountInfo);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  async function buyPack(pack) {
    setError("");
    if (!user) {
      navigate(`/criar-conta?produto=credit-${pack.credits}`);
      return;
    }
    try {
      await startCheckout(`credit-${pack.credits}`);
    } catch (checkoutError) {
      setError(checkoutError.message);
    }
  }

  return (
    <Page>
      <BackButton type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} aria-hidden="true" />
        Voltar
      </BackButton>

      <Hero>
        <HeroBadge>
          <Coins size={16} aria-hidden="true" />
          CRÉDITOS AVULSOS
        </HeroBadge>
        <Title>Compre créditos quando precisar</Title>
        <Subtitle>
          Escolha um pacote de créditos e use na geração de wallpapers com IA.
        </Subtitle>
      </Hero>

      <BillingNotice>
        <Check size={17} aria-hidden="true" />
        {user ? `Saldo atual: ${account?.credits ?? "..." } créditos.` : "Entre na sua conta para consultar seu saldo."}
      </BillingNotice>

      <CreditGrid aria-label="Pacotes de créditos">
        {packs.map((pack) => (
          <CreditCard key={pack.credits} $popular={pack.popular}>
            {pack.popular && <PackTag>Melhor custo-benefício</PackTag>}
            <CreditAmount>
              <Coins size={22} aria-hidden="true" />
              <span>{pack.credits}</span>
            </CreditAmount>
            <p>créditos</p>
            <PackPrice>
              <span>R$</span> {pack.price}
            </PackPrice>
            <BuyButton
              type="button"
              $primary={pack.popular}
              onClick={() => buyPack(pack)}
            >
              Comprar agora
            </BuyButton>
          </CreditCard>
        ))}
      </CreditGrid>

      <SectionDescription>
        Use seus créditos para gerar wallpapers com inteligência artificial.
      </SectionDescription>

      <section>
        <SectionTitle>O que você pode fazer com seus créditos</SectionTitle>
        <BenefitGrid>
          {usageExamples.map(({ title, description, Icon }) => (
            <BenefitCard key={title}>
              <Icon size={22} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </BenefitCard>
          ))}
        </BenefitGrid>
      </section>

      <FaqSection>
        <FaqTitle>
          <CircleHelp size={23} aria-hidden="true" />
          Perguntas frequentes
        </FaqTitle>
        <FaqList>
          {questions.map(({ question, answer }) => (
            <FaqItem key={question}>
              <h3>{question}</h3>
              <FaqAnswer>{answer}</FaqAnswer>
            </FaqItem>
          ))}
        </FaqList>
      </FaqSection>

      {error && <p role="alert" style={{ color: "#ffb4ad", textAlign: "center" }}>{error}</p>}
    </Page>
  );
}
