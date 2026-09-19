import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { createWhatsAppUrl } from "@/shared/utils/whatsapp";
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
    expect(screen.getByText(/role para iniciar sua viagem/i)).toBeInTheDocument();
  });

  it("Fase 3: TravelOverlay renders window transition phase at progress 0.22", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.22} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(screen.getByText(/o mundo começa do outro lado da janela\./i)).toBeInTheDocument();
    expect(screen.getByText(/o começo da jornada/i)).toBeInTheDocument();
  });

  it("Fase 3: TravelOverlay renders clouds transition phase at progress 0.40", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.4} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(screen.getByText(/cruzando novos céus/i)).toBeInTheDocument();
    expect(
      screen.getByText(/atravessando horizontes em direção ao extraordinário\./i)
    ).toBeInTheDocument();
  });

  it("Fase 3: TravelOverlay renders Chile destination, copy and WhatsApp CTA at progress 0.85", async () => {
    const { TravelOverlay } = await import("@/features/travel-experience/components/TravelOverlay");
    render(
      <LocaleProvider>
        <TravelOverlay progress={0.85} mode="single" targetDestination="chile" />
      </LocaleProvider>
    );

    expect(
      screen.getByText(/chile: onde a imponência dos andes encontra o infinito\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /quero conhecer o chile no whatsapp/i })
    ).toBeInTheDocument();
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
    expect(screen.getByText(/uma nova experiência\. uma nova memória\./i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /sua próxima grande jornada planejada com excelência humana\./i
    );
    expect(
      screen.getByText(/chile: onde a imponência dos andes encontra o infinito\./i)
    ).toBeInTheDocument();

    // CTA de conversão funcional para o WhatsApp no modo estático
    const cta = screen.getByRole("link", { name: /quero conhecer o chile no whatsapp/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("target", "_blank");

    // Selos de confiança
    expect(screen.getByText(/atendimento 100% humano/i)).toBeInTheDocument();
    expect(screen.getByText(/roteiros personalizados/i)).toBeInTheDocument();
    expect(screen.getByText(/suporte 24h na viagem/i)).toBeInTheDocument();
  });
});
