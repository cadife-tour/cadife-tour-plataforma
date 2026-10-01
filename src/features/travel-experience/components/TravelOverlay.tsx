"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { contactInfo } from "@/content/data";
import { trackEvent } from "@/core/analytics";
import { getPhaseFromProgress } from "../timeline/timelineUtils";

interface TravelOverlayProps {
  progress: number;
  staticFallback?: boolean;
}

/**
 * TravelOverlay:
 * Renderiza textos, títulos e CTAs em HTML semântico e acessível,
 * reagindo com transição suave ao progresso do scroll do Hero (Avião -> Janela -> Nuvens -> Chile).
 */
export const TravelOverlay: React.FC<TravelOverlayProps> = ({
  progress,
  staticFallback = false,
}) => {
  const { locale } = useLocale();
  const _currentPhase = getPhaseFromProgress(progress);

  // Textos para cada fase da jornada
  const content = {
    pt: {
      airplane: {
        badge: "CADIFE Tour",
        title: "Uma nova experiência. Uma nova memória.",
        subtitle: "O mundo começa do outro lado da janela.",
        scrollHint: "Role para começar sua viagem",
        primaryCta: "Planejar Minha Viagem",
        secondaryCta: "Explorar Destinos",
      },
      clouds: {
        badge: "Cruzando Novos Céus",
        title: "Além das nuvens, novos caminhos.",
        subtitle: "Uma jornada de possibilidades começa a ganhar forma.",
      },
      chile: {
        badge: "Destino em Destaque — América do Sul",
        title: "Chile: diante da imensidão dos Andes.",
        subtitle: "Montanhas e horizontes que convidam a ir mais longe.",
        primaryCta: "Quero conhecer esta opção",
        secondaryCta: "Ver Roteiros Completos",
      },
      trustPill1: "Atendimento 100% Humano",
      trustPill2: "Roteiros Personalizados",
      trustPill3: "Suporte 24h na Viagem",
      newTab: "abre em nova aba",
    },
    en: {
      airplane: {
        badge: "CADIFE Tour",
        title: "A new experience. A new memory.",
        subtitle: "The world begins just beyond the window.",
        scrollHint: "Scroll to begin your journey",
        primaryCta: "Plan My Journey",
        secondaryCta: "Explore Destinations",
      },
      clouds: {
        badge: "Crossing New Skies",
        title: "Beyond the clouds, new paths.",
        subtitle: "A journey of possibilities begins to take shape.",
      },
      chile: {
        badge: "Featured Destination — South America",
        title: "Chile: before the vast Andes.",
        subtitle: "Mountains and horizons that invite you to go further.",
        primaryCta: "Explore this option",
        secondaryCta: "View Full Itineraries",
      },
      trustPill1: "100% Human Advisory",
      trustPill2: "Tailored Itineraries",
      trustPill3: "24/7 Travel Assistance",
      newTab: "opens in a new tab",
    },
    es: {
      airplane: {
        badge: "CADIFE Tour",
        title: "Una nueva experiencia. Un nuevo recuerdo.",
        subtitle: "El mundo comienza al otro lado de la ventana.",
        scrollHint: "Desliza para comenzar tu viaje",
        primaryCta: "Planificar Mi Viaje",
        secondaryCta: "Explorar Destinos",
      },
      clouds: {
        badge: "Cruzando Nuevos Cielos",
        title: "Más allá de las nubes, nuevos caminos.",
        subtitle: "Un viaje de posibilidades comienza a tomar forma.",
      },
      chile: {
        badge: "Destino Destacado — Sudamérica",
        title: "Chile: ante la inmensidad de los Andes.",
        subtitle: "Montañas y horizontes que invitan a ir más lejos.",
        primaryCta: "Quiero conocer esta opción",
        secondaryCta: "Ver Itinerarios Completos",
      },
      trustPill1: "Atención 100% Humana",
      trustPill2: "Itinerarios a Medida",
      trustPill3: "Soporte 24h en Destino",
      newTab: "se abre en una pestaña nueva",
    },
  };

  const t = content[locale] || content.pt;

  // URLs contextuais de WhatsApp
  const introWhatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "quote",
  });

  const chileWhatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "destination",
    destinationTitle: "Chile & Cordilheira dos Andes",
  });

  // Opacidade de cada camada do overlay
  // Airplane/Intro: forte de 0 a 0.2, fade out em 0.25
  const introOpacity = Math.max(0, Math.min(1, 1 - progress / 0.25));
  // Clouds text: acompanha a travessia no clipe de oito segundos.
  const cloudsOpacity =
    progress >= 0.42 && progress <= 0.69 ? Math.sin(((progress - 0.42) / 0.27) * Math.PI) : 0;
  // Chile: aparece quando as montanhas entram no vídeo e permanece no frame final.
  const chileOpacity = Math.max(0, Math.min(1, (progress - 0.69) / 0.13));

  const handleIntroCta = () => {
    trackEvent("whatsapp_conversion", {
      cta_location: "hero_airplane_intro",
      locale,
    });
  };

  const handleChileCta = () => {
    trackEvent("whatsapp_conversion", {
      cta_location: "hero_chile_destination",
      locale,
    });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
      <Container>
        <div className="relative flex min-h-[460px] max-w-3xl items-center">
          {/* 1. INTRO / AIRPLANE */}
          <div
            className={`space-y-6 ${
              introOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
            style={{ opacity: introOpacity }}
            aria-hidden={introOpacity <= 0.05}
          >
            <div className="bg-surface/80 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <span
                className={`h-2 w-2 rounded-full bg-brand-accent ${staticFallback ? "" : "animate-pulse"}`}
                aria-hidden="true"
              />
              <span>{t.airplane.badge}</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
              {t.airplane.title}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-white/90 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] sm:text-xl">
              {t.airplane.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" asChild>
                <a
                  href={introWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleIntroCta}
                  aria-label={`${t.airplane.primaryCta} — WhatsApp (${t.newTab})`}
                >
                  {t.airplane.primaryCta}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.airplane.secondaryCta}</a>
              </Button>
            </div>

            {!staticFallback && (
              <div className="flex items-center gap-2 pt-4 text-xs font-medium text-white/90">
                <span>↓</span>
                <span>{t.airplane.scrollHint}</span>
              </div>
            )}
          </div>

          {/* 2. TRANSITION / CLOUDS */}
          {cloudsOpacity > 0.02 && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col justify-center space-y-4"
              style={{ opacity: cloudsOpacity }}
              aria-hidden={cloudsOpacity <= 0.05}
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md">
                <span>{t.clouds.badge}</span>
              </div>
              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl">
                {t.clouds.title}
              </h2>
              <p className="max-w-lg text-base text-white/95 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
                {t.clouds.subtitle}
              </p>
            </div>
          )}

          {/* 3. REVEAL / CHILE */}
          <div
            className={`absolute inset-0 flex flex-col justify-center space-y-6 ${
              chileOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
            style={{ opacity: chileOpacity }}
            aria-hidden={chileOpacity <= 0.05}
          >
            <div className="border-brand-accent/40 bg-surface/90 inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden="true" />
              <span>{t.chile.badge}</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
              {t.chile.title}
            </h2>

            <p className="max-w-2xl text-lg leading-relaxed text-white/95 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] sm:text-xl">
              {t.chile.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" asChild>
                <a
                  href={chileWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleChileCta}
                  aria-label={`${t.chile.primaryCta}: Chile — WhatsApp (${t.newTab})`}
                >
                  {t.chile.primaryCta}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.chile.secondaryCta}</a>
              </Button>
            </div>

            {/* Trust Indicators na fase Chile */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/40 pt-4 text-xs font-medium text-white/90 sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-accent" aria-hidden="true">
                  ✓
                </span>
                <span>{t.trustPill1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-accent" aria-hidden="true">
                  ✓
                </span>
                <span>{t.trustPill2}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-accent" aria-hidden="true">
                  ✓
                </span>
                <span>{t.trustPill3}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
