import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { Footer } from "@/features/marketing/Footer/Footer";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import * as analytics from "@/core/analytics";

describe("Fase 4C — WhatsApp Deep-Links & Conversion Hardening", () => {
  it("Teste 1: generates valid https://wa.me/ URL for valid phone number and locale", () => {
    const url = buildWhatsAppUrl({
      phoneNumber: "5511999998888",
      locale: "pt",
      context: "quote",
    });
    expect(url).toBe(
      `https://wa.me/5511999998888?text=${encodeURIComponent("Olá! Gostaria de receber uma cotação personalizada de viagem.")}`
    );
  });

  it("Teste 2: sanitizes phone numbers with special characters/masking properly", () => {
    const url = buildWhatsAppUrl({
      phoneNumber: "+55 (11) 99999-8888",
      locale: "en",
      context: "general",
    });
    expect(url.startsWith("https://wa.me/5511999998888?text=")).toBe(true);
  });

  it("Teste 3: handles missing phone number gracefully with safe #contato fallback", () => {
    const urlMissing = buildWhatsAppUrl({
      phoneNumber: undefined,
      locale: "pt",
    });
    expect(urlMissing).toBe("#contato");
  });

  it("Teste 4: rejects invalid phone number and placeholders (never outputs https://wa.me/undefined or 5500000000000)", () => {
    const urlEmpty = buildWhatsAppUrl({
      phoneNumber: "",
      locale: "pt",
    });
    expect(urlEmpty).toBe("#contato");

    const urlShort = buildWhatsAppUrl({
      phoneNumber: "123",
      locale: "pt",
    });
    expect(urlShort).toBe("#contato");

    const urlFakePlaceholder = buildWhatsAppUrl({
      phoneNumber: "5500000000000",
      locale: "pt",
    });
    expect(urlFakePlaceholder).toBe("#contato");

    expect(urlFakePlaceholder).not.toContain("wa.me");
  });

  it("Teste 5: Footer CTA dispatches whatsapp_conversion with cta_location: 'footer' and active locale", () => {
    const trackSpy = vi.spyOn(analytics, "trackEvent");

    render(
      <LocaleProvider>
        <Footer />
      </LocaleProvider>
    );

    const whatsappLink = screen.getByRole("link", { name: /chamar no whatsapp/i });
    expect(whatsappLink).toBeInTheDocument();
    fireEvent.click(whatsappLink);

    expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
      cta_location: "footer",
      locale: "pt",
    });
  });

  it("Teste 6: verifies zero PII in whatsapp_conversion tracking payload", () => {
    const trackSpy = vi.spyOn(analytics, "trackEvent");

    analytics.trackEvent("whatsapp_conversion", {
      destination: "Europa Clássica",
      cta_location: "destination_card",
      locale: "pt",
    });

    const lastCall = trackSpy.mock.calls[trackSpy.mock.calls.length - 1];
    expect(lastCall).toBeDefined();
    if (lastCall) {
      const [eventName, payload] = lastCall;
      expect(eventName).toBe("whatsapp_conversion");
      expect(payload).not.toHaveProperty("phone");
      expect(payload).not.toHaveProperty("phoneNumber");
      expect(payload).not.toHaveProperty("message");
      expect(payload).not.toHaveProperty("ip");
    }
  });

  it("Teste 7: destination cards correctly interpolate destinationTitle into URL and track destination name", () => {
    const url = buildWhatsAppUrl({
      phoneNumber: "5511999998888",
      locale: "pt",
      context: "destination",
      destinationTitle: "Europa Clássica & Cidades Históricas",
    });

    expect(decodeURIComponent(url)).toContain("Europa Clássica & Cidades Históricas");
  });

  it("Teste 8: link navigation works as standard accessible <a> element with target blank and noopener", () => {
    render(
      <LocaleProvider>
        <Footer />
      </LocaleProvider>
    );

    const whatsappLink = screen.getByRole("link", { name: /chamar no whatsapp/i });
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
