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
}

/**
 * TravelOverlay:
 * Renderiza textos, títulos e CTAs em HTML semântico e acessível,
 * reagindo com transição suave ao progresso do scroll do Hero (Avião -> Janela -> Nuvens -> Chile).
 */
export const TravelOverlay: React.FC<TravelOverlayProps> = ({ progress }) => {
  const { locale } = useLocale();
  const _currentPhase = getPhaseFromProgress(progress);

  // Textos para cada fase da jornada
  const content = {
    pt: {
      airplane: {
        badge: "Uma nova experiência. Uma nova memória.",
        title: "Sua próxima grande jornada planejada com excelência humana.",
        subtitle: "O mundo começa do outro lado da janela.",
        scrollHint: "Role para iniciar a viagem",
        primaryCta: "Planejar Minha Viagem",
        secondaryCta: "Explorar Destinos",
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
          "Das montanhas nevadas e vinhedos do Valle Central à beleza selvagem da Patagônia chilena.",
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
        subtitle: "The world begins just beyond the window.",
        scrollHint: "Scroll to begin journey",
        primaryCta: "Plan My Journey",
        secondaryCta: "Explore Destinations",
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
          "From snow-capped peaks and Central Valley vineyards to wild Patagonian landscapes.",
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
        subtitle: "El mundo comienza al otro lado de la ventana.",
        scrollHint: "Deslice para iniciar el viaje",
        primaryCta: "Planificar Mi Viaje",
        secondaryCta: "Explorar Destinos",
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
          "De montañas nevadas y viñedos del Valle Central a la belleza salvaje de la Patagonia.",
        primaryCta: "Quiero Conocer Chile",
        secondaryCta: "Ver Itinerarios Completos",
      },
      trustPill1: "Atención 100% Humana",
      trustPill2: "Itinerarios a Medida",
      trustPill3: "Soporte 24h en Destino",
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
  // Clouds text: surge sutilmente em 0.3 a 0.45
  const cloudsOpacity =
    progress >= 0.28 && progress <= 0.52
      ? Math.sin(((progress - 0.28) / 0.24) * Math.PI)
      : 0;
  // Chile: surge a partir de 0.55 até 1.0
  const chileOpacity = Math.max(0, Math.min(1, (progress - 0.52) / 0.2));

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
    <div className="absolute inset-0 flex flex-col justify-center pointer-events-none z-10">
      <Container>
        <div className="max-w-3xl relative min-h-[460px] flex items-center">
          {/* 1. INTRO / AIRPLANE */}
          <div
            className={`space-y-6 transition-all duration-300 ${
              introOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0 invisible"
            }`}
            style={{ opacity: introOpacity }}
            aria-hidden={introOpacity <= 0.05}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" aria-hidden="true" />
              <span>{t.airplane.badge}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] [text-shadow:_0_2px_12px_rgba(0,0,0,0.8)]">
              {t.airplane.title}
            </h1>

            <p className="text-lg text-white/90 sm:text-xl leading-relaxed max-w-2xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              {t.airplane.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" asChild>
                <a
                  href={introWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleIntroCta}
                  aria-label={`${t.airplane.primaryCta} no WhatsApp (abre em nova aba)`}
                >
                  {t.airplane.primaryCta}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.airplane.secondaryCta}</a>
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-4 text-xs font-medium text-brand-accent animate-bounce">
              <span>↓</span>
              <span>{t.airplane.scrollHint}</span>
            </div>
          </div>

          {/* 2. TRANSITION / CLOUDS */}
          {cloudsOpacity > 0.02 && (
            <div
              className="absolute inset-0 flex flex-col justify-center space-y-4 pointer-events-none transition-opacity duration-300"
              style={{ opacity: cloudsOpacity }}
              aria-hidden="true"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-4 py-1 text-xs font-medium text-white shadow-sm">
                <span>{t.clouds.badge}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl max-w-xl drop-shadow-lg">
                {t.clouds.title}
              </h2>
              <p className="text-base text-white/80 max-w-lg drop-shadow">
                {t.clouds.subtitle}
              </p>
            </div>
          )}

          {/* 3. REVEAL / CHILE */}
          <div
            className={`absolute inset-0 flex flex-col justify-center space-y-6 transition-all duration-500 ${
              chileOpacity > 0.05
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0 invisible"
            }`}
            style={{ opacity: chileOpacity }}
            aria-hidden={chileOpacity <= 0.05}
          >
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-brand-accent/40 bg-surface/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden="true" />
              <span>{t.chile.badge}</span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1] drop-shadow-md">
              {t.chile.title}
            </h2>

            <p className="text-lg text-foreground-muted sm:text-xl leading-relaxed max-w-2xl drop-shadow">
              {t.chile.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" asChild>
                <a
                  href={chileWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleChileCta}
                  aria-label={`${t.chile.primaryCta} no WhatsApp (abre em nova aba)`}
                >
                  {t.chile.primaryCta}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">{t.chile.secondaryCta}</a>
              </Button>
            </div>

            {/* Trust Indicators na fase Chile */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60 text-xs font-medium text-foreground-muted sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
                <span>{t.trustPill1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
                <span>{t.trustPill2}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-accent font-bold" aria-hidden="true">✓</span>
                <span>{t.trustPill3}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
