import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { institutionalInfo } from "@/content/data";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";

describe("Issue #40 — Card CADIFE Tour Oficial e selo Cadastur", () => {
  it("mantém o asset oficial do selo Cadastur em public/assets/brand/selo-cadastur.webp", () => {
    expect(existsSync(resolve("public", "assets", "brand", "selo-cadastur.webp"))).toBe(true);
  });

  it("exibe o card CADIFE Tour Oficial, dados validados, selo sem distorção e preserva o conteúdo de Sobre Nós", () => {
    render(
      <LocaleProvider initialLocale="pt">
        <AboutAndTrustSection />
      </LocaleProvider>
    );

    // Conteúdo pré-existente de Sobre Nós e Depoimentos preservado
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Por que planejar sua viagem com a CADIFE Tour?",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "O que dizem os nossos viajantes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /ver avaliações verificadas no google/i,
      })
    ).toBeInTheDocument();

    // Card CADIFE Tour Oficial
    expect(
      screen.getByRole("heading", { level: 4, name: "CADIFE Tour Oficial" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/agência de turismo formalmente cadastrada e regularizada/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/40\.357\.012\/0001-92/)).toBeInTheDocument();
    expect(screen.getByText(/40\.357\.012 DIEGO GIL/)).toBeInTheDocument();
    expect(screen.getByText(/Agência de Turismo/)).toBeInTheDocument();

    const sealImage = screen.getByRole("img", {
      name: `Selo oficial Cadastur da CADIFE Tour — registro ${institutionalInfo.cadastur.number}`,
    });
    expect(sealImage).toHaveAttribute("src", expect.stringContaining("selo-cadastur.webp"));
    expect(Number(sealImage.getAttribute("width"))).toBe(480);
    expect(Number(sealImage.getAttribute("height"))).toBe(663);
  });

  it("traduz título, descrição e alt do selo para EN e ES", () => {
    const { unmount } = render(
      <LocaleProvider initialLocale="en">
        <AboutAndTrustSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", { level: 4, name: "CADIFE Tour Official" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: `Official Cadastur seal for CADIFE Tour — registration ${institutionalInfo.cadastur.number}`,
      })
    ).toBeInTheDocument();
    unmount();

    render(
      <LocaleProvider initialLocale="es">
        <AboutAndTrustSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("heading", { level: 4, name: "CADIFE Tour Oficial" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: `Sello oficial Cadastur de CADIFE Tour — registro ${institutionalInfo.cadastur.number}`,
      })
    ).toBeInTheDocument();
  });
});
