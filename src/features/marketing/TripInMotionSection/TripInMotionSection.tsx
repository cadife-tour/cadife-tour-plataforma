"use client";

import React from "react";
import type { Locale } from "@/content/types";
import { useLocale } from "@/core/i18n/LocaleContext";
import { Reveal } from "@/shared/motion";
import { Button } from "@/shared/ui/Button/Button";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";

interface TripInMotionCopy {
  eyebrow: string;
  headline: string;
  subheadline: string;
  body: string;
  primaryCta: string;
  primaryCtaAria: string;
  secondaryCta: string;
}

const CONTENT: Record<Locale, TripInMotionCopy> = {
  pt: {
    eyebrow: "Da inspiração ao embarque",
    headline: "Sua viagem em movimento.",
    subheadline: "Escolha o horizonte. A gente cuida do caminho.",
    body: "Do primeiro sonho ao último detalhe, desenhamos viagens nacionais e internacionais do seu jeito.",
    primaryCta: "Planeje sua viagem",
    primaryCtaAria: "Planeje sua viagem no WhatsApp (abre em nova aba)",
    secondaryCta: "Explorar destinos",
  },
  en: {
    eyebrow: "From inspiration to departure",
    headline: "Your journey in motion.",
    subheadline: "Choose the horizon. We take care of the way.",
    body: "From the first dream to the final detail, we design domestic and international trips your way.",
    primaryCta: "Plan your trip",
    primaryCtaAria: "Plan your trip on WhatsApp (opens in new tab)",
    secondaryCta: "Explore destinations",
  },
  es: {
    eyebrow: "De la inspiración al embarque",
    headline: "Tu viaje en movimiento.",
    subheadline: "Elige el horizonte. Nosotros cuidamos el camino.",
    body: "Desde el primer sueño hasta el último detalle, diseñamos viajes nacionales e internacionales a tu manera.",
    primaryCta: "Planifica tu viaje",
    primaryCtaAria: "Planifica tu viaje por WhatsApp (abre en nueva pestaña)",
    secondaryCta: "Explorar destinos",
  },
};

/**
 * TripInMotionSection:
 * Continuidade editorial imediata após a saída da Hero, conduzindo
 * da imersão audiovisual para o planejamento institucional sem recursos pesados.
 */
export const TripInMotionSection: React.FC = () => {
  const { locale } = useLocale();
  const t = CONTENT[locale] ?? CONTENT.pt;

  return (
    <section
      id="sua-viagem-em-movimento"
      aria-labelledby="trip-in-motion-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-surface/30 py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <span className="h-10 w-px bg-gradient-to-b from-brand-primary to-transparent" />
      </div>

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal variant="editorial" className="lg:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-brand-primary" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
                {t.eyebrow}
              </span>
            </div>

            <h2
              id="trip-in-motion-heading"
              className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {t.headline}
            </h2>

            <p className="mt-5 font-heading text-xl font-semibold leading-snug text-foreground/90 sm:text-2xl">
              {t.subheadline}
            </p>
          </Reveal>

          <Reveal index={1} className="lg:col-span-5">
            <div className="border-l-2 border-brand-primary/70 pl-5 sm:pl-6">
              <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">{t.body}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WhatsAppCta source="hero" size="md" variant="primary" aria-label={t.primaryCtaAria}>
                {t.primaryCta}
              </WhatsAppCta>
              <Button variant="outline" size="md" asChild>
                <a href="#destinos">{t.secondaryCta}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
