"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/content/types";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

interface LocaleProviderProps {
  children: React.ReactNode;
  persistPreference?: boolean;
  syncDocumentLanguage?: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "pt",
  setLocale: () => {},
});

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  persistPreference = true,
  syncDocumentLanguage = true,
}) => {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    if (!persistPreference) return;

    // Tenta recuperar preferência salva no browser sem redirecionamento forçado
    const saved = localStorage.getItem("cadife_locale") as Locale | null;
    if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
      setLocaleState(saved);
    }
  }, [persistPreference]);

  useEffect(() => {
    if (!syncDocumentLanguage) return;

    // Sincronização dinâmica do atributo lang no DOM (ISS-01)
    if (typeof document !== "undefined") {
      const htmlLangMap: Record<Locale, string> = {
        pt: "pt-BR",
        en: "en",
        es: "es",
      };
      document.documentElement.lang = htmlLangMap[locale] ?? "pt-BR";
    }
  }, [locale, syncDocumentLanguage]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (persistPreference) {
      localStorage.setItem("cadife_locale", newLocale);
    }
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextValue => useContext(LocaleContext);
