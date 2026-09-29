import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { metadata } from "@/app/design-system/page";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { sharedUiComponents } from "@/shared/ui";
import { sharedUiCatalog } from "@/shared/ui/catalog";
import { DesignSystemLibrary } from "@/shared/ui/DesignSystemLibrary";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";

describe("Design system library", () => {
  let originalLocalePreference: string | null;
  let originalDocumentLanguage: string;
  let originalGtag: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalLocalePreference = localStorage.getItem("cadife_locale");
    originalDocumentLanguage = document.documentElement.lang;
    originalGtag = Object.getOwnPropertyDescriptor(window, "gtag");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalGtag) {
      Object.defineProperty(window, "gtag", originalGtag);
    } else {
      Reflect.deleteProperty(window, "gtag");
    }
    if (originalLocalePreference === null) {
      localStorage.removeItem("cadife_locale");
    } else {
      localStorage.setItem("cadife_locale", originalLocalePreference);
    }
    document.documentElement.lang = originalDocumentLanguage;
  });

  it("documents every shared UI export with a source and a live preview", () => {
    expect(sharedUiCatalog.map(({ key }) => key).sort()).toEqual(
      Object.keys(sharedUiComponents).sort()
    );

    for (const entry of sharedUiCatalog) {
      expect(entry.name).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.source).toMatch(/^src\/shared\/ui\//);
      expect(entry.preview).toBeTruthy();
    }

    render(<DesignSystemLibrary />);

    for (const entry of sharedUiCatalog) {
      expect(screen.getByRole("heading", { name: entry.name, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(entry.source)).toBeInTheDocument();
    }
  });

  it("lets the user inspect Button variants and disabled state", () => {
    render(<DesignSystemLibrary />);

    const buttonSection = screen.getByRole("region", { name: /button/i });
    expect(within(buttonSection).getByRole("button", { name: /primary/i })).toBeEnabled();
    expect(within(buttonSection).getByRole("button", { name: /disabled/i })).toBeDisabled();
    expect(within(buttonSection).getByRole("button", { name: /secondary/i })).toBeEnabled();
  });

  it("documents every Button size offered by the shared component", () => {
    render(<DesignSystemLibrary />);

    const buttonSection = screen.getByRole("region", { name: /button/i });
    expect(within(buttonSection).getByRole("button", { name: /small size/i })).toHaveClass("h-9");
    expect(within(buttonSection).getByRole("button", { name: /medium size/i })).toHaveClass("h-11");
    expect(within(buttonSection).getByRole("button", { name: /large size/i })).toHaveClass("h-13");
  });

  it("shows every semantic color token and the shared layout scale", () => {
    render(<DesignSystemLibrary />);

    for (const token of [
      "--color-bg",
      "--color-surface",
      "--color-surface-elevated",
      "--color-surface-muted",
      "--color-text",
      "--color-text-muted",
      "--color-text-subtle",
      "--color-brand-primary",
      "--color-brand-secondary",
      "--color-brand-accent",
      "--color-brand-dark",
      "--color-brand-gold",
      "--color-border",
      "--color-border-hover",
      "--color-focus",
      "--color-success",
      "--color-warning",
      "--color-error",
    ]) {
      expect(screen.getByText(`var(${token})`)).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { name: /espaçamento e breakpoints/i })).toBeInTheDocument();
    expect(screen.getByText("space-4 · 1rem")).toBeInTheDocument();
    expect(screen.getByText("md · 768px")).toBeInTheDocument();
  });

  it("keeps the language selector interactive without sending analytics", () => {
    const gtag = vi.fn();
    Object.defineProperty(window, "gtag", { configurable: true, value: gtag });
    const originalLanguage = document.documentElement.lang;
    localStorage.setItem("cadife_locale", "pt");

    render(<DesignSystemLibrary />);

    const languageSection = screen.getByRole("region", { name: /languageselector/i });
    fireEvent.click(within(languageSection).getByRole("button", { name: /idioma selecionado/i }));
    fireEvent.click(within(languageSection).getByRole("option", { name: /english/i }));

    expect(gtag).not.toHaveBeenCalled();
    expect(within(languageSection).getByRole("button", { name: /english/i })).toHaveTextContent(
      "EN"
    );
    expect(localStorage.getItem("cadife_locale")).toBe("pt");
    expect(document.documentElement.lang).toBe(originalLanguage);
  });

  it("aligns the language selector preview to keep its dropdown within the card", () => {
    render(<DesignSystemLibrary />);

    const languageSection = screen.getByRole("region", { name: /languageselector/i });
    const preview = within(languageSection).getByTestId("language-selector-preview");
    expect(preview).toHaveClass("items-end");
    expect(
      within(preview).getByRole("button", { name: /idioma selecionado/i }).parentElement
    ).toHaveClass("w-fit");
  });

  it("keeps language change analytics enabled by default", () => {
    const gtag = vi.fn();
    Object.defineProperty(window, "gtag", { configurable: true, value: gtag });

    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /idioma selecionado/i }));
    fireEvent.click(screen.getByRole("option", { name: /english/i }));

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith("event", "language_change", {
      from_locale: "pt",
      to_locale: "en",
    });
  });

  it("keeps the reference page out of search indexing", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
