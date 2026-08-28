"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { agencyValues, testimonialsData, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";

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
    <section id="agencia" className="border-b border-border py-20 lg:py-28">
      <Container>
        {/* 1. Diferenciais Institucionais */}
        <div className="mb-16 max-w-3xl">
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

        <div className="grid gap-8 md:grid-cols-3">
          {agencyValues.map((val, idx) => {
            const title = val.title[locale] || val.title.pt;
            const desc = val.description[locale] || val.description.pt;

            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-7 shadow-sm transition-all hover:border-brand-accent/40"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 text-brand-accent font-bold text-sm mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* 2. Prova Social & Avaliações */}
        <div className="mt-20 pt-16 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <h3 className="text-2xl font-bold text-foreground">
              {t.testimonialsTitle}
            </h3>
            {contactInfo.googleReviewsUrl && (
              <a
                href={contactInfo.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleReviewLinkClick}
                className="text-sm font-semibold text-brand-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded"
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
                  className="rounded-xl border border-border bg-surface-elevated p-6 flex flex-col justify-between"
                >
                  <p className="text-sm text-foreground-muted leading-relaxed italic">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{test.author}</p>
                      {test.origin && (
                        <p className="text-[11px] text-foreground-subtle">{test.origin}</p>
                      )}
                    </div>
                    <div className="flex text-brand-gold text-xs" aria-label={`Avaliação ${test.rating} de 5 estrelas`}>
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
