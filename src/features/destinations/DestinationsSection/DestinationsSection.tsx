"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { destinationsData } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";

export const DestinationsSection: React.FC = () => {
  const { locale } = useLocale();
  const observedDestinations = useRef<Set<string>>(new Set());

  const labels = {
    pt: {
      badge: "Curadoria de Experiências",
      title: "Roteiros e Destinos Planejados",
      subtitle:
        "Do charme histórico da Europa à imponência dos glaciares e resorts all-inclusive. Escolha seu estilo e personalizamos cada detalhe.",
      highlightsLabel: "Destaques do Roteiro:",
      ctaText: "Consultar este Roteiro no WhatsApp",
      ctaAria: (dest: string) => `Consultar este Roteiro no WhatsApp — ${dest} (abre em nova aba)`,
    },
    en: {
      badge: "Curated Journeys",
      title: "Featured Destinations & Tailored Itineraries",
      subtitle:
        "From historical European charm to awe-inspiring glaciers and ocean cruises. Choose your style and let us tailor every moment.",
      highlightsLabel: "Experience Highlights:",
      ctaText: "Inquire About This Itinerary",
      ctaAria: (dest: string) =>
        `Inquire About This Itinerary — ${dest} on WhatsApp (opens in new tab)`,
    },
    es: {
      badge: "Curaduría de Viajes",
      title: "Destinos y Roteiros Personalizados",
      subtitle:
        "Desde el encanto europeo hasta glaciares imponentes y cruceros en alta mar. Elija su estilo y personalizamos cada detalle.",
      highlightsLabel: "Puntos Destacados:",
      ctaText: "Consultar Itinerario en WhatsApp",
      ctaAria: (dest: string) =>
        `Consultar Itinerario en WhatsApp — ${dest} (abre en nueva pestaña)`,
    },
  };

  const t = labels[locale] || labels.pt;

  // IntersectionObserver para registrar destination_viewed uma única vez por destino
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const destId = entry.target.getAttribute("data-destination-id");
            if (destId && !observedDestinations.current.has(destId)) {
              observedDestinations.current.add(destId);
              trackEvent("destination_viewed", {
                destination_id: destId,
                locale,
              });
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    const elements = document.querySelectorAll("[data-destination-id]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [locale]);

  return (
    <section id="destinos" className="border-b border-border py-20 lg:py-28">
      <Container>
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            {t.badge}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground-muted sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinationsData.map((item) => {
            const title = item.title[locale] || item.title.pt;
            const subtitle = item.subtitle[locale] || item.subtitle.pt;
            const description = item.description[locale] || item.description.pt;
            const highlights = item.highlights[locale] || item.highlights.pt;

            return (
              <article
                key={item.id}
                data-destination-id={item.id}
                className="hover:border-brand-accent/40 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:bg-surface-elevated"
              >
                <div className="space-y-4">
                  {/* Thumbnail Responsivo com next/image (CLS Zero) */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
                    <Image
                      src={item.imageRef}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="rounded bg-surface-muted px-2.5 py-1 text-xs font-semibold text-brand-accent">
                      {item.category.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-xs font-medium text-brand-gold">{subtitle}</p>
                  <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>

                  {/* Highlights List */}
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                      {t.highlightsLabel}
                    </p>
                    <ul className="space-y-1.5 text-xs text-foreground-muted">
                      {highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold text-brand-accent">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-border/60 mt-8 border-t pt-5">
                  <WhatsAppCta
                    destination={item.slug}
                    destinationTitle={title}
                    source="destination_card"
                    variant="link"
                    showIcon={false}
                    className="inline-flex items-center rounded py-1 text-sm font-semibold text-brand-accent transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                    aria-label={t.ctaAria(title)}
                  >
                    <span>{t.ctaText}</span>
                    <span className="ml-1" aria-hidden="true">
                      →
                    </span>
                  </WhatsAppCta>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
