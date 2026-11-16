"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { howItWorksSteps } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { TravelEyebrow } from "@/shared/ui/travel/TravelEyebrow";
import { BoardingPass, Barcode } from "@/shared/ui/travel/BoardingPass";

const passLabels = {
  pt: { heading: "Embarque", step: "Etapa", gate: "Portão", seat: "Assento", seatValue: "Janela" },
  en: { heading: "Boarding", step: "Step", gate: "Gate", seat: "Seat", seatValue: "Window" },
  es: { heading: "Embarque", step: "Etapa", gate: "Puerta", seat: "Asiento", seatValue: "Ventana" },
};

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
  const pass = passLabels[locale] || passLabels.pt;

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden border-b border-border bg-surface/30 py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <TravelEyebrow align="center">{t.badge}</TravelEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Rota de voo tracejada ligando as etapas */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-0 hidden h-16 w-full text-brand-accent/50 lg:block"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
          >
            <path
              d="M 20 50 C 250 -10, 420 70, 600 25 S 880 0, 985 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 9"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {howItWorksSteps.map((step) => {
            const title = step.title[locale] || step.title.pt;
            const description = step.description[locale] || step.description.pt;

            return (
              <BoardingPass
                key={step.stepNumber}
                className="h-full transition-transform duration-500 ease-expressive hover:-translate-y-1.5 motion-reduce:transform-none"
                heading={pass.heading}
                code={`${pass.step} ${String(step.stepNumber).padStart(2, "0")}`}
                stub={
                  <div className="flex items-end justify-between gap-4">
                    <dl className="flex gap-6 text-[10px] uppercase tracking-[0.18em] text-foreground-subtle">
                      <div>
                        <dt>{pass.gate}</dt>
                        <dd className="mt-1 font-heading text-lg normal-case tracking-normal text-foreground">
                          {String.fromCharCode(64 + step.stepNumber)}
                          {step.stepNumber}
                        </dd>
                      </div>
                      <div>
                        <dt>{pass.seat}</dt>
                        <dd className="mt-1 font-heading text-lg normal-case tracking-normal text-foreground">
                          {pass.seatValue}
                        </dd>
                      </div>
                    </dl>
                    <Barcode className="h-8 w-14 shrink-0 text-foreground-subtle" />
                  </div>
                }
              >
                <span
                  aria-hidden="true"
                  className="block bg-sunset bg-clip-text font-heading text-5xl font-semibold leading-none text-transparent"
                >
                  {String(step.stepNumber).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{description}</p>
              </BoardingPass>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <WhatsAppCta
            source="how_it_works"
            size="lg"
            variant="primary"
            className="rounded-full shadow-glow"
            aria-label={t.ctaAria}
          >
            {t.ctaButton}
          </WhatsAppCta>
        </div>
      </Container>
    </section>
  );
};
