"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { trackEvent } from "@/core/analytics";

export const Footer: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      tagline: "Consultoria e experiências de viagem planejadas sob medida com atendimento humano.",
      contactTitle: "Atendimento & Contato",
      navTitle: "Navegação",
      destinations: "Destinos em Destaque",
      howItWorks: "Como Funciona",
      about: "A Agência",
      faq: "Dúvidas Frequentes",
      legalTitle: "Segurança & Conformidade",
      rights: "Todos os direitos reservados.",
      whatsappBtn: "Chamar no WhatsApp",
    },
    en: {
      tagline: "Bespoke travel advisory and curated journeys planned with dedication and human touch.",
      contactTitle: "Contact & Support",
      navTitle: "Navigation",
      destinations: "Featured Destinations",
      howItWorks: "How It Works",
      about: "About Us",
      faq: "FAQ",
      legalTitle: "Safety & Compliance",
      rights: "All rights reserved.",
      whatsappBtn: "Contact via WhatsApp",
    },
    es: {
      tagline: "Asesoría y experiencias de viaje diseñadas a medida con atención humana.",
      contactTitle: "Atención y Contacto",
      navTitle: "Navegación",
      destinations: "Destinos Destacados",
      howItWorks: "Cómo Funciona",
      about: "La Agencia",
      faq: "Preguntas Frequentes",
      legalTitle: "Seguridad y Cumplimiento",
      rights: "Todos os direitos reservados.",
      whatsappBtn: "Contactar por WhatsApp",
    },
  };

  const t = labels[locale] || labels.pt;

  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "general",
  });

  const handleCtaClick = () => {
    trackEvent("whatsapp_conversion", {
      cta_location: "footer",
      locale,
    });
  };

  return (
    <footer className="border-t border-border bg-background py-16 text-foreground-muted">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand & Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-foreground">
              CADIFE <span className="text-brand-accent font-light">Tour</span>
            </span>
            <p className="text-xs text-foreground-subtle leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* 2. Navegação */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.navTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#destinos" className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5">
                  {t.destinations}
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5">
                  {t.howItWorks}
                </a>
              </li>
              <li>
                <a href="#agencia" className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5">
                  {t.about}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5">
                  {t.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Contato */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.contactTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="text-brand-accent font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5"
                  aria-label={`${t.whatsappBtn} (abre em nova aba)`}
                >
                  {t.whatsappBtn} →
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded py-0.5">
                  {contactInfo.email}
                </a>
              </li>
              <li className="text-foreground-subtle text-[11px]">{contactInfo.address}</li>
            </ul>
          </div>

          {/* 4. Conformidade */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.legalTitle}
            </p>
            <p className="text-xs text-foreground-subtle leading-relaxed">
              Agência especializada em emissões aéreas, seguro viagem obrigatório e hospitalidade internacional.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-subtle">
          <p>© {new Date().getFullYear()} CADIFE Tour. {t.rights}</p>
          <p className="text-[11px]">Core First Architecture • Progressive Enhancement</p>
        </div>
      </Container>
    </footer>
  );
};
