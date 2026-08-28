"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { howItWorksSteps, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { trackEvent } from "@/core/analytics";

export const HowItWorksSection: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      badge: "Consultoria Sem Fricção",
      title: "Como Funciona a Assessoria CADIFE Tour",
      subtitle:
        "Transformamos o planejamento de uma viagem complexa em uma experiência tranquila, segura e sob medida.",
      ctaButton: "Iniciar Meu Planejamento no WhatsApp",
    },
    en: {
      badge: "Seamless Advisory",
      title: "How CADIFE Tour Advisory Works",
      subtitle:
        "We turn complex trip planning into a smooth, secure, and fully customized experience.",
      ctaButton: "Start My Planning on WhatsApp",
    },
    es: {
      badge: "Asesoría Sin Complicaciones",
      title: "Cómo Funciona la Asesoría CADIFE Tour",
      subtitle:
        "Convertimos la planificación de viajes complejos en una experiencia segura, tranquila y a medida.",
      ctaButton: "Iniciar Planificación en WhatsApp",
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
      cta_location: "how_it_works",
      locale,
    });
  };

  return (
    <section id="como-funciona" className="border-b border-border py-20 lg:py-28 bg-surface/30">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            {t.badge}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step) => {
            const title = step.title[locale] || step.title.pt;
            const description = step.description[locale] || step.description.pt;

            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand-primary/40 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-accent font-bold text-base mb-4">
                  {step.stepNumber}
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Button size="lg" asChild>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              aria-label={`${t.ctaButton} (abre no WhatsApp)`}
            >
              {t.ctaButton}
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
};
