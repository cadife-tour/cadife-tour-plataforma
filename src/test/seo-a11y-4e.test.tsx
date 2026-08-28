import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleProvider, useLocale } from "@/core/i18n/LocaleContext";
import { metadata } from "@/app/layout";

const LocaleConsumer = () => {
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <button onClick={() => setLocale("en")}>Set English</button>
      <button onClick={() => setLocale("es")}>Set Spanish</button>
      <button onClick={() => setLocale("pt")}>Set Portuguese</button>
    </div>
  );
};

describe("Fase 4E — SEO, Metadata e i18n Boundaries", () => {
  it("ISS-01: synchronizes document.documentElement.lang on locale change", () => {
    render(
      <LocaleProvider>
        <LocaleConsumer />
      </LocaleProvider>
    );

    expect(document.documentElement.lang).toBe("pt-BR");

    const enBtn = screen.getByText("Set English");
    fireEvent.click(enBtn);
    expect(document.documentElement.lang).toBe("en");

    const esBtn = screen.getByText("Set Spanish");
    fireEvent.click(esBtn);
    expect(document.documentElement.lang).toBe("es");

    const ptBtn = screen.getByText("Set Portuguese");
    fireEvent.click(ptBtn);
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("ISS-02: configures real Open Graph and Twitter card images", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/assets/brand/logo.webp",
        width: 768,
        height: 264,
        alt: "CADIFE Tour — Consultoria e Experiências de Viagem Sob Medida",
      },
    ]);

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.images).toEqual(["/assets/brand/logo.webp"]);
  });

  it("ISS-03: preserves clean canonical and avoids misleading query-based hreflang", () => {
    expect(metadata.alternates).toBeDefined();
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.alternates?.languages).toBeUndefined();
  });
});
