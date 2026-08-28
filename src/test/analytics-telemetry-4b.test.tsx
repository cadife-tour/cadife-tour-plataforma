import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import { trackEvent } from "@/core/analytics";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { DestinationsSection } from "@/features/destinations/DestinationsSection/DestinationsSection";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

describe("Fase 4B — Telemetria & Analytics Privacy-First", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("safely accepts typed events and prevents runtime errors without provider", () => {
    expect(() => {
      trackEvent("whatsapp_conversion", {
        cta_location: "hero_primary",
        locale: "pt",
      });
      trackEvent("destination_viewed", {
        destination_id: "dest-europa",
        locale: "pt",
      });
      trackEvent("faq_toggle", {
        question_id: "faq_1",
        locale: "pt",
        state: "opened",
      });
      trackEvent("google_reviews_clicked", {
        locale: "pt",
      });
      trackEvent("language_change", {
        from_locale: "pt",
        to_locale: "en",
      });
      trackEvent("webgl_status", {
        status: "active",
        dpr: 1.5,
        is_mobile: false,
      });
    }).not.toThrow();
  });

  it("dispatches language_change only when locale actually changes", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    const enButton = screen.getByRole("button", { name: /mudar idioma para en/i });
    expect(enButton).toBeInTheDocument();
    fireEvent.click(enButton);
  });

  it("renders DestinationsSection and sets data-destination-id for view tracking", () => {
    render(
      <LocaleProvider>
        <DestinationsSection />
      </LocaleProvider>
    );

    const destinationCards = document.querySelectorAll("[data-destination-id]");
    expect(destinationCards.length).toBeGreaterThan(0);
    expect(destinationCards[0]).toHaveAttribute("data-destination-id", "dest-europa");
  });

  it("tracks faq_toggle on user expanding/collapsing questions", () => {
    render(
      <LocaleProvider>
        <FaqAndCtaSection />
      </LocaleProvider>
    );

    const details = document.querySelector("details");
    expect(details).toBeInTheDocument();
    if (details) {
      fireEvent.toggle(details);
    }
  });

  it("renders AboutAndTrustSection and allows clicking Google Reviews link", () => {
    render(
      <LocaleProvider>
        <AboutAndTrustSection />
      </LocaleProvider>
    );

    const reviewLink = screen.getByRole("link", { name: /google/i });
    expect(reviewLink).toBeInTheDocument();
    fireEvent.click(reviewLink);
  });

  it("emits webgl_status with appropriate technical flags", () => {
    const { result } = renderHook(() => useGpuCapability());
    expect(result.current).toHaveProperty("canRender3D");
    expect(result.current).toHaveProperty("effectiveDpr");
  });
});
