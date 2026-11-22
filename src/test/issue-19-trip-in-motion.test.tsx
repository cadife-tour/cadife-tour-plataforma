import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { LandingSections } from "@/features/marketing/LandingSections";
import { TripInMotionSection } from "@/features/marketing/TripInMotionSection/TripInMotionSection";

describe("Issue #19 — Seção Sua Viagem em Movimento", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza copy oficial em PT, semântica h2 e scroll-mt-24 sem h1 nem vídeo/canvas", () => {
    const { container } = render(
      <LocaleProvider initialLocale="pt">
        <TripInMotionSection />
      </LocaleProvider>
    );

    const section = container.querySelector("#sua-viagem-em-movimento");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("scroll-mt-24");

    expect(
      screen.getByRole("heading", { level: 2, name: "Sua viagem em movimento." })
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText("Escolha o horizonte. A gente cuida do caminho.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Do primeiro sonho ao último detalhe, desenhamos viagens nacionais e internacionais do seu jeito."
      )
    ).toBeInTheDocument();

    expect(section?.querySelector("video")).not.toBeInTheDocument();
    expect(section?.querySelector("canvas")).not.toBeInTheDocument();

    const whatsappCta = screen.getByRole("link", {
      name: "Planeje sua viagem no WhatsApp (abre em nova aba)",
    });
    expect(whatsappCta.getAttribute("href")).toContain("https://wa.me/5547996714510");

    const exploreLink = screen.getByRole("link", { name: "Explorar destinos" });
    expect(exploreLink).toHaveAttribute("href", "#destinos");
  });

  it("renderiza corretamente em EN e ES via LocaleProvider", () => {
    const { unmount } = render(
      <LocaleProvider initialLocale="en">
        <TripInMotionSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Your journey in motion." })
    ).toBeInTheDocument();
    expect(screen.getByText("Choose the horizon. We take care of the way.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Plan your trip on WhatsApp (opens in new tab)" })
    ).toBeInTheDocument();
    unmount();

    render(
      <LocaleProvider initialLocale="es">
        <TripInMotionSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Tu viaje en movimiento." })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Elige el horizonte. Nosotros cuidamos el camino.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Planifica tu viaje por WhatsApp (abre en nueva pestaña)" })
    ).toBeInTheDocument();
  });

  it("mantém conteúdo visível sob prefers-reduced-motion: reduce", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <LocaleProvider initialLocale="pt">
        <TripInMotionSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Sua viagem em movimento." })
    ).toBeVisible();
    expect(container.querySelectorAll(".opacity-0")).toHaveLength(0);
  });

  it("posiciona #sua-viagem-em-movimento imediatamente antes de #destinos em LandingSections", () => {
    const { container } = render(
      <LocaleProvider initialLocale="pt">
        <LandingSections />
      </LocaleProvider>
    );

    const tripSection = container.querySelector("#sua-viagem-em-movimento");
    const destinationsSection = container.querySelector("#destinos");
    expect(tripSection).toBeInTheDocument();
    expect(destinationsSection).toBeInTheDocument();

    const position = tripSection!.compareDocumentPosition(destinationsSection!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
