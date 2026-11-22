import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import {
  createWhatsAppUrl,
  destinationSpecificMessages,
  sectionSpecificMessages,
} from "@/shared/utils/whatsapp";
import type { Locale } from "@/content/types";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import * as analytics from "@/core/analytics";
import {
  DESTINATION_SCENES,
  getExperiencePhases,
} from "@/features/travel-experience/config/travelExperienceConfig";

describe("Fase 1 & 2 — WhatsAppCta & Hero Engine Multi-Mode", () => {
  it("Fase 1: getExperiencePhases returns correct structure for 'single' mode", () => {
    const single = getExperiencePhases("single", "chile");
    expect(single.scrollHeightVh).toBe(500);
    expect(single.destination?.id).toBe("chile");
    expect(single.phases.intro.start).toBe(0.0);
    expect(single.phases.destination.end).toBe(1.0);
  });

  it("Fase 1: getExperiencePhases returns correct structure for 'full' mode", () => {
    const full = getExperiencePhases("full", "chile");
    expect(full.scrollHeightVh).toBe(800);
    expect(full.destination?.id).toBe("chile");
    expect(full.phases.resort?.end).toBe(1.0);
  });

  it("Fase 1: DESTINATION_SCENES contains official destinations and metadata", () => {
    expect(DESTINATION_SCENES.chile).toBeDefined();
    expect(DESTINATION_SCENES.chile?.country).toBe("Chile");
    expect(DESTINATION_SCENES.argentina).toBeDefined();
    expect(DESTINATION_SCENES.peru).toBeDefined();
    expect(DESTINATION_SCENES.cruzeiros).toBeDefined();
  });

  it("Fase 2: createWhatsAppUrl generates destination-specific high-converting copy for Chile", () => {
    const url = createWhatsAppUrl({
      destination: "chile",
      source: "hero_chile_destination",
      locale: "pt",
    });

    const expectedText = encodeURIComponent(
      "Olá! Estava conhecendo o Chile no site da CADIFE Tour e gostaria de conversar sobre essa viagem."
    );
    expect(url).toContain(expectedText);
    expect(url).toContain("5547996714510");
  });

  it("Fase 2: createWhatsAppUrl generates destination-specific copy in English", () => {
    const url = createWhatsAppUrl({
      destination: "chile",
      source: "hero_chile_destination",
      locale: "en",
    });

    const expectedText = encodeURIComponent(
      "Hello! I was exploring Chile on the CADIFE Tour website and would like to talk about this trip."
    );
    expect(url).toContain(expectedText);
  });

  it("Fase 2: WhatsAppCta component renders accessible link with target, rel and SVG icon", () => {
    render(
      <LocaleProvider>
        <WhatsAppCta destination="chile" source="hero_chile_destination">
          Quero Conhecer o Chile
        </WhatsAppCta>
      </LocaleProvider>
    );

    const link = screen.getByRole("link", { name: /conversar sobre chile no whatsapp/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.getAttribute("href")).toContain("https://wa.me/5547996714510");
  });

  it("Fase 2: WhatsAppCta dispatches analytics event with cta_location and destination", () => {
    const trackSpy = vi.spyOn(analytics, "trackEvent");

    render(
      <LocaleProvider>
        <WhatsAppCta destination="chile" source="hero_chile_destination">
          Quero Conhecer o Chile
        </WhatsAppCta>
      </LocaleProvider>
    );

    const link = screen.getByRole("link", { name: /conversar sobre chile no whatsapp/i });
    fireEvent.click(link);

    expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
      cta_location: "hero_chile_destination",
      destination: "chile",
      locale: "pt",
    });
  });

  it("Fase 3: TravelOverlay renders intro phase and scroll hint at progress 0.05", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.05} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(screen.getByText(/uma nova experiência\. uma nova memória\./i)).toBeInTheDocument();
    expect(screen.getByText(/role para/i)).toBeInTheDocument();
  });

  it("Fase 3: TravelOverlay renders clouds transition phase at progress 0.57", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.57} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(screen.getByText(/cruzando novos céus/i)).toBeInTheDocument();
    expect(screen.getByText(/além das nuvens, novos caminhos\./i)).toBeInTheDocument();
  });

  it("Fase 3: TravelOverlay renders Chile destination, copy and WhatsApp CTA at progress 0.85", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.85} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(screen.getByText(/chile: diante da imensidão dos andes\./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quero conhecer esta opção/i })).toBeInTheDocument();
    expect(screen.getByText(/atendimento 100% humano/i)).toBeInTheDocument();
    expect(screen.getByText(/roteiros personalizados/i)).toBeInTheDocument();
  });

  it("Fase 4: TravelOverlay renders accessible static editorial layout when isStaticFallback=true", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay
          progress={1.0}
          mode="single"
          targetDestination="chile"
          isStaticFallback={true}
        />
      </LocaleProvider>
    );

    // Deve exibir o badge, headline e card de destino estático
    expect(screen.getByText(/chile: diante da imensidão dos andes\./i)).toBeInTheDocument();

    // CTA de conversão funcional para o WhatsApp no modo estático
    const cta = screen.getByRole("link", { name: /quero conhecer esta opção/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("target", "_blank");

    // Selos de confiança
    expect(screen.getByText(/atendimento 100% humano/i)).toBeInTheDocument();
    expect(screen.getByText(/roteiros personalizados/i)).toBeInTheDocument();
    expect(screen.getByText(/suporte 24h na viagem/i)).toBeInTheDocument();
  });
});

