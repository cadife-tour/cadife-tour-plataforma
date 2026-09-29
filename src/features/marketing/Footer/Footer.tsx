"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";

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
      whatsappAria: "Chamar no WhatsApp (abre em nova aba)",
    },
    en: {
      tagline:
        "Bespoke travel advisory and curated journeys planned with dedication and human touch.",
      contactTitle: "Contact & Support",
      navTitle: "Navigation",
      destinations: "Featured Destinations",
      howItWorks: "How It Works",
      about: "About Us",
      faq: "FAQ",
      legalTitle: "Safety & Compliance",
      rights: "All rights reserved.",
      whatsappBtn: "Contact via WhatsApp",
      whatsappAria: "Contact via WhatsApp (opens in new tab)",
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
      whatsappAria: "Contactar por WhatsApp (abre en nueva pestaña)",
    },
  };

  const t = labels[locale] || labels.pt;

  return (
    <footer className="border-t border-border bg-background py-16 text-foreground-muted">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/brand/cadife-icon-192.png"
                alt="CADIFE Tour"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-foreground">
                CADIFE <span className="font-medium text-brand-primary">Tour</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground-subtle">{t.tagline}</p>
          </div>

          {/* 2. Navegação */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.navTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#destinos"
                  className="rounded py-0.5 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {t.destinations}
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="rounded py-0.5 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {t.howItWorks}
                </a>
              </li>
              <li>
                <a
                  href="#agencia"
                  className="rounded py-0.5 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {t.about}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="rounded py-0.5 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
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
                <WhatsAppCta
                  source="footer"
                  variant="link"
                  showIcon={false}
                  className="py-0.5 font-medium"
                  aria-label={t.whatsappAria}
                >
                  {t.whatsappBtn} →
                </WhatsAppCta>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="rounded py-0.5 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="text-[11px] text-foreground-subtle">{contactInfo.address}</li>
            </ul>
          </div>

          {/* 4. Conformidade */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.legalTitle}
            </p>
            <p className="text-xs leading-relaxed text-foreground-subtle">
              Agência especializada em emissões aéreas, seguro viagem obrigatório e hospitalidade
              internacional.
            </p>
          </div>
        </div>

        <div className="border-border/50 mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-foreground-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} CADIFE Tour. {t.rights}
          </p>
          <p className="text-[11px]">Core First Architecture • Progressive Enhancement</p>
        </div>
      </Container>
    </footer>
  );
};
