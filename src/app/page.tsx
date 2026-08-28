import { HeroSection } from "@/features/marketing/HeroSection/HeroSection";
import { DestinationsSection } from "@/features/destinations/DestinationsSection/DestinationsSection";
import { HowItWorksSection } from "@/features/marketing/HowItWorksSection/HowItWorksSection";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section: Decolagem e Proposta de Valor */}
      <HeroSection />

      {/* 2. Destinos & Roteiros Híbridos: Inspiração + Informação Objetiva */}
      <DestinationsSection />

      {/* 3. Como Funciona: Processo de Consultoria em 4 Passos */}
      <HowItWorksSection />

      {/* 4. A Agência & Confiança: Diferenciais, Prova Social e Transparência */}
      <AboutAndTrustSection />

      {/* 5. Dúvidas Frequentes & Banner Final de Conversão */}
      <FaqAndCtaSection />
    </div>
  );
}
