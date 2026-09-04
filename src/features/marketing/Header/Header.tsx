"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { contactInfo } from "@/content/data";
import { trackEvent } from "@/core/analytics";

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
    },
    en: {
      tagline: "Bespoke Travel Advisory",
      destinations: "Destinations",
      howItWorks: "How It Works",
      about: "About Us",
      faq: "FAQ",
      cta: "Talk to an Advisor",
    },
    es: {
      tagline: "Asesoría de Viajes",
      destinations: "Destinos",
      howItWorks: "Cómo Funciona",
      about: "La Agencia",
      faq: "Preguntas",
      cta: "Hablar con un Asesor",
    },
  };

  const currentLabels = labels[locale] || labels.pt;

  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "general",
  });

  const handleCtaClick = () => {
    trackEvent("whatsapp_conversion", {
      cta_location: "header_nav",
      locale,
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#393532]/95 backdrop-blur-md shadow-md transition-all duration-500 ease-in-out ${
        isAtTop
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded group"
              aria-label="CADIFE Tour — Início"
            >
              <img
                src="/assets/brand/cadife-icon-192.png"
                alt="CADIFE Tour"
                width={36}
                height={36}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                CADIFE <span className="text-brand-primary font-bold">Tour</span>
              </span>
            </a>
            <span className="hidden text-xs text-white/70 font-normal md:inline-block border-l border-white/20 pl-3">
              {currentLabels.tagline}
            </span>
          </div>

          {/* Navigation Links (Semantic HTML) */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação Principal">
            <a
              href="#destinos"
              className="text-sm font-medium text-white/85 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded px-1"
            >
              {currentLabels.destinations}
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-white/85 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded px-1"
            >
              {currentLabels.howItWorks}
            </a>
            <a
              href="#agencia"
              className="text-sm font-medium text-white/85 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded px-1"
            >
              {currentLabels.about}
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-white/85 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded px-1"
            >
              {currentLabels.faq}
            </a>
          </nav>

          {/* Actions: Language Selector & WhatsApp CTA */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                aria-label={`${currentLabels.cta} no WhatsApp (abre em nova aba)`}
              >
                {currentLabels.cta}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
