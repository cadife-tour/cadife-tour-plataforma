import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { contactInfo, institutionalInfo } from "@/content/data";
import { Footer } from "@/features/marketing/Footer/Footer";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";
import { CookiesPreferencesView } from "@/features/marketing/CookiesPreferences/CookiesPreferencesView";

describe("Issue #43 — Dados oficiais e legais centralizados", () => {
  it("centraliza os dados fiscais, contatos, Cadastur, redes e links legais em institutionalInfo e contactInfo", () => {
    expect(institutionalInfo.cnpj).toBe("40.357.012/0001-92");
    expect(institutionalInfo.municipalRegistration).toBe("221478");

    expect(institutionalInfo.cadastur.number).toBe("40.357.012/0001-92");
    expect(institutionalInfo.cadastur.validFrom).toBe("2025-01-30");
    expect(institutionalInfo.cadastur.validUntil).toBe("2027-01-30");
    expect(institutionalInfo.cadastur.isPending).toBe(false);
    expect(institutionalInfo.cadastur.verificationUrl).toBe(
      "https://cadastur.turismo.gov.br/hotsite/"
    );

    expect(institutionalInfo.fiscalAddress.formattedLine1).toBe("Rua Gardênias, 242 — Fátima");
    expect(institutionalInfo.fiscalAddress.formattedLine2).toBe("Joinville/SC — CEP 89229-050");

    expect(institutionalInfo.whatsapp.raw).toBe("5547996714510");
    expect(institutionalInfo.whatsapp.formatted).toBe("+55 47 99671-4510");
    expect(institutionalInfo.email).toBe("contato@cadifetour.com");

    expect(institutionalInfo.socialLinks).toEqual([
      {
        id: "instagram",
        name: "Instagram",
        url: "https://www.instagram.com/cadifetour/",
        handle: "@cadifetour",
      },
      {
        id: "facebook",
        name: "Facebook",
        url: "https://www.facebook.com/cadifetour?locale=pt_BR",
        handle: "CADIFE Tour",
      },
      {
        id: "tiktok",
        name: "TikTok",
        url: "https://www.tiktok.com/@cadifetour",
        handle: "@cadifetour",
      },
      {
        id: "youtube",
        name: "YouTube",
        url: "https://www.youtube.com/@CadifeTour",
        handle: "@CadifeTour",
      },
    ]);

    expect(institutionalInfo.legalLinks.privacyPolicyUrl).toBe("https://cadifetour.com/politicas/");
    expect(institutionalInfo.legalLinks.cookiePreferencesUrl).toBe("/preferencias-de-cookies");

    expect(contactInfo.isCadasturPending).toBe(false);
    expect(contactInfo.cadasturNumber).toBe("40.357.012/0001-92");
    expect(contactInfo.address).toBe("Rua Gardênias, 242 — Fátima, Joinville/SC — CEP 89229-050");
  });

  it("Footer exibe contatos oficiais, redes sociais, CNPJ, Inscrição Municipal, Cadastur e links legais", () => {
    render(
      <LocaleProvider initialLocale="pt">
        <Footer />
      </LocaleProvider>
    );

    const phoneLink = screen.getByRole("link", {
      name: /telefone oficial e whatsapp: \+55 47 99671-4510/i,
    });
    expect(phoneLink).toHaveAttribute("href", "tel:+5547996714510");

    const emailLink = screen.getByRole("link", { name: "contato@cadifetour.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:contato@cadifetour.com");

    expect(screen.getByText("Rua Gardênias, 242 — Fátima")).toBeInTheDocument();
    expect(screen.getByText("Joinville/SC — CEP 89229-050")).toBeInTheDocument();

    for (const social of institutionalInfo.socialLinks) {
      const socialLink = screen.getByRole("link", {
        name: new RegExp(`${social.name} da cadife tour`, "i"),
      });
      expect(socialLink).toHaveAttribute("href", social.url);
      expect(socialLink).toHaveAttribute("target", "_blank");
      expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
    }

    const privacyLink = screen.getByRole("link", {
      name: /política de privacidade da cadife tour/i,
    });
    expect(privacyLink).toHaveAttribute("href", "https://cadifetour.com/politicas/");
    expect(privacyLink).toHaveAttribute("target", "_blank");
    expect(privacyLink).toHaveAttribute("rel", "noopener noreferrer");

    const cookiesLink = screen.getByRole("link", { name: /preferências de cookies/i });
    expect(cookiesLink).toHaveAttribute("href", "/preferencias-de-cookies");

    expect(screen.getByText("221478")).toBeInTheDocument();
    const cadasturLink = screen.getByRole("link", {
      name: /consultar registro cadastur 40\.357\.012\/0001-92/i,
    });
    expect(cadasturLink).toHaveAttribute("href", "https://cadastur.turismo.gov.br/hotsite/");
  });

  it("Footer traduz corretamente rótulos legais e direitos autorais em EN e ES", () => {
    const { unmount } = render(
      <LocaleProvider initialLocale="en">
        <Footer />
      </LocaleProvider>
    );
    expect(screen.getByRole("link", { name: /cookie preferences/i })).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved\./i)).toBeInTheDocument();
    unmount();

    render(
      <LocaleProvider initialLocale="es">
        <Footer />
      </LocaleProvider>
    );
    expect(screen.getByRole("link", { name: /preferencias de cookies/i })).toBeInTheDocument();
    expect(screen.getByText(/todos los derechos reservados\./i)).toBeInTheDocument();
  });

  it("AboutAndTrustSection não exibe aviso pendente e mostra Cadastur verificado", () => {
    render(
      <LocaleProvider initialLocale="pt">
        <AboutAndTrustSection />
      </LocaleProvider>
    );

    expect(screen.queryByText(/processo de homologação cadastral/i)).not.toBeInTheDocument();
    expect(screen.getByText(/40\.357\.012\/0001-92/)).toBeInTheDocument();

    const verifyLink = screen.getByRole("link", {
      name: /consultar autenticidade do registro cadastur/i,
    });
    expect(verifyLink).toHaveAttribute("href", "https://cadastur.turismo.gov.br/hotsite/");
    expect(verifyLink).toHaveAttribute("target", "_blank");
    expect(verifyLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("CookiesPreferencesView disponibiliza acesso transparente à Política e Preferências de Cookies em PT/EN/ES", () => {
    const { unmount } = render(
      <LocaleProvider initialLocale="pt">
        <CookiesPreferencesView />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /política de cookies e preferências de cookies/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("15 de novembro de 2026")).toBeInTheDocument();
    expect(screen.getByText("cadife_locale")).toBeInTheDocument();
    expect(screen.getByText("contato@cadifetour.com")).toBeInTheDocument();
    expect(screen.getByText("+55 47 99671-4510")).toBeInTheDocument();
    expect(screen.getByText("40.357.012/0001-92")).toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    unmount();

    const { unmount: unmountEn } = render(
      <LocaleProvider initialLocale="en">
        <CookiesPreferencesView />
      </LocaleProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /cookie policy & cookie preferences/i,
      })
    ).toBeInTheDocument();
    unmountEn();

    render(
      <LocaleProvider initialLocale="es">
        <CookiesPreferencesView />
      </LocaleProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /política de cookies y preferencias de cookies/i,
      })
    ).toBeInTheDocument();
  });
});
