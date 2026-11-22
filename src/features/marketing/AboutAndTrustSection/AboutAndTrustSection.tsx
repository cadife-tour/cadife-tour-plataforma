"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/shared/ui/Container/Container";
import { agencyValues, testimonialsData, contactInfo, institutionalInfo } from "@/content/data";
import type { Locale } from "@/content/types";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import { Reveal } from "@/shared/motion";

/** Formata uma data ISO `YYYY-MM-DD` no padrão esperado pelo locale sem deslocamento de fuso. */
function formatCadasturDate(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  if (locale === "en") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
  }
  return `${day}/${month}/${year}`;
}

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
      cadasturVerifiedLabel: "Agência regularizada no Cadastur (Ministério do Turismo)",
      cadasturValidity: (from: string, until: string) => `Validade ${from} a ${until}`,
      cadasturVerifyLink: "Consultar autenticidade no Cadastur →",
      cadasturVerifyAria: (number: string) =>
        `Consultar autenticidade do registro Cadastur ${number} no site oficial (abre em nova aba)`,
      officialCardTitle: "CADIFE Tour Oficial",
      officialCardDescription:
        "Atuamos como agência de turismo formalmente cadastrada e regularizada junto ao Ministério do Turismo, seguindo as normas oficiais do setor.",
      cadasturSealAlt: (number: string) =>
        `Selo oficial Cadastur da CADIFE Tour — registro ${number}`,
    },
    en: {
      badge: "Authority & Trust",
      title: "Why Plan Your Journey With CADIFE Tour?",
      subtitle:
        "Beyond booking flights and hotels, we provide peace of mind, expert curation, and real-time support for unforgettable moments.",
      testimonialsTitle: "What Our Travelers Say",
      googleReviewsLink: "View reviews on Google Business →",
      cadasturPendingNotice: "[Official regulatory registration under verification]",
      cadasturVerifiedLabel: "Officially registered on Cadastur (Brazilian Ministry of Tourism)",
      cadasturValidity: (from: string, until: string) => `Valid from ${from} to ${until}`,
      cadasturVerifyLink: "Verify on Cadastur →",
      cadasturVerifyAria: (number: string) =>
        `Verify Cadastur registration ${number} on the official portal (opens in new tab)`,
      officialCardTitle: "CADIFE Tour Official",
      officialCardDescription:
        "We operate as a travel agency formally registered with the Brazilian Ministry of Tourism, following official industry regulations.",
      cadasturSealAlt: (number: string) =>
        `Official Cadastur seal for CADIFE Tour — registration ${number}`,
    },
    es: {
      badge: "Autoridad y Confianza",
      title: "¿Por qué planificar su viaje con CADIFE Tour?",
      subtitle:
        "Más que emitir pasajes y hoteles, brindamos tranquilidad, curaduría experta y soporte en tiempo real.",
      testimonialsTitle: "Lo Que Dicen Nuestros Viajeros",
      googleReviewsLink: "Ver opiniones en Google →",
      cadasturPendingNotice: "[Registro regulatorio oficial en proceso de verificación]",
      cadasturVerifiedLabel: "Agencia registrada en Cadastur (Ministerio de Turismo de Brasil)",
      cadasturValidity: (from: string, until: string) => `Vigencia ${from} al ${until}`,
      cadasturVerifyLink: "Verificar en Cadastur →",
      cadasturVerifyAria: (number: string) =>
        `Verificar el registro Cadastur ${number} en el sitio oficial (abre en nueva pestaña)`,
      officialCardTitle: "CADIFE Tour Oficial",
      officialCardDescription:
        "Operamos como agencia de turismo formalmente registrada ante el Ministerio de Turismo de Brasil, cumpliendo las normas oficiales del sector.",
      cadasturSealAlt: (number: string) =>
        `Sello oficial Cadastur de CADIFE Tour — registro ${number}`,
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
        <Reveal variant="editorial" className="mb-16 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            {t.badge}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">{t.subtitle}</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {agencyValues.map((val, idx) => {
            const title = val.title[locale] || val.title.pt;
            const desc = val.description[locale] || val.description.pt;

            return (
              <Reveal key={idx} index={idx} className="h-full">
                <div className="h-full rounded-xl border border-border bg-surface p-7 shadow-sm transition-all duration-micro ease-standard hover:border-brand-accent/40 motion-reduce:transition-none">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 text-sm font-bold text-brand-accent">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{desc}</p>
                </div>
              </Reveal>
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
                  className="flex flex-col justify-between rounded-xl border border-border bg-surface-elevated p-6"
                >
                  <p className="text-sm italic leading-relaxed text-foreground-muted">
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

          {/* Registro Oficial & Conformidade CADASTUR */}
          {contactInfo.isCadasturPending ? (
            <p className="mt-8 text-center text-xs text-foreground-subtle">
              {t.cadasturPendingNotice}
            </p>
          ) : (
            <Reveal>
              <article
                aria-labelledby="cadife-official-heading"
                className="mt-10 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8"
              >
                <div className="grid items-center gap-8 md:grid-cols-12">
                  <div className="space-y-4 text-center md:col-span-8 md:text-left">
                    <div className="flex items-center justify-center gap-3 md:justify-start">
                      <span className="h-0.5 w-8 bg-brand-primary" aria-hidden="true" />
                      <h4
                        id="cadife-official-heading"
                        className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                      >
                        {t.officialCardTitle}
                      </h4>
                    </div>

                    <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted sm:text-base">
                      {t.officialCardDescription}
                    </p>

                    <div className="space-y-1 border-t border-border/60 pt-4 text-xs text-foreground-muted sm:text-sm">
                      <p className="font-semibold text-foreground">
                        {t.cadasturVerifiedLabel}: {institutionalInfo.cadastur.number}
                      </p>
                      <p className="text-foreground-subtle">
                        {institutionalInfo.cadastur.providerName} •{" "}
                        {institutionalInfo.cadastur.activity[locale] ||
                          institutionalInfo.cadastur.activity.pt}{" "}
                        •{" "}
                        {t.cadasturValidity(
                          formatCadasturDate(institutionalInfo.cadastur.validFrom, locale),
                          formatCadasturDate(institutionalInfo.cadastur.validUntil, locale)
                        )}
                      </p>
                    </div>

                    <div className="pt-1">
                      <a
                        href={institutionalInfo.cadastur.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t.cadasturVerifyAria(institutionalInfo.cadastur.number)}
                        className="inline-flex items-center rounded py-1 text-sm font-semibold text-brand-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                      >
                        {t.cadasturVerifyLink}
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-center md:col-span-4 md:justify-end">
                    <figure className="w-full max-w-[220px] sm:max-w-[240px]">
                      <Image
                        src="/assets/brand/selo-cadastur.webp"
                        alt={t.cadasturSealAlt(institutionalInfo.cadastur.number)}
                        width={480}
                        height={663}
                        sizes="(max-width: 768px) 220px, 240px"
                        className="h-auto w-full rounded-lg border border-border/60 bg-white shadow-sm"
                      />
                    </figure>
                  </div>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
};
