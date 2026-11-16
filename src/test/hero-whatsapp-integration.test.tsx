import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { contactInfo, DEFAULT_CADIFE_WHATSAPP } from "@/content/data";
import * as analytics from "@/core/analytics";
import { TravelOverlay } from "@/features/travel-experience/components/TravelOverlay";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import { Footer } from "@/features/marketing/Footer/Footer";
import { createWhatsAppUrl } from "@/shared/utils/whatsapp";
import type { Locale } from "@/content/types";

const configuredPhone = contactInfo.whatsappNumber;

afterEach(() => {
  contactInfo.whatsappNumber = configuredPhone;
  vi.restoreAllMocks();
});

describe("PR #68 — Hero conversion integration", () => {
  it.each<{ locale: Locale; intro: string; destination: string }>([
    { locale: "pt", intro: "Planejar Minha Viagem", destination: "Quero conhecer esta opção" },
    { locale: "en", intro: "Plan My Journey", destination: "Explore this option" },
    { locale: "es", intro: "Planificar Mi Viaje", destination: "Quiero conocer esta opción" },
  ])(
    "uses shared contextual links and one analytics event in $locale",
    ({ locale, intro, destination }) => {
      const track = vi.spyOn(analytics, "trackEvent");
      const view = render(
        <LocaleProvider initialLocale={locale}>
          <TravelOverlay progress={0} />
        </LocaleProvider>
      );
      const introLink = screen.getByRole("link", { name: new RegExp(intro) });
      expect(introLink).toHaveAttribute(
        "href",
        createWhatsAppUrl({ source: "hero_airplane_intro", locale })
      );
      expect(introLink).toHaveAttribute("target", "_blank");
      expect(introLink).toHaveAttribute("rel", "noopener noreferrer");
      fireEvent.click(introLink);
      expect(track).toHaveBeenCalledExactlyOnceWith("whatsapp_conversion", {
        cta_location: "hero_airplane_intro",
        locale,
      });

      track.mockClear();
      view.rerender(
        <LocaleProvider initialLocale={locale}>
          <TravelOverlay progress={1} staticFallback />
        </LocaleProvider>
      );
      const destinationLink = screen.getByRole("link", { name: new RegExp(destination) });
      expect(destinationLink).toHaveAttribute(
        "href",
        createWhatsAppUrl({ destination: "chile", locale })
      );
      expect(destinationLink.getAttribute("href")).toContain(DEFAULT_CADIFE_WHATSAPP);
      fireEvent.click(destinationLink);
      expect(track).toHaveBeenCalledExactlyOnceWith("whatsapp_conversion", {
        cta_location: "hero_chile_destination",
        destination: "chile",
        locale,
      });
    }
  );

  it.each([0, 1])("uses contact fallback without a false conversion at progress %s", (progress) => {
    contactInfo.whatsappNumber = undefined;
    const track = vi.spyOn(analytics, "trackEvent");
    render(
      <LocaleProvider initialLocale="pt">
        <TravelOverlay progress={progress} staticFallback />
      </LocaleProvider>
    );
    const cta = screen.getByRole("link", { name: /ir para seção de contato/i });
    expect(cta).toHaveAttribute("href", "#contato");
    expect(cta).not.toHaveAttribute("target");
    expect(cta).not.toHaveAccessibleName(/WhatsApp|nova aba/i);
    fireEvent.click(cta);
    expect(track).not.toHaveBeenCalled();
  });

  it("uses the confirmed email and corrected Spanish FAQ labels", () => {
    render(
      <LocaleProvider initialLocale="es">
        <FaqAndCtaSection phoneNumber={null} />
        <Footer />
      </LocaleProvider>
    );
    expect(screen.getAllByText("Preguntas Frecuentes")).toHaveLength(2);
    const email = screen.getByRole("link", { name: /Contactar Asesor por Correo/ });
    expect(email.getAttribute("href")).toContain("mailto:contato@cadifetour.com?");
    expect(email).toHaveAccessibleName(/contato@cadifetour\.com$/);
    const message = new URL(
      createWhatsAppUrl({ destination: "italia", locale: "es" })
    ).searchParams.get("text");
    expect(message).toContain("CADIFE Tour y me gustaría");
  });
});
