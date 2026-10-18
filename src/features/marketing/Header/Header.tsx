"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/shared/ui/Container/Container";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { useLocale } from "@/core/i18n/LocaleContext";

export const Header: React.FC = () => {
  const { locale } = useLocale();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // O header só fica visível se o usuário estiver no topo absoluto (scrollY < 15px)
      setIsAtTop(window.scrollY < 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const labels = {
    pt: {
      tagline: "Consultoria de Viagens",
      destinations: "Destinos",
      howItWorks: "Como Funciona",
      about: "A Agência",
      faq: "Dúvidas",
      cta: "Falar com Consultor",
      ctaAria: "Falar com Consultor no WhatsApp (abre em nova aba)",
    },
    en: {
      tagline: "Bespoke Travel Advisory",
      destinations: "Destinations",
      howItWorks: "How It Works",
      about: "About Us",
      faq: "FAQ",
      cta: "Talk to an Advisor",
      ctaAria: "Talk to an Advisor on WhatsApp (opens in new tab)",
    },
    es: {
      tagline: "Asesoría de Viajes",
      destinations: "Destinos",
      howItWorks: "Cómo Funciona",
      about: "La Agencia",
      faq: "Preguntas",
      cta: "Hablar con un Asesor",
      ctaAria: "Hablar con un Asesor en WhatsApp (abre en nueva pestaña)",
    },
  };

  const currentLabels = labels[locale] || labels.pt;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-white/10 bg-[#393532]/95 shadow-md backdrop-blur-md transition-all duration-500 ease-in-out ${
        isAtTop
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="group flex items-center gap-2.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="CADIFE Tour — Início"
            >
              <img
                src="/assets/brand/cadife-icon-192.png"
                alt="CADIFE Tour"
                width={36}
                height={36}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9"
              />
              <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                CADIFE <span className="font-bold text-brand-primary">Tour</span>
              </span>
            </a>
            <span className="hidden border-l border-white/20 pl-3 text-xs font-normal text-white/70 md:inline-block">
              {currentLabels.tagline}
            </span>
          </div>

          {/* Navigation Links (Semantic HTML) */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação Principal">
            <a
              href="#destinos"
              className="rounded px-1 text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {currentLabels.destinations}
            </a>
            <a
              href="#como-funciona"
              className="rounded px-1 text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {currentLabels.howItWorks}
            </a>
            <a
              href="#agencia"
              className="rounded px-1 text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {currentLabels.about}
            </a>
            <a
              href="#faq"
              className="rounded px-1 text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {currentLabels.faq}
            </a>
          </nav>

          {/* Actions: Language Selector & WhatsApp CTA */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <WhatsAppCta
              source="header_nav"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
              aria-label={currentLabels.ctaAria}
            >
              {currentLabels.cta}
            </WhatsAppCta>
          </div>
        </div>
      </Container>
    </header>
  );
};
