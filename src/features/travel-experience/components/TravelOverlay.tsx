"use client";

import { getSceneTiming } from "../config/journeyScenes";
import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { useLocale } from "@/core/i18n/LocaleContext";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { getPhaseFromProgress } from "../timeline/timelineUtils";
import { getDestinationConfig, type TravelExperienceMode } from "../config/travelExperienceConfig";

export interface TravelOverlayProps {
  progress: number;
  showIntro?: boolean;
  staticFallback?: boolean;
  isStaticFallback?: boolean;
  mode?: TravelExperienceMode;
  targetDestination?: string;
}

/**
 * TravelOverlay:
 * Renderiza textos, títulos e CTAs em HTML semântico e acessível,
 * reagindo com transição suave ao progresso do scroll do Hero (Avião -> Nuvens -> Destino).
 * Suporta destinos configuráveis dinamicamente via targetDestination.
 */
export const TravelOverlay: React.FC<TravelOverlayProps> = ({
  progress,
  showIntro = true,
  staticFallback = false,
  isStaticFallback = false,
  mode: _mode = "single",
  targetDestination = "chile",
}) => {
  const isFallback = staticFallback || isStaticFallback;
  const { locale } = useLocale();
  const _currentPhase = getPhaseFromProgress(progress);

  // Configuração dinâmica do destino ativo
  const destinationConfig = getDestinationConfig(targetDestination);
  const destContent = destinationConfig.content[locale] || destinationConfig.content.pt;

  // Textos para abertura e transições da jornada
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
      trustPill1: "Atención 100% Humana",
      trustPill2: "Itinerarios a Medida",
      trustPill3: "Soporte 24h en Destino",
      newTab: "se abre en una pestaña nueva",
    },
  };

  const t = content[locale] || content.pt;

  // Opacidade de cada camada do overlay
  // Airplane/Intro: forte de 0 a 0.2, fade out em 0.25
  const timing = getSceneTiming(destinationConfig.id);
  const introOpacity = Math.max(0, Math.min(1, 1 - progress / timing.introEnd));
  // Clouds text: acompanha a travessia no clipe de oito segundos.
  const cloudsOpacity =
    progress >= timing.cloudsStart && progress <= timing.cloudsEnd
      ? Math.sin(
          ((progress - timing.cloudsStart) / (timing.cloudsEnd - timing.cloudsStart)) * Math.PI
        )
      : 0;
  // Destino ativo: surge a partir de 0.69 e consolida até o fim.
  const destinationOpacity = Math.max(
    0,
    Math.min(1, (progress - timing.revealStart) / (timing.revealEnd - timing.revealStart))
  );

  const destinationAriaLabel =
    destinationConfig.id === "chile"
      ? `${destContent.primaryCta}: ${destinationConfig.country} — WhatsApp (${t.newTab})`
      : `${destContent.primaryCta} — WhatsApp (${t.newTab})`;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
      <Container>
        <div className="relative flex min-h-[460px] max-w-3xl items-center">
          {/* 1. INTRO / AIRPLANE */}
          {showIntro && (!isFallback || introOpacity > 0.05) && (
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
                  className={`h-2 w-2 rounded-full bg-brand-accent ${isFallback ? "" : "animate-pulse"}`}
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
                <WhatsAppCta
                  size="lg"
                  source="hero_airplane_intro"
                  aria-label={`${t.airplane.primaryCta} — WhatsApp (${t.newTab})`}
                >
                  {t.airplane.primaryCta}
                </WhatsAppCta>
                <Button variant="outline" size="lg" asChild>
                  <a href="/#destinos">{t.airplane.secondaryCta}</a>
                </Button>
              </div>

              {!isFallback && (
                <div className="flex items-center gap-2 pt-4 text-xs font-medium text-white/90">
                  <span>↓</span>
                  <span>{t.airplane.scrollHint}</span>
                </div>
              )}
            </div>
          )}

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

          {/* 3. REVEAL / CONFIGURABLE DESTINATION */}
          {(!isFallback || destinationOpacity > 0.05) && (
            <div
              className={`absolute inset-0 flex flex-col justify-center space-y-6 ${
                destinationOpacity > 0.05
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none invisible opacity-0"
              }`}
              style={{ opacity: destinationOpacity }}
              aria-hidden={destinationOpacity <= 0.05}
            >
              <div className="border-brand-accent/40 bg-surface/90 inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden="true" />
                <span>{destContent.badge}</span>
              </div>

              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
                {destContent.title}
              </h2>

              <p className="max-w-2xl text-lg leading-relaxed text-white/95 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] sm:text-xl">
                {destContent.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <WhatsAppCta
                  size="lg"
                  source={`hero_${destinationConfig.id}_destination`}
                  destination={destinationConfig.whatsappContext}
                  aria-label={destinationAriaLabel}
                >
                  {destContent.primaryCta}
                </WhatsAppCta>
                <Button variant="outline" size="lg" asChild>
                  <a href="/#destinos">{destContent.secondaryCta}</a>
                </Button>
              </div>

              {/* Trust Indicators na fase do destino */}
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
          )}
        </div>
      </Container>
    </div>
  );
};
