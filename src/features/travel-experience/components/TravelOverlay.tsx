"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { useLocale } from "@/core/i18n/LocaleContext";
import { getPhaseFromProgress } from "../timeline/timelineUtils";
import type { TravelExperienceMode } from "../config/travelExperienceConfig";

export interface TravelOverlayProps {
  progress: number;
  mode?: TravelExperienceMode;
  targetDestination?: string;
  isStaticFallback?: boolean;
}

/**
 * TravelOverlay:
 * Renderiza textos, títulos e CTAs em HTML semântico e acessível,
 * reagindo com transição suave ao progresso do scroll do Hero (Avião -> Janela -> Nuvens -> Chile/Destino).
 * Suporta modo 'single' (destino focado), 'full' (jornada completa) e 'isStaticFallback' (acessibilidade sem movimento).
 */
export const TravelOverlay: React.FC<TravelOverlayProps> = ({
  progress,
  mode: _mode = "single",
  targetDestination = "chile",
  isStaticFallback = false,
}) => {
  const { locale } = useLocale();
  const _currentPhase = getPhaseFromProgress(progress);

  // Textos para cada fase da jornada
  const content = {
    pt: {
      airplane: {
        badge: "Uma nova experiência. Uma nova memória.",
        title: "Sua próxima grande jornada planejada com excelência humana.",
        subtitle: "CADIFE Tour • Joinville — Brasil",
        scrollHint: "Role para iniciar sua viagem",
        primaryCta: "Planejar Minha Viagem",
        secondaryCta: "Explorar Destinos",
      },
      window: {
        badge: "O Começo da Jornada",
        title: "O mundo começa do outro lado da janela.",
        subtitle: "Deixe a rotina para trás e prepare-se para o horizonte.",
      },
      clouds: {
        badge: "Cruzando Novos Céus",
        title: "Atravessando horizontes em direção ao extraordinário.",
        subtitle: "Cada detalhe da rota cuidadosamente desenhado para você.",
      },
      chile: {
        badge: "Destino em Destaque — América do Sul",
        title: "Chile: Onde a imponência dos Andes encontra o infinito.",
        subtitle:
          "Entre montanhas e horizontes infinitos. Das cordilheiras nevadas e vinhedos do Valle Central à Patagônia.",
        primaryCta: "Quero Conhecer o Chile",
        secondaryCta: "Ver Roteiros Completos",
      },
      trustPill1: "Atendimento 100% Humano",
      trustPill2: "Roteiros Personalizados",
      trustPill3: "Suporte 24h na Viagem",
    },
    en: {
      airplane: {
        badge: "A new experience. A lasting memory.",
        title: "Your next great journey planned with true human dedication.",
        subtitle: "CADIFE Tour • Joinville — Brazil",
        scrollHint: "Scroll to begin journey",
        primaryCta: "Plan My Journey",
        secondaryCta: "Explore Destinations",
      },
      window: {
        badge: "The Journey Begins",
        title: "The world begins just beyond the window.",
        subtitle: "Leave routine behind and gaze into new horizons.",
      },
      clouds: {
        badge: "Crossing New Skies",
        title: "Traversing horizons towards the extraordinary.",
        subtitle: "Every detail of your route thoughtfully curated.",
      },
      chile: {
        badge: "Featured Destination — South America",
        title: "Chile: Where the majesty of the Andes meets the infinite.",
        subtitle:
          "Between mountains and infinite horizons. From snow-capped peaks and vineyards to Patagonia.",
        primaryCta: "Discover Chile",
        secondaryCta: "View Full Itineraries",
      },
      trustPill1: "100% Human Advisory",
      trustPill2: "Tailored Itineraries",
      trustPill3: "24/7 Travel Assistance",
    },
    es: {
      airplane: {
        badge: "Una nueva experiencia. Una nueva memoria.",
        title: "Su próximo gran viaje planificado con dedicación humana.",
        subtitle: "CADIFE Tour • Joinville — Brasil",
        scrollHint: "Deslice para iniciar el viaje",
        primaryCta: "Planificar Mi Viaje",
        secondaryCta: "Explorar Destinos",
      },
      window: {
        badge: "El Comienzo del Viaje",
        title: "El mundo comienza al otro lado de la ventana.",
        subtitle: "Deje la rutina atrás y prepárese para el horizonte.",
      },
      clouds: {
        badge: "Cruzando Nuevos Cielos",
        title: "Atravesando horizontes hacia lo extraordinario.",
        subtitle: "Cada detalle de su ruta cuidadosamente diseñado.",
      },
      chile: {
        badge: "Destino Destacado — Sudamérica",
        title: "Chile: Donde la imponencia de los Andes encuentra el infinito.",
        subtitle:
          "Entre montañas y horizontes infinitos. De picos nevados y viñedos a la Patagonia salvaje.",
        primaryCta: "Quero Conocer Chile",
        secondaryCta: "Ver Itinerarios Completos",
      },
      trustPill1: "Atención 100% Humana",
      trustPill2: "Itinerarios a Medida",
      trustPill3: "Soporte 24h en Destino",
    },
  };

  const t = content[locale] || content.pt;

  // Curvas de opacidade estritamente calibradas para cada fase da narrativa:
  // 1. Interior / Avião: 0.0 a 0.15 (fade out entre 0.11 e 0.16)
  const introOpacity =
    progress < 0.16 ? Math.max(0, Math.min(1, 1 - Math.max(0, progress - 0.1) / 0.06)) : 0;

  // 2. Janela: 0.15 a 0.30 (curva em sino suave)
  const windowOpacity =
    progress >= 0.14 && progress <= 0.32 ? Math.sin(((progress - 0.14) / 0.18) * Math.PI) : 0;

  // 3. Nuvens: 0.30 a 0.50 (curva em sino suave)
  const cloudsOpacity =
    progress >= 0.28 && progress <= 0.52 ? Math.sin(((progress - 0.28) / 0.24) * Math.PI) : 0;

  // 4. Chile / Destino & CTA: surge progressivamente a partir de 0.50 e consolida até 1.00
  const chileOpacity = Math.max(0, Math.min(1, (progress - 0.5) / 0.15));

  // Fallback estático e editorial para usuários com 'prefers-reduced-motion' ou baixa capacidade de GPU
  if (isStaticFallback) {
    return (
      <div className="relative z-10 w-full py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 text-center sm:text-left">
            {/* Badge de Identificação */}
            <div className="bg-surface/90 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden="true" />
              <span>{t.airplane.badge}</span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.airplane.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted sm:text-xl">
              {t.airplane.subtitle}
            </p>

            {/* Cartão Editorial do Destino com Alto Contraste */}
            <div className="border-border/80 bg-surface-elevated/70 space-y-4 rounded-xl border p-6 text-left shadow-lg backdrop-blur-md sm:p-8">
              <div className="border-brand-accent/30 bg-brand-accent/10 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-brand-accent">
                <span>{t.chile.badge}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t.chile.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-muted sm:text-base">
                {t.chile.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <WhatsAppCta
                  destination={targetDestination || "chile"}
                  destinationTitle="Chile & Cordilheira dos Andes"
                  source="hero_fallback_static"
                  size="lg"
                  aria-label={`${t.chile.primaryCta} no WhatsApp (abre em nova aba)`}
                >
                  {t.chile.primaryCta}
                </WhatsAppCta>
                <Button variant="outline" size="lg" asChild>
                  <a href="#destinos">{t.chile.secondaryCta}</a>
                </Button>
              </div>
            </div>

            {/* Selos de Confiança */}
            <div className="border-border/60 flex flex-wrap items-center justify-center gap-6 border-t pt-2 text-xs font-medium text-foreground-muted sm:justify-start sm:text-sm">
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
        </Container>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
      <Container>
        <div className="relative flex min-h-[460px] max-w-3xl items-center">
          {/* 1. INTRO / AIRPLANE */}
          <div
            className={`space-y-6 transition-all duration-300 ${
              introOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
            style={{ opacity: introOpacity }}
            aria-hidden={introOpacity <= 0.05}
          >
            <div className="bg-surface/80 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm backdrop-blur-md">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-brand-accent"
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
                source="hero_airplane_intro"
                size="lg"
                aria-label={`${t.airplane.primaryCta} no WhatsApp (abre em nova aba)`}
              >
                {t.airplane.primaryCta}
              </WhatsAppCta>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.airplane.secondaryCta}</a>
              </Button>
            </div>

            <div className="flex animate-bounce items-center gap-2 pt-4 text-xs font-medium text-brand-accent">
              <span>↓</span>
              <span>{t.airplane.scrollHint}</span>
            </div>
          </div>

          {/* 2. TRANSITION / WINDOW (0.15 - 0.30) */}
          {windowOpacity > 0.02 && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col justify-center space-y-4 transition-opacity duration-300"
              style={{ opacity: windowOpacity }}
              aria-hidden="true"
            >
              <div className="border-brand-accent/40 inline-flex w-fit items-center gap-2 rounded-full border bg-black/50 px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm backdrop-blur-md">
                <span>{t.window.badge}</span>
              </div>
              <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl lg:text-5xl">
                {t.window.title}
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-white/90 [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] sm:text-lg">
                {t.window.subtitle}
              </p>
            </div>
          )}

          {/* 3. TRANSITION / CLOUDS (0.30 - 0.50) */}
          {cloudsOpacity > 0.02 && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col justify-center space-y-4 transition-opacity duration-300"
              style={{ opacity: cloudsOpacity }}
              aria-hidden="true"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md">
                <span>{t.clouds.badge}</span>
              </div>
              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                {t.clouds.title}
              </h2>
              <p className="max-w-lg text-base text-white/80 drop-shadow">{t.clouds.subtitle}</p>
            </div>
          )}

          {/* 3. REVEAL / CHILE */}
          <div
            className={`absolute inset-0 flex flex-col justify-center space-y-6 transition-all duration-500 ${
              chileOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
            style={{ opacity: chileOpacity }}
            aria-hidden={chileOpacity <= 0.05}
          >
            <div className="border-brand-accent/40 bg-surface/90 inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden="true" />
              <span>{t.chile.badge}</span>
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground drop-shadow-md sm:text-5xl lg:text-6xl">
              {t.chile.title}
            </h2>

            <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted drop-shadow sm:text-xl">
              {t.chile.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <WhatsAppCta
                destination={targetDestination || "chile"}
                destinationTitle="Chile & Cordilheira dos Andes"
                source="hero_chile_destination"
                size="lg"
                aria-label={`${t.chile.primaryCta} no WhatsApp (abre em nova aba)`}
              >
                {t.chile.primaryCta}
              </WhatsAppCta>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.chile.secondaryCta}</a>
              </Button>
            </div>

            {/* Trust Indicators na fase Chile */}
            <div className="border-border/60 flex flex-wrap items-center gap-4 border-t pt-4 text-xs font-medium text-foreground-muted sm:text-sm">
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
