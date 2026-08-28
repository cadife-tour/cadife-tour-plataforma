"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { contactInfo } from "@/content/data";
import { trackEvent } from "@/core/analytics";

export const HeroSection: React.FC = () => {
  const { locale } = useLocale();

  const content = {
    pt: {
      badge: "Consultoria & Experiências de Viagem Sob Medida",
      title: "Sua próxima grande jornada planejada com excelência humana.",
      subtitle:
        "Roteiros internacionais, ecoturismo, cruzeiros e viagens corporativas com suporte dedicado do primeiro contato ao desembarque.",
      primaryCta: "Planejar Minha Viagem",
      secondaryCta: "Explorar Experiências",
      trustPill1: "Atendimento 100% Humano",
      trustPill2: "Roteiros Personalizados",
      trustPill3: "Suporte 24h na Viagem",
    },
    en: {
      badge: "Bespoke Travel Advisory & Curated Experiences",
      title: "Your next great journey planned with true human dedication.",
      subtitle:
        "International journeys, ecotourism, ocean cruises, and corporate travel with concierge support from takeoff to return.",
      primaryCta: "Plan My Journey",
      secondaryCta: "Explore Experiences",
      trustPill1: "100% Human Advisory",
      trustPill2: "Tailored Itineraries",
      trustPill3: "24/7 Travel Assistance",
    },
    es: {
      badge: "Asesoría y Experiencias de Viaje a Medida",
      title: "Su próximo gran viaje planificado con dedicación humana.",
      subtitle:
        "Viajes internacionales, ecoturismo, cruceros y traslados con soporte dedicado desde el primer contacto hasta el regreso.",
      primaryCta: "Planificar Mi Viaje",
      secondaryCta: "Explorar Experiencias",
      trustPill1: "Atención 100% Humana",
      trustPill2: "Itinerarios a Medida",
      trustPill3: "Soporte 24h en Destino",
    },
  };

  const t = content[locale] || content.pt;

  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "quote",
  });

  const handleCtaClick = () => {
    trackEvent({
      event: "whatsapp_conversion",
      cta_location: "hero",
      locale,
      label: "Hero Primary CTA",
    });
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center border-b border-border py-20 lg:py-28">
      <Container>
        <div className="max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" aria-hidden="true" />
            <span>{t.badge}</span>
          </div>

          {/* Heading 1 (Único e Semântico) */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
            {t.title}
          </h1>

          {/* Subtítulo */}
          <p className="text-lg text-foreground-muted sm:text-xl leading-relaxed">
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button size="lg" asChild>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                aria-label={`${t.primaryCta} no WhatsApp (abre em nova aba)`}
              >
                {t.primaryCta}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#destinos">{t.secondaryCta}</a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border/60 text-xs font-medium text-foreground-muted sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
              <span>{t.trustPill1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
              <span>{t.trustPill2}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
              <span>{t.trustPill3}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
