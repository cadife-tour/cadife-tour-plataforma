import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { Header } from "@/features/marketing/Header/Header";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  localStorage.removeItem("cadife_locale");
});

describe("Issue #2 — Header & Navigation", () => {
  it("renderiza os quatro links principais com âncoras corretas", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    expect(screen.getAllByRole("link", { name: "Viagens" })[0]).toHaveAttribute(
      "href",
      "/#destinos"
    );
    expect(screen.getAllByRole("link", { name: "Depoimentos" })[0]).toHaveAttribute(
      "href",
      "/#depoimentos"
    );
    expect(screen.getAllByRole("link", { name: "Contato" })[0]).toHaveAttribute(
      "href",
      "/#contato"
    );
    expect(screen.getAllByRole("link", { name: "Sobre nós" })[0]).toHaveAttribute(
      "href",
      "/#agencia"
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

  it("Escape no LanguageSelector retorna o foco ao botão gatilho", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    const trigger = screen.getByRole("button", { name: /idioma selecionado/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });

  it("selecionar um idioma fecha o dropdown e retorna o foco ao botão gatilho", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    const trigger = screen.getByRole("button", { name: /idioma selecionado/i });
    fireEvent.click(trigger);

    const option = screen.getByRole("option", { name: /english/i });
    fireEvent.click(option);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("menu mobile fechado não expõe links/CTA interativos (nem no DOM)", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    // Apenas o link/CTA de desktop (fora do painel mobile) deve existir.
    expect(screen.getAllByRole("link", { name: "Viagens" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: /planeje sua viagem no whatsapp/i })).toHaveLength(
      1
    );
  });

  it("menu mobile aberto expõe os links e o CTA para navegação por teclado", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    fireEvent.click(menuButton);

    expect(screen.getAllByRole("link", { name: "Viagens" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /planeje sua viagem no whatsapp/i }).length).toBe(2);
  });

  it("scroll lock é aplicado ao abrir, removido ao fechar e removido ao desmontar", () => {
    const { unmount } = render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("ao atingir o breakpoint desktop, fecha o menu mobile e restaura o scroll", () => {
    type ChangeListener = (event: Partial<MediaQueryListEvent>) => void;
    const listenerBox: { current: ChangeListener | null } = { current: null };
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      media: "(min-width: 1024px)",
      addEventListener: (_event: string, listener: ChangeListener) => {
        listenerBox.current = listener;
      },
      removeEventListener: () => {
        listenerBox.current = null;
      },
    });
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaMock;

    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    expect(listenerBox.current).not.toBeNull();
    act(() => {
      listenerBox.current?.({ matches: true });
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");

    window.matchMedia = originalMatchMedia;
  });

  it("active state: marca aria-current apenas na seção visível, sem depender do href", () => {
    const observedCallbacks: Array<(entries: Partial<IntersectionObserverEntry>[]) => void> = [];
    class MockIntersectionObserver {
      constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        observedCallbacks.push(callback);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    const originalIO = window.IntersectionObserver;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.IntersectionObserver = MockIntersectionObserver as any;

    const destinos = document.createElement("div");
    destinos.id = "destinos";
    document.body.appendChild(destinos);

    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    expect(screen.getAllByRole("link", { name: "Viagens" })[0]).not.toHaveAttribute("aria-current");

    act(() => {
      observedCallbacks[0]?.([{ target: destinos, isIntersecting: true, intersectionRatio: 1 }]);
    });

    expect(screen.getAllByRole("link", { name: "Viagens" })[0]).toHaveAttribute(
      "aria-current",
      "location"
    );
    expect(screen.getAllByRole("link", { name: "Contato" })[0]).not.toHaveAttribute("aria-current");

    document.body.removeChild(destinos);
    window.IntersectionObserver = originalIO;
  });

  it("fora da homepage (sem seções no DOM), nenhum item fica ativo e não gera erro", () => {
    expect(() =>
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      )
    ).not.toThrow();

    screen.getAllByRole("link", { name: "Viagens" }).forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  it("logo e botão de menu tratam prefers-reduced-motion sem perder funcionalidade", () => {
    render(
      <LocaleProvider>
        <Header />
      </LocaleProvider>
    );

    const logo = screen.getByAltText("CADIFE Tour");
    expect(logo.className).toMatch(/motion-reduce:transform-none/);
    expect(logo.className).toMatch(/motion-reduce:transition-none/);

    const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
    expect(menuButton.className).toMatch(/motion-reduce:transition-none/);
  });
});
