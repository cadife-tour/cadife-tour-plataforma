"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { howItWorksSteps } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";

export const HowItWorksSection: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      badge: "Consultoria Sem Fricção",
      title: "Como Funciona a Assessoria CADIFE Tour",
      subtitle:
        "Transformamos o planejamento de uma viagem complexa em uma experiência tranquila, segura e sob medida.",
      ctaButton: "Iniciar Meu Planejamento no WhatsApp",
      ctaAria: "Iniciar Meu Planejamento no WhatsApp (abre em nova aba)",
    },
    en: {
      badge: "Seamless Advisory",
      title: "How CADIFE Tour Advisory Works",
      subtitle:
        "We turn complex trip planning into a smooth, secure, and fully customized experience.",
      ctaButton: "Start My Planning on WhatsApp",
      ctaAria: "Start My Planning on WhatsApp (opens in new tab)",
    },
    es: {
      badge: "Asesoría Sin Complicaciones",
      title: "Cómo Funciona la Asesoría CADIFE Tour",
      subtitle:
        "Convertimos la planificación de viajes complejos en una experiencia segura, tranquila y a medida.",
      ctaButton: "Iniciar Planificación en WhatsApp",
      ctaAria: "Iniciar Planificación en WhatsApp (abre en nueva pestaña)",
    },
  };

  const t = labels[locale] || labels.pt;

  return (
    <section id="como-funciona" className="bg-surface/30 border-b border-border py-20 lg:py-28">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            {t.badge}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step) => {
            const title = step.title[locale] || step.title.pt;
            const description = step.description[locale] || step.description.pt;

            return (
              <div
                key={step.stepNumber}
                className="hover:border-brand-primary/40 relative flex flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all"
              >
                <div className="bg-brand-primary/15 mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold text-brand-accent">
                  {step.stepNumber}
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <WhatsAppCta source="how_it_works" size="lg" variant="primary" aria-label={t.ctaAria}>
            {t.ctaButton}
          </WhatsAppCta>
        </div>
      </Container>
    </section>
  );
};