describe("Issue #27 — Mensagens contextuais por destino e seção", () => {
  const locales: readonly Locale[] = ["pt", "en", "es"];

  it("gera mensagem específica para todos os 10 destinos oficiais em PT, EN e ES", () => {
    const destinationIds = Object.keys(DESTINATION_SCENES);
    expect(destinationIds).toHaveLength(10);

    for (const locale of locales) {
      for (const destId of destinationIds) {
        const scene = DESTINATION_SCENES[destId];
        expect(scene).toBeDefined();
        const url = createWhatsAppUrl({
          destination: scene!.whatsappContext,
          source: `hero_${destId}_destination`,
          locale,
        });
        const expectedKey = destId === "resorts" ? "resort" : destId;
        const expectedMsg = destinationSpecificMessages[locale][expectedKey];
        expect(expectedMsg).toBeTruthy();
        expect(url).toBe(`https://wa.me/5547996714510?text=${encodeURIComponent(expectedMsg!)}`);
      }
    }
  });

  it("normaliza aliases de destino ('resorts' -> 'resort' e 'rio-de-janeiro' -> 'brasil') em PT, EN e ES", () => {
    for (const locale of locales) {
      expect(createWhatsAppUrl({ destination: "resorts", locale })).toBe(
        createWhatsAppUrl({ destination: "resort", locale })
      );
      expect(createWhatsAppUrl({ destination: "rio-de-janeiro", locale })).toBe(
        createWhatsAppUrl({ destination: "brasil", locale })
      );
    }
  });

  it("gera mensagens contextuais codificadas para todas as seções principais em PT, EN e ES sem dados pessoais", () => {
    const sections = [
      "header",
      "header_nav",
      "hero",
      "how_it_works",
      "contact",
      "faq_banner",
      "footer",
    ] as const;

    for (const locale of locales) {
      for (const source of sections) {
        const url = createWhatsAppUrl({ source, locale });
        const expectedMsg = sectionSpecificMessages[locale][source];
        expect(expectedMsg).toBeTruthy();
        expect(url).toBe(`https://wa.me/5547996714510?text=${encodeURIComponent(expectedMsg!)}`);
        expect(url).not.toMatch(/email=|phone=|name=/i);
      }
    }
  });
});
