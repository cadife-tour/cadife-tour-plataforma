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

  describe("active state via IntersectionObserver (scroll)", () => {
    type MockEntry = Partial<IntersectionObserverEntry>;
    type MockCallback = (entries: MockEntry[]) => void;

    const SECTION_IDS = ["destinos", "depoimentos", "contato", "agencia"] as const;
    const LABELS: Record<(typeof SECTION_IDS)[number], string> = {
      destinos: "Viagens",
      depoimentos: "Depoimentos",
      contato: "Contato",
      agencia: "Sobre nós",
    };

    let observerOptions: IntersectionObserverInit | undefined;
    let observedCallbacks: MockCallback[];
    let originalIO: typeof window.IntersectionObserver;
    let sections: Record<string, HTMLElement>;

    const setup = () => {
      observerOptions = undefined;
      observedCallbacks = [];
      class MockIntersectionObserver {
        constructor(callback: MockCallback, options?: IntersectionObserverInit) {
          observedCallbacks.push(callback);
          observerOptions = options;
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      }
      originalIO = window.IntersectionObserver;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.IntersectionObserver = MockIntersectionObserver as any;

      sections = {};
      SECTION_IDS.forEach((id) => {
        const el = document.createElement("div");
        el.id = id;
        document.body.appendChild(el);
        sections[id] = el;
      });
    };

    const teardown = () => {
      SECTION_IDS.forEach((id) => document.body.removeChild(sections[id]!));
      window.IntersectionObserver = originalIO;
    };

    afterEach(() => {
      teardown();
    });

    const intersect = (sectionId: string, isIntersecting: boolean, intersectionRatio = 1) => {
      act(() => {
        observedCallbacks[0]?.([
          { target: sections[sectionId], isIntersecting, intersectionRatio },
        ]);
      });
    };

    const expectOnlyActive = (activeId: string | null, getLink: (name: string) => HTMLElement) => {
      SECTION_IDS.forEach((id) => {
        const link = getLink(LABELS[id]);
        if (id === activeId) {
          expect(link).toHaveAttribute("aria-current", "location");
        } else {
          expect(link).not.toHaveAttribute("aria-current");
        }
      });
    };

    it("usa rootMargin estreito com threshold 0 (faixa curta incompatível com threshold proporcional alto)", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      expect(observerOptions).toMatchObject({
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      });
    });

    it("ativa cada um dos quatro itens (desktop) quando sua seção entra na faixa", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );
      const getLink = (name: string) => screen.getAllByRole("link", { name })[0]!;

      SECTION_IDS.forEach((id) => {
        intersect(id, true);
        expectOnlyActive(id, getLink);
      });
    });

    it("isIntersecting: false não atualiza o estado ativo (nenhuma ativação indevida)", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );
      const getLink = (name: string) => screen.getAllByRole("link", { name })[0]!;

      intersect("destinos", true);
      expectOnlyActive("destinos", getLink);

      intersect("depoimentos", false);
      expectOnlyActive("destinos", getLink);
    });

    it("transição sequencial ao rolar para baixo: Viagens → Depoimentos → Contato → Sobre nós, sem estado preso", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );
      const getLink = (name: string) => screen.getAllByRole("link", { name })[0]!;

      for (const id of SECTION_IDS) {
        intersect(id, true);
        expectOnlyActive(id, getLink);
      }
    });

    it("transição sequencial ao rolar para cima: Sobre nós → Contato → Depoimentos → Viagens", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );
      const getLink = (name: string) => screen.getAllByRole("link", { name })[0]!;

      for (const id of [...SECTION_IDS].reverse()) {
        intersect(id, true);
        expectOnlyActive(id, getLink);
      }
    });

    it("Contato ativo → #agencia entra na faixa → Sobre nós fica ativo e Contato perde aria-current", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );
      const getLink = (name: string) => screen.getAllByRole("link", { name })[0]!;

      intersect("contato", true);
      expect(getLink("Contato")).toHaveAttribute("aria-current", "location");

      intersect("agencia", true);
      expect(getLink("Contato")).not.toHaveAttribute("aria-current");
      expect(getLink("Sobre nós")).toHaveAttribute("aria-current", "location");
    });

    it("reflete o mesmo activeSectionId no menu mobile (Viagens, Contato, Sobre nós)", () => {
      setup();
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
      fireEvent.click(menuButton);

      const getMobileLink = (name: string) => {
        const links = screen.getAllByRole("link", { name });
        return links[links.length - 1]!;
      };

      intersect("destinos", true);
      expect(getMobileLink("Viagens")).toHaveAttribute("aria-current", "location");

      intersect("contato", true);
      expect(getMobileLink("Viagens")).not.toHaveAttribute("aria-current");
      expect(getMobileLink("Contato")).toHaveAttribute("aria-current", "location");

      intersect("agencia", true);
      expect(getMobileLink("Contato")).not.toHaveAttribute("aria-current");
      expect(getMobileLink("Sobre nós")).toHaveAttribute("aria-current", "location");
    });
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

  describe("menu mobile em viewports de baixa altura", () => {
    it("painel interno do menu possui scroll vertical próprio (overflow-y-auto)", () => {
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
      fireEvent.click(menuButton);

      const mobileNav = screen.getByRole("navigation", { name: "Navegação Principal (móvel)" });
      expect(mobileNav.className).toMatch(/overflow-y-auto/);
      expect(mobileNav.className).toMatch(/overscroll-contain/);
    });

    it("usa unidade dvh e diferencia o limite de altura entre mobile (h-16) e sm (h-20)", () => {
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
      fireEvent.click(menuButton);

      const panel = document.getElementById(menuButton.getAttribute("aria-controls")!);
      const mobileNav = screen.getByRole("navigation", { name: "Navegação Principal (móvel)" });

      [panel, mobileNav].forEach((el) => {
        expect(el?.className).toMatch(/max-h-\[calc\(100dvh-4rem\)\]/);
        expect(el?.className).toMatch(/sm:max-h-\[calc\(100dvh-5rem\)\]/);
      });
    });

    it("CTA permanece presente e acessível com o menu aberto, mesmo com scroll interno", () => {
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
      fireEvent.click(menuButton);

      const ctas = screen.getAllByRole("link", { name: /planeje sua viagem no whatsapp/i });
      expect(ctas.length).toBe(2);
      ctas.forEach((cta) => expect(cta).toBeVisible());
    });

    it("body continua recebendo overflow: hidden com o menu aberto em qualquer altura de viewport", () => {
      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const menuButton = screen.getByRole("button", { name: /abrir menu de navegação/i });
      fireEvent.click(menuButton);
      expect(document.body.style.overflow).toBe("hidden");

      fireEvent.click(menuButton);
      expect(document.body.style.overflow).toBe("");
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
