"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "@/core/i18n/LocaleContext";
import type { Locale } from "@/content/types";
import { trackEvent } from "@/core/analytics";

interface LanguageOption {
  code: Locale;
  shortLabel: string;
  name: string;
  flag: React.ReactNode;
}

/**
 * Bandeiras SVG precisas, leves e nítidas em qualquer densidade de pixels.
 */
const BrazilFlag: React.FC<{ className?: string }> = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 720 504" className={className} aria-hidden="true" fill="none">
    <rect width="720" height="504" fill="#009b3a" rx="20" />
    <path d="M360 44L680 252L360 460L40 252Z" fill="#fedf00" />
    <circle cx="360" cy="252" r="126" fill="#002776" />
    <path
      d="M236 264C268 226 332 208 412 216C454 220 482 232 482 232"
      stroke="#ffffff"
      strokeWidth="14"
      strokeLinecap="round"
    />
  </svg>
);

const USAFlag: React.FC<{ className?: string }> = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 741 390" className={className} aria-hidden="true">
    <rect width="741" height="390" fill="#b22234" rx="20" />
    <path
      d="M0 30h741v30H0zM0 90h741v30H0zM0 150h741v30H0zM0 210h741v30H0zM0 270h741v30H0zM0 330h741v30H0z"
      fill="#ffffff"
    />
    <rect width="296" height="210" fill="#3c3b6e" rx="10" />
    <circle cx="60" cy="40" r="8" fill="#ffffff" />
    <circle cx="120" cy="40" r="8" fill="#ffffff" />
    <circle cx="180" cy="40" r="8" fill="#ffffff" />
    <circle cx="240" cy="40" r="8" fill="#ffffff" />
    <circle cx="90" cy="75" r="8" fill="#ffffff" />
    <circle cx="150" cy="75" r="8" fill="#ffffff" />
    <circle cx="210" cy="75" r="8" fill="#ffffff" />
    <circle cx="60" cy="110" r="8" fill="#ffffff" />
    <circle cx="120" cy="110" r="8" fill="#ffffff" />
    <circle cx="180" cy="110" r="8" fill="#ffffff" />
    <circle cx="240" cy="110" r="8" fill="#ffffff" />
    <circle cx="90" cy="145" r="8" fill="#ffffff" />
    <circle cx="150" cy="145" r="8" fill="#ffffff" />
    <circle cx="210" cy="145" r="8" fill="#ffffff" />
    <circle cx="60" cy="180" r="8" fill="#ffffff" />
    <circle cx="120" cy="180" r="8" fill="#ffffff" />
    <circle cx="180" cy="180" r="8" fill="#ffffff" />
    <circle cx="240" cy="180" r="8" fill="#ffffff" />
  </svg>
);

const SpainFlag: React.FC<{ className?: string }> = ({ className = "w-5 h-3.5" }) => (
  <svg viewBox="0 0 750 500" className={className} aria-hidden="true">
    <rect width="750" height="500" fill="#c60b1e" rx="20" />
    <rect y="125" width="750" height="250" fill="#ffc400" />
    <circle cx="180" cy="250" r="38" fill="#c60b1e" />
  </svg>
);

const languages: LanguageOption[] = [
  { code: "pt", shortLabel: "PT", name: "Português", flag: <BrazilFlag /> },
  { code: "en", shortLabel: "EN", name: "English", flag: <USAFlag /> },
  { code: "es", shortLabel: "ES", name: "Español", flag: <SpainFlag /> },
];

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale) ?? languages[0]!;

  const handleSelect = (newLocale: Locale) => {
    if (newLocale !== locale) {
      trackEvent("language_change", {
        from_locale: locale,
        to_locale: newLocale,
      });
      setLocale(newLocale);
    }
    setIsOpen(false);
  };

  // Fecha o dropdown ao clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Botão Gatilho do Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Idioma selecionado: ${currentLanguage.name}. Clique para alterar.`}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
      >
        <span className="flex items-center shadow-xs overflow-hidden rounded-xs">
          {currentLanguage.flag}
        </span>
        <span className="font-bold tracking-wide">{currentLanguage.shortLabel}</span>
        <svg
          className={`h-3.5 w-3.5 text-white/80 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu Suspenso */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Opções de idioma"
          className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-white/15 bg-[#282523]/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-brand-primary text-white shadow-xs font-semibold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center overflow-hidden rounded-xs shadow-xs">
                    {lang.flag}
                  </span>
                  <span>{lang.name}</span>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "text-white/90" : "text-white/50"
                  }`}
                >
                  {lang.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
