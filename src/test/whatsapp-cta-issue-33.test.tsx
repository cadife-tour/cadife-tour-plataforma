import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { createWhatsAppUrl, DEFAULT_CADIFE_WHATSAPP } from "@/shared/utils/whatsapp";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import * as analytics from "@/core/analytics";
import { Header } from "@/features/marketing/Header/Header";
import { Footer } from "@/features/marketing/Footer/Footer";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import { HowItWorksSection } from "@/features/marketing/HowItWorksSection/HowItWorksSection";
import { DestinationsSection } from "@/features/destinations/DestinationsSection/DestinationsSection";

describe("Issue #33 — Componente Reutilizável de CTA para WhatsApp", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Centralização do número e URL oficial", () => {
    it("utiliza o número oficial centralizado da CADIFE Tour (5547996714510)", () => {
      const url = createWhatsAppUrl({ source: "header" });
      expect(url).toContain(`wa.me/${DEFAULT_CADIFE_WHATSAPP}`);
    });

    it("gera links com protocolo HTTPS e codificação URI segura", () => {
      const url = createWhatsAppUrl({
        destination: "chile",
        locale: "pt",
      });
      expect(url.startsWith("https://wa.me/")).toBe(true);
      expect(url).toContain("?text=");
      expect(decodeURIComponent(url)).toContain("Chile");
    });

    it("retorna fallback seguro '#contato' quando o número de telefone for nulo, ausente ou inválido", () => {
      const fallbackUrlNull = createWhatsAppUrl({ phoneNumber: null });
      expect(fallbackUrlNull).toBe("#contato");

      const fallbackUrlInvalid = createWhatsAppUrl({ phoneNumber: "0000000000" });
      expect(fallbackUrlInvalid).toBe("#contato");

      const fallbackUrlShort = createWhatsAppUrl({ phoneNumber: "123" });
      expect(fallbackUrlShort).toBe("#contato");
    });
  });

  describe("2. Mensagens contextuais por destino, seção e idioma", () => {
    it("gera mensagem contextual específica para destino conhecido (ex: Chile)", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta destination="chile" source="hero" />
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toContain(
        encodeURIComponent(
          "Olá! Estava conhecendo o Chile no site da CADIFE Tour e gostaria de conversar sobre essa viagem."
        )
      );
    });

    it("gera mensagem contextual interpolando destinationTitle dinâmico", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta
            destination="europa-classica"
            destinationTitle="Europa Clássica"
            source="card"
          />
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(decodeURIComponent(link.getAttribute("href") || "")).toContain("Europa Clássica");
    });

    it("respeita customMessage quando informada explicitamente", () => {
      const custom = "Gostaria de uma cotação para viagem em família.";
      render(
        <LocaleProvider>
          <WhatsAppCta customMessage={custom} source="contato">
            Falar com Atendente
          </WhatsAppCta>
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toContain(encodeURIComponent(custom));
    });

    it("gera mensagem e aria-label traduzidos quando locale for 'en'", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta destination="chile" locale="en" source="hero" />
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-label", "Chat about chile on WhatsApp (opens in new tab)");
      expect(decodeURIComponent(link.getAttribute("href") || "")).toContain(
        "Hello! I was exploring Chile"
      );
    });

    it("gera mensagem e aria-label traduzidos quando locale for 'es'", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta destination="chile" locale="es" source="hero" />
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Conversar sobre chile en WhatsApp (abre en nueva pestaña)"
      );
      expect(decodeURIComponent(link.getAttribute("href") || "")).toContain(
        "¡Hola! Estaba conociendo Chile"
      );
    });

    it("garante que Header e Footer renderizam aria-label estritamente traduzidos em EN e ES sem vazar trechos em português", () => {
      // 1. Header em EN
      const { unmount: unmountHeaderEn } = render(
        <LocaleProvider initialLocale="en">
          <Header />
        </LocaleProvider>
      );
      const headerCtaEn = screen.getByRole("link", {
        name: /talk to an advisor on whatsapp \(opens in new tab\)/i,
      });
      expect(headerCtaEn).toBeInTheDocument();
      expect(headerCtaEn.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(headerCtaEn.getAttribute("aria-label")).not.toContain("no WhatsApp");
      unmountHeaderEn();

      // 2. Header em ES
      const { unmount: unmountHeaderEs } = render(
        <LocaleProvider initialLocale="es">
          <Header />
        </LocaleProvider>
      );
      const headerCtaEs = screen.getByRole("link", {
        name: /hablar con un asesor en whatsapp \(abre en nueva pestaña\)/i,
      });
      expect(headerCtaEs).toBeInTheDocument();
      expect(headerCtaEs.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(headerCtaEs.getAttribute("aria-label")).not.toContain("no WhatsApp");
      unmountHeaderEs();

      // 3. Footer em EN
      const { unmount: unmountFooterEn } = render(
        <LocaleProvider initialLocale="en">
          <Footer />
        </LocaleProvider>
      );
      const footerCtaEn = screen.getByRole("link", {
        name: /contact via whatsapp \(opens in new tab\)/i,
      });
      expect(footerCtaEn).toBeInTheDocument();
      expect(footerCtaEn.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(footerCtaEn.getAttribute("aria-label")).not.toContain("no WhatsApp");
      unmountFooterEn();

      // 4. Footer em ES
      render(
        <LocaleProvider initialLocale="es">
          <Footer />
        </LocaleProvider>
      );
      const footerCtaEs = screen.getByRole("link", {
        name: /contactar por whatsapp \(abre en nueva pestaña\)/i,
      });
      expect(footerCtaEs).toBeInTheDocument();
      expect(footerCtaEs.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(footerCtaEs.getAttribute("aria-label")).not.toContain("no WhatsApp");
    });

    it("gera mensagens contextuais distintas para cada seção/origem (Header, Contato/FAQ, Footer, How It Works, Hero)", () => {
      const headerUrl = createWhatsAppUrl({ source: "header_nav" });
      expect(decodeURIComponent(headerUrl)).toContain(
        "Olá! Gostaria de falar com um consultor da CADIFE Tour para planejar minha próxima viagem."
      );

      const footerUrl = createWhatsAppUrl({ source: "footer" });
      expect(decodeURIComponent(footerUrl)).toContain(
        "Olá! Gostaria de tirar dúvidas sobre as opções de viagens da CADIFE Tour com um consultor."
      );

      const faqUrl = createWhatsAppUrl({ source: "faq_banner" });
      expect(decodeURIComponent(faqUrl)).toContain(
        "Olá! Gostaria de receber uma proposta personalizada de roteiro e cotação da CADIFE Tour."
      );

      const howItWorksUrl = createWhatsAppUrl({ source: "how_it_works" });
      expect(decodeURIComponent(howItWorksUrl)).toContain(
        "Olá! Vi como funciona a assessoria no site da CADIFE Tour e gostaria de iniciar meu planejamento."
      );

      const heroAirplaneUrl = createWhatsAppUrl({ source: "hero_airplane_intro" });
      expect(decodeURIComponent(heroAirplaneUrl)).toContain(
        "Olá! Estive no site da CADIFE Tour e gostaria de iniciar o planejamento de uma experiência de viagem sob medida."
      );
    });

    it("formata e interpola destinos dinâmicos não mapeados previamente mesmo sem destinationTitle", () => {
      const greciaUrl = createWhatsAppUrl({ destination: "grecia" });
      expect(decodeURIComponent(greciaUrl)).toContain("Grecia");
      expect(greciaUrl).not.toContain("{destination}");

      const novaZelandiaUrl = createWhatsAppUrl({ destination: "nova-zelandia" });
      expect(decodeURIComponent(novaZelandiaUrl)).toContain("Nova Zelandia");
      expect(novaZelandiaUrl).not.toContain("{destination}");
    });
  });

  describe("3. Variações visuais, tamanhos e design tokens", () => {
    it("aplica estilos primários com vermelho oficial (#DD0B0E) e altura mínima 44px", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta variant="primary" size="md">
            Planeje sua viagem
          </WhatsAppCta>
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveTextContent(/planeje sua viagem/i);
      expect(link).toHaveClass("bg-brand-primary");
      expect(link).toHaveClass("min-h-[44px]");
      expect(link).toHaveClass("text-white");
    });

    it("suporta variantes secondary, glass, outline e link", () => {
      const { rerender } = render(
        <LocaleProvider>
          <WhatsAppCta variant="secondary">Opção Secundária</WhatsAppCta>
        </LocaleProvider>
      );
      expect(screen.getByRole("link")).toHaveClass("bg-surface-elevated");

      rerender(
        <LocaleProvider>
          <WhatsAppCta variant="glass">Opção Glass</WhatsAppCta>
        </LocaleProvider>
      );
      expect(screen.getByRole("link")).toHaveClass("backdrop-blur-md");

      rerender(
        <LocaleProvider>
          <WhatsAppCta variant="outline">Opção Outline</WhatsAppCta>
        </LocaleProvider>
      );
      expect(screen.getByRole("link")).toHaveClass("border-border");

      rerender(
        <LocaleProvider>
          <WhatsAppCta variant="link">Opção Link</WhatsAppCta>
        </LocaleProvider>
      );
      expect(screen.getByRole("link")).toHaveClass("text-brand-accent");
    });

    it("renderiza ícone SVG com aria-hidden por padrão em variantes de botão", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta variant="primary">Botão com Ícone</WhatsAppCta>
        </LocaleProvider>
      );
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("permite ocultar o ícone através de showIcon={false}", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta showIcon={false}>Sem Ícone</WhatsAppCta>
        </LocaleProvider>
      );
      const svg = document.querySelector("svg");
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe("4. Estados de acessibilidade, foco e disabled", () => {
    it("garante atributos seguros de link externo (target=_blank e rel=noopener noreferrer)", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta source="hero">Falar com Consultor</WhatsAppCta>
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("é operável por teclado com ring de focus-visible visível", () => {
      render(
        <LocaleProvider>
          <WhatsAppCta source="hero">Foco Visível</WhatsAppCta>
        </LocaleProvider>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveClass("focus-visible:outline-2");
      expect(link).toHaveClass("focus-visible:outline-brand-accent");
    });

    it("bloqueia navegação, telemetria e cliques quando disabled={true}", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");
      const clickMock = vi.fn();

      render(
        <LocaleProvider>
          <WhatsAppCta disabled={true} onClick={clickMock} source="hero">
            Indisponível
          </WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
      expect(link.getAttribute("href")).toContain("wa.me");
      expect(link).toHaveClass("cursor-not-allowed");
      expect(link).toHaveClass("opacity-50");

      fireEvent.click(link);
      expect(clickMock).not.toHaveBeenCalled();
      expect(trackSpy).not.toHaveBeenCalled();
    });

    it("trata fallback '#contato' de forma segura: mesma aba, sem noopener, sem conversão e com aria-label correto", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");
      const clickMock = vi.fn();

      const { unmount } = render(
        <LocaleProvider>
          <WhatsAppCta phoneNumber={null} onClick={clickMock} source="hero">
            Fale Conosco
          </WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe("#contato");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
      expect(link.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(link.getAttribute("aria-label")).toContain("seção de contato");

      fireEvent.click(link);
      expect(clickMock).toHaveBeenCalled();
      expect(trackSpy).not.toHaveBeenCalled();
      unmount();

      // Sanitiza o aria-label mesmo se o consumidor passar manualmente texto prometendo WhatsApp ou nova aba
      render(
        <LocaleProvider>
          <WhatsAppCta
            phoneNumber={null}
            aria-label="Falar com consultor no WhatsApp (abre em nova aba)"
            source="hero"
          >
            Fale Conosco
          </WhatsAppCta>
        </LocaleProvider>
      );

      const sanitizedLink = screen.getByRole("link");
      expect(sanitizedLink.getAttribute("aria-label")).not.toContain("abre em nova aba");
      expect(sanitizedLink.getAttribute("aria-label")).not.toContain("WhatsApp");
      expect(sanitizedLink.getAttribute("aria-label")).toContain("seção de contato");
    });

    it("harmoniza texto visível e nome acessível no fallback, sem divergência e sem falsas promessas de WhatsApp (WCAG 2.5.3)", () => {
      // 1. Quando o texto visível continha 'no WhatsApp', remove do texto visível e alinha com aria-label
      const { unmount } = render(
        <LocaleProvider>
          <WhatsAppCta phoneNumber={null} source="hero">
            Falar com Consultor no WhatsApp
          </WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      // Texto visível não mente e remove a menção ao WhatsApp
      expect(link.textContent).toBe("Falar com Consultor");
      // Nome acessível contém o texto visível e descreve a ação real
      expect(link.getAttribute("aria-label")).toBe(
        "Falar com Consultor (ir para seção de contato)"
      );
      expect(link.getAttribute("href")).toBe("#contato");
      unmount();

      // 2. Quando elementos filhos aninhados contêm 'no WhatsApp' (ex: DestinationsSection)
      render(
        <LocaleProvider>
          <WhatsAppCta
            destination="europa-classica"
            destinationTitle="Europa Clássica"
            phoneNumber={null}
            source="destination_card"
          >
            <span>Consultar este Roteiro no WhatsApp</span>
            <span aria-hidden="true">→</span>
          </WhatsAppCta>
        </LocaleProvider>
      );

      const destLink = screen.getByRole("link");
      expect(destLink.textContent).toBe("Consultar este Roteiro→");
      expect(destLink.getAttribute("aria-label")).toBe(
        "Consultar este Roteiro (ir para seção de contato)"
      );
    });

    it("impede que o consumidor sobrescreva garantias críticas de segurança e acessibilidade", () => {
      // 1. Não permite sobrescrever target, rel ou href em links externos
      const { unmount } = render(
        <LocaleProvider>
          <WhatsAppCta
            source="hero"
            target="_self"
            rel="author"
            {...({ href: "/pagina-falsa" } as Record<string, string>)}
          >
            CTA Protegido
          </WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveTextContent("CTA Protegido");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toContain("wa.me");
      expect(link.getAttribute("href")).not.toBe("/pagina-falsa");
      unmount();

      // 2. Não permite que consumidor torne um CTA desabilitado focável passando tabIndex={0}
      render(
        <LocaleProvider>
          <WhatsAppCta disabled={true} tabIndex={0} source="hero">
            CTA Desabilitado Protegido
          </WhatsAppCta>
        </LocaleProvider>
      );

      const disabledLink = screen.getByRole("link");
      expect(disabledLink).toHaveTextContent("CTA Desabilitado Protegido");
      expect(disabledLink).toHaveAttribute("tabindex", "-1");
      expect(disabledLink).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("5. Telemetria e Analytics Privacy-First (Sem PII)", () => {
    it("dispara evento 'whatsapp_conversion' com source e destination sem dados pessoais", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <WhatsAppCta destination="chile" destinationTitle="Chile e Andes" source="hero_journey">
            Quero Conhecer
          </WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "hero_journey",
        destination: "Chile e Andes",
        locale: "pt",
      });
    });

    it("não envia destination quando a chamada for institucional/geral (ex: Header ou Footer)", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <WhatsAppCta source="footer">Chamar no WhatsApp</WhatsAppCta>
        </LocaleProvider>
      );

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "footer",
        locale: "pt",
      });
    });
  });

  describe("6. Reutilização real do componente em Header, Hero, Contato e Footer", () => {
    it("Header utiliza WhatsAppCta com source 'header_nav'", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <Header />
        </LocaleProvider>
      );

      const headerCta = screen.getByRole("link", {
        name: /falar com consultor no whatsapp/i,
      });
      expect(headerCta).toBeInTheDocument();
      fireEvent.click(headerCta);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "header_nav",
        locale: "pt",
      });
    });

    it("Footer utiliza WhatsAppCta com source 'footer'", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <Footer />
        </LocaleProvider>
      );

      const footerCta = screen.getByRole("link", {
        name: /chamar no whatsapp/i,
      });
      expect(footerCta).toBeInTheDocument();
      fireEvent.click(footerCta);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "footer",
        locale: "pt",
      });
    });

    it("Contato (FaqAndCtaSection) provê o destino de âncora 'id=contato' e utiliza WhatsAppCta com source 'faq_banner'", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      const { container } = render(
        <LocaleProvider>
          <FaqAndCtaSection />
        </LocaleProvider>
      );

      const contatoTarget = container.querySelector("#contato");
      expect(contatoTarget).toBeInTheDocument();
      expect(contatoTarget).toHaveClass("scroll-mt-24");

      const faqCta = screen.getByRole("link", {
        name: /falar com consultor no whatsapp/i,
      });
      expect(faqCta).toBeInTheDocument();
      fireEvent.click(faqCta);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "faq_banner",
        locale: "pt",
      });
    });

    it("Contato (FaqAndCtaSection) provê canal validado por e-mail e não gera loop circular quando o WhatsApp estiver ausente", () => {
      const { container } = render(
        <LocaleProvider>
          <FaqAndCtaSection phoneNumber={null} />
        </LocaleProvider>
      );

      const banner = container.querySelector("#contato");
      expect(banner).toBeInTheDocument();
      // Não deve prometer WhatsApp no subtítulo quando em fallback
      expect(banner?.textContent).not.toContain("no WhatsApp");
      expect(banner?.textContent).toContain("contato@cadifetour.com.br");

      // Deve oferecer canal validado por email (mailto)
      const emailLink = screen.getByRole("link", {
        name: /falar com consultor por e-mail/i,
      });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.getAttribute("href")).toContain("mailto:contato@cadifetour.com.br");
      // O botão não pode ter href="#contato" (não deve gerar loop circular para si mesmo)
      expect(emailLink.getAttribute("href")).not.toBe("#contato");
    });

    it("HowItWorksSection utiliza WhatsAppCta com source 'how_it_works'", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <HowItWorksSection />
        </LocaleProvider>
      );

      const howItWorksCta = screen.getByRole("link", {
        name: /iniciar meu planejamento no whatsapp/i,
      });
      expect(howItWorksCta).toBeInTheDocument();
      fireEvent.click(howItWorksCta);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "how_it_works",
        locale: "pt",
      });
    });

    it("DestinationsSection utiliza WhatsAppCta com source 'destination_card'", () => {
      const trackSpy = vi.spyOn(analytics, "trackEvent");

      render(
        <LocaleProvider>
          <DestinationsSection />
        </LocaleProvider>
      );

      const destinationCtas = screen.getAllByRole("link", {
        name: /consultar.*roteiro.*no whatsapp/i,
      });
      expect(destinationCtas.length).toBeGreaterThan(0);
      fireEvent.click(destinationCtas[0]!);

      expect(trackSpy).toHaveBeenCalledWith("whatsapp_conversion", {
        cta_location: "destination_card",
        destination: "Europa Clássica & Cidades Históricas",
        locale: "pt",
      });
    });
  });
});
