import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { Header } from "@/features/marketing/Header/Header";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";

describe("Issue #2 — Header & Navigation", () => {
  it("renderiza os quatro links principais com âncoras corretas", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    expect(screen.getAllByRole("link", { name: "Viagens" })[0]).toHaveAttribute(
      "href",
      "#destinos"
    );
    expect(screen.getAllByRole("link", { name: "Depoimentos" })[0]).toHaveAttribute(
      "href",
      "#depoimentos"
    );
    expect(screen.getAllByRole("link", { name: "Contato" })[0]).toHaveAttribute("href", "#contato");
    expect(screen.getAllByRole("link", { name: "Sobre nós" })[0]).toHaveAttribute(
      "href",
      "#agencia"
    );
  });

  it("usa labels corretos em PT", () => {
    render(
      <LocaleProvider initialLocale="pt">
        <Header />
      </LocaleProvider>
    );
    expect(screen.getAllByText("Viagens")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Depoimentos")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sobre nós")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Planeje sua viagem")[0]).toBeInTheDocument();
  });

  it("usa labels corretos em EN", () => {
    render(
      <LocaleProvider initialLocale="en">
        <Header />
      </LocaleProvider>
    );
    expect(screen.getAllByText("Travel")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Testimonials")[0]).toBeInTheDocument();
    expect(screen.getAllByText("About Us")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Plan Your Trip")[0]).toBeInTheDocument();
  });

  it("usa labels corretos em ES", () => {
    render(
      <LocaleProvider initialLocale="es">
        <Header />
      </LocaleProvider>
    );
    expect(screen.getAllByText("Viajes")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Testimonios")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sobre Nosotros")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Planifica tu Viaje")[0]).toBeInTheDocument();
  });

  it("CTA do Header utiliza a integração centralizada do WhatsApp (link real, sem URL duplicada)", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const ctas = screen.getAllByRole("link", { name: /planeje sua viagem no whatsapp/i });
    expect(ctas.length).toBeGreaterThan(0);
    ctas.forEach((cta) => {
      expect(cta.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);
      expect(cta.getAttribute("target")).toBe("_blank");
      expect(cta.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  it("logo oficial é renderizado com alt text correto", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const logo = screen.getByAltText("CADIFE Tour");
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("src")).toContain("cadife-logo-horizontal");
  });

  it("menu mobile abre e fecha, atualizando aria-expanded", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /fechar menu de navegação/i })).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("clicar em um link do menu mobile fecha o menu", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileLinks = screen.getAllByRole("link", { name: "Viagens" });
    fireEvent.click(mobileLinks[mobileLinks.length - 1]!);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape fecha o menu mobile e retorna o foco ao botão", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(menuButton);
  });

  it("botão de menu possui aria-controls apontando para o painel mobile", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    const controlsId = menuButton.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(document.getElementById(controlsId!)).toBeInTheDocument();
  });

  it("não introduz regressão no LanguageSelector (dropdown continua funcional)", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    const trigger = screen.getByRole("button", { name: /idioma selecionado/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
