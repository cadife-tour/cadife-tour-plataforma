"use client";

import React from "react";
import { useLocale } from "@/core/i18n/LocaleContext";
import type { Locale } from "@/content/types";
import { trackEvent } from "@/core/analytics";

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { locale, setLocale } = useLocale();

  const handleSelect = (newLocale: Locale) => {
    if (newLocale !== locale) {
      trackEvent("language_change", {
        from_locale: locale,
        to_locale: newLocale,
      });
      setLocale(newLocale);
    }
  };

  const languages: { code: Locale; label: string }[] = [
    { code: "pt", label: "PT" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-surface px-1.5 py-1 ${className}`}
      role="group"
      aria-label="Selecionar idioma / Select language"
    >
      {languages.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelect(lang.code)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent ${
              isActive
                ? "bg-brand-primary text-white"
                : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
            }`}
            aria-pressed={isActive}
            aria-label={`Mudar idioma para ${lang.label}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
