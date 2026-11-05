import {
  ArrowLeft,
  Check,
  Clock3,
  Crown,
  Download,
  HardDrive,
  Heart,
  ImagePlus,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../contexts/useAuth";
import { startCheckout } from "../../services/billing";
import {
  BackButton,
  Benefit,
  BenefitIcon,
  BenefitsGrid,
  BenefitsSection,
  BillingNote,
  Container,
  Description,
  FeatureList,
  Hero,
  HeroBadge,
  PlanButton,
  PlanCard,
  PlanGrid,
  PlanHeader,
  PlanName,
  PopularBadge,
  Price,
  PricePeriod,
  SectionDescription,
  SectionTitle,
  Subtitle,
  Title,
} from "./styles";

const plans = [
  {
    id: "gratis",
    name: "Grátis",
    price: "0",
    description: "Para explorar e começar a criar.",
    features: [
      "Criação de wallpapers",
      "Recursos essenciais",
      "Acesso à biblioteca pública",
      "Salve wallpapers favoritos",
    ],
    buttonLabel: "Começar grátis",
  },
  {
    id: "premium",
    name: "Premium",
    price: "19,90",
    description: "Mais liberdade para criar todos os dias.",
    popular: true,
    features: [
      "Geração por IA",
      "Downloads em alta qualidade",
      "Sem anúncios",
      "Pastas ilimitadas",
      "Recursos avançados de criação",
      "Acesso a estilos exclusivos",
      "Histórico das suas criações",
    ],
    buttonLabel: "Escolher Premium",
  },
  {
    id: "pro",
    name: "Pro",
    price: "39,90",
    description: "O máximo de potência para sua criatividade.",
    features: [
      "Geração por IA avançada",
      "Qualidade máxima",
      "Recursos exclusivos",
      "Suporte prioritário",
      "Experiência de criação avançada",
      "Acesso antecipado a novidades",
      "Histórico das suas criações",
    ],
    buttonLabel: "Escolher Pro",
  },
];

const reasons = [
  {
    title: "Geração por inteligência artificial",
    description: "Transforme suas ideias em wallpapers únicos com ferramentas de IA.",
    Icon: Sparkles,
  },
  {
    title: "Alta qualidade",
    description: "Baixe imagens nítidas e prontas para personalizar seus dispositivos.",
    Icon: ImagePlus,
  },
  {
    title: "Armazenamento organizado",
    description: "Salve suas criações e encontre seus wallpapers com facilidade.",
    Icon: HardDrive,
  },
  {
    title: "Mais liberdade para criar",
    description: "Explore recursos para dar vida às suas ideias.",
    Icon: Sparkles,
  },
  {
    title: "Downloads para todos os seus dispositivos",
    description: "Tenha seus wallpapers favoritos prontos para usar em diferentes telas.",
    Icon: Download,
  },
  {
    title: "Sua coleção de favoritos",
    description: "Guarde as imagens que você mais gosta e volte a elas quando quiser.",
    Icon: Heart,
  },
  {
    title: "Menos espera para gerar",
    description: "Nos planos que incluem prioridade, suas criações passam na frente da fila.",
    Icon: Clock3,
  },
  {
    title: "Mais estilos para experimentar",
    description: "Explore diferentes visuais e encontre a estética ideal para cada ideia.",
    Icon: Palette,
  },
  {
    title: "Uma experiência do seu jeito",
    description: "Escolha entre opções de plano pensadas para diferentes necessidades.",
    Icon: ShieldCheck,
  },
];

export default function UpdateVip() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");

  async function handleChoosePlan(planId) {
    setError("");
    if (planId === "gratis") {
      navigate(user ? "/" : "/criar-conta");
      return;
    }
    if (!user) {
      navigate(`/criar-conta?plano=${encodeURIComponent(planId)}`);
      return;
    }
    try {
      await startCheckout(planId);
    } catch (checkoutError) {
      setError(checkoutError.message);
    }
  }

  return (
    <Container>
      <BackButton type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} aria-hidden="true" />
        Voltar
      </BackButton>

      <Hero>
        <HeroBadge>
          <Crown size={15} aria-hidden="true" />
          PLANOS WA1PAPER
        </HeroBadge>
        <Title>Escolha o plano ideal para você</Title>
        <Subtitle>
          Crie wallpapers incríveis com inteligência artificial. Escolha o plano
          que combina com suas necessidades e seu ritmo.
        </Subtitle>
      </Hero>

      <PlanGrid aria-label="Planos de assinatura">
        {error && <p role="alert" style={{ color: "#ffb4ad" }}>{error}</p>}
        {plans.map((plan) => (
          <PlanCard key={plan.id} $popular={plan.popular}>
            {plan.popular && <PopularBadge>Mais popular</PopularBadge>}
            <PlanHeader>
              <PlanName>{plan.name}</PlanName>
              <Description>{plan.description}</Description>
            </PlanHeader>

            <Price>
              <span>R$</span> {plan.price}
              <PricePeriod>/mês</PricePeriod>
            </Price>

            <FeatureList>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={17} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </FeatureList>

            <PlanButton
              type="button"
              $primary={plan.popular}
              onClick={() => handleChoosePlan(plan.id)}
            >
              {plan.buttonLabel}
            </PlanButton>
          </PlanCard>
        ))}
      </PlanGrid>

      <BillingNote>
        Planos pagos são cobrados mensalmente pelo checkout seguro do Mercado Pago.
      </BillingNote>

      <BenefitsSection>
        <SectionTitle>Por que escolher um plano?</SectionTitle>
        <SectionDescription>
          Mais ferramentas para transformar sua inspiração em imagens que são a
          sua cara.
        </SectionDescription>
        <BenefitsGrid>
          {reasons.map(({ title, description, Icon }) => (
            <Benefit key={title}>
              <BenefitIcon><Icon size={22} aria-hidden="true" /></BenefitIcon>
              <h3>{title}</h3>
              <p>{description}</p>
            </Benefit>
          ))}
        </BenefitsGrid>
      </BenefitsSection>
    </Container>
  );
}