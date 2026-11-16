"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { agencyValues, testimonialsData, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import { TravelEyebrow } from "@/shared/ui/travel/TravelEyebrow";
import { PassportStamp, type StampTone } from "@/shared/ui/travel/PassportStamp";

type StampLocale = "pt" | "en" | "es";

const valueStamps: [
  { tone: StampTone; title: Record<StampLocale, string> },
  { tone: StampTone; title: Record<StampLocale, string> },
  { tone: StampTone; title: Record<StampLocale, string> },
] = [
  { tone: "red", title: { pt: "HUMANO", en: "HUMAN", es: "HUMANO" } },
  { tone: "blue", title: { pt: "SEGURO", en: "SAFE", es: "SEGURO" } },
  { tone: "gold", title: { pt: "AUTORAL", en: "BESPOKE", es: "AUTORAL" } },
];
const approvedLabel: Record<StampLocale, string> = {
  pt: "APROVADO",
  en: "APPROVED",
  es: "APROBADO",
};

export const AboutAndTrustSection: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      badge: "Autoridade & Confiança",
      title: "Por que planejar sua viagem com a CADIFE Tour?",
      subtitle:
        "Mais do que emitir passagens e reservas, entregamos segurança, curadoria e suporte em tempo real para momentos inesquecíveis.",
      testimonialsTitle: "O que dizem os nossos viajantes",
      googleReviewsLink: "Ver avaliações no Google Meu Negócio →",
      cadasturPendingNotice: "[Registro CADASTUR formal em processo de homologação cadastral]",
    },
    en: {
      badge: "Authority & Trust",
      title: "Why Plan Your Journey With CADIFE Tour?",
      subtitle:
        "Beyond booking flights and hotels, we provide peace of mind, expert curation, and real-time support for unforgettable moments.",
      testimonialsTitle: "What Our Travelers Say",
      googleReviewsLink: "View reviews on Google Business →",
      cadasturPendingNotice: "[Official regulatory registration under verification]",
    },
    es: {
      badge: "Autoridad y Confianza",
      title: "¿Por qué planificar su viaje con CADIFE Tour?",
      subtitle:
        "Más que emitir pasajes y hoteles, brindamos tranquilidad, curaduría experta y soporte en tiempo real.",
      testimonialsTitle: "Lo Que Dicen Nuestros Viajeros",
      googleReviewsLink: "Ver opiniones en Google →",
      cadasturPendingNotice: "[Registro regulatorio oficial en proceso de verificación]",
    },
  };

  const t = labels[locale] || labels.pt;

  const handleReviewLinkClick = () => {
    trackEvent("google_reviews_clicked", {
      locale,
    });
  };

  return (
    <section id="agencia" className="scroll-mt-24 border-b border-border py-20 lg:py-28">
      <Container>
        {/* 1. Diferenciais Institucionais */}
        <div className="mb-16 max-w-3xl">
          <TravelEyebrow>{t.badge}</TravelEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {agencyValues.map((val, idx) => {
            const stamp = valueStamps[(idx % 3) as 0 | 1 | 2];
            const title = val.title[locale] || val.title.pt;
            const desc = val.description[locale] || val.description.pt;

            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 pt-32 shadow-md transition-all duration-300 hover:border-brand-accent/40 hover:shadow-xl"
              >
                <PassportStamp
                  label="CADIFE TOUR"
                  title={stamp.title[locale]}
                  caption={approvedLabel[locale]}
                  tone={stamp.tone}
                  rotate={[-10, 7, -4][idx % 3] ?? 0}
                  size={92}
                  className="absolute right-5 top-4 opacity-90 transition-transform duration-500 ease-expressive group-hover:rotate-0 group-hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* 2. Prova Social & Avaliações */}
        <div id="depoimentos" className="mt-20 scroll-mt-24 border-t border-border/60 pt-16">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-2xl font-bold text-foreground">{t.testimonialsTitle}</h3>
            {contactInfo.googleReviewsUrl && (
              <a
                href={contactInfo.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleReviewLinkClick}
                className="rounded text-sm font-semibold text-brand-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                aria-label="Ver avaliações verificadas no Google (abre em nova aba)"
              >
                {t.googleReviewsLink}
              </a>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonialsData.map((test) => {
              const text = test.text[locale] || test.text.pt;

              return (
                <blockquote
                  key={test.id}
                  className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface-elevated p-7 pr-24"
                >
                  <PassportStamp
                    label="CADIFE"
                    title={`★ ${test.rating}.0`}
                    caption={test.origin ? test.origin.toUpperCase().slice(0, 18) : undefined}
                    tone="gold"
                    shape="rect"
                    rotate={8}
                    size={86}
                    className="absolute right-3 top-4 opacity-80"
                  />
                  <p className="font-heading text-base italic leading-relaxed text-foreground/90">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{test.author}</p>
                      {test.origin && (
                        <p className="text-[11px] text-foreground-subtle">{test.origin}</p>
                      )}
                    </div>
                    <div
                      className="flex text-xs text-brand-gold"
                      aria-label={`Avaliação ${test.rating} de 5 estrelas`}
                    >
                      {"★".repeat(test.rating)}
                    </div>
                  </div>
                </blockquote>
              );
            })}
          </div>

          {/* Aviso Transparente de Conformidade */}
          {contactInfo.isCadasturPending && (
            <p className="mt-8 text-center text-xs text-foreground-subtle">
              {t.cadasturPendingNotice}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};
