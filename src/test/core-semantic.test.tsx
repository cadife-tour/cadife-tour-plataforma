import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { Header } from "@/features/marketing/Header/Header";
import { HeroSection } from "@/features/marketing/HeroSection/HeroSection";
import { DestinationsSection } from "@/features/destinations/DestinationsSection/DestinationsSection";
import { HowItWorksSection } from "@/features/marketing/HowItWorksSection/HowItWorksSection";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import { Footer } from "@/features/marketing/Footer/Footer";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";

describe("Fase 2 — Core Semântico, i18n e WhatsApp Deep Links", () => {
  it("builds correct contextual WhatsApp deep links across languages", () => {
    const urlPt = buildWhatsAppUrl({
      phoneNumber: "5511999999999",
      locale: "pt",
      context: "destination",
      destinationTitle: "Europa Clássica",
    });
    expect(urlPt).toContain("https://wa.me/5511999999999?text=");
    expect(decodeURIComponent(urlPt)).toContain("Europa Clássica");

    const urlEn = buildWhatsAppUrl({
      phoneNumber: "5511999999999",
      locale: "en",
      context: "quote",
    });
    expect(decodeURIComponent(urlEn)).toContain("request a tailored travel proposal");
  });

  it("renders all Core Semântico sections with accessibility and without errors", () => {
    render(
      <LocaleProvider>
        <Header />
        <HeroSection />
        <DestinationsSection />
        <HowItWorksSection />
        <AboutAndTrustSection />
        <FaqAndCtaSection />
        <Footer />
      </LocaleProvider>
    );

    // 1. Heading 1 único e semântico
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    // 2. Links de navegação e seções presentes
    expect(screen.getByRole("navigation", { name: /navegação principal/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /roteiros e destinos planejados/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /como funciona a assessoria cadife tour/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /por que planejar sua viagem com a cadife tour/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dúvidas comuns sobre nossos serviços/i })).toBeInTheDocument();
  });
});
