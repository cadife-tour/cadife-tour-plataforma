"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";
import { StaticAtmosphere } from "@/features/visual-journey/fallback/StaticAtmosphere";
import { TravelOverlay } from "./components/TravelOverlay";
import { LoadingScreen } from "./components/LoadingScreen";
import { ASSET_MANIFEST } from "./assets/assetManifest";
import { TRAVEL_EXPERIENCE_CONFIG } from "./config/travelExperienceConfig";

/**
 * TravelExperience:
 * Hero Cinematográfico com scrubbing de vídeo ultra fluido diretamente conectado
 * ao GSAP ScrollTrigger timeline (técnica profissional estilo Apple / Awwwards).
 */
export const TravelExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { isReducedMotion } = useGpuCapability();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current;

    // Garante que o vídeo não rode solto
    video.pause();

    const setupTimeline = () => {
      video.pause();
      const duration = video.duration || 5;

      // Objeto proxy animado com GSAP scrub: 1 (amortecimento inercial sedoso)
      const videoProxy = { currentTime: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.12,
          onUpdate: (self) => {
            setProgress(self.progress);
          },
        },
      });

      // O vídeo completa 100% da sua duração em 85% do scroll, permitindo apreciar os Andes e o CTA do Chile com calma
      tl.to(videoProxy, {
        currentTime: duration,
        ease: "none",
        duration: 0.85,
        onUpdate: () => {
          if (video && !isNaN(videoProxy.currentTime)) {
            video.currentTime = Math.min(videoProxy.currentTime, duration - 0.001);
          }
        },
      });

      // Os últimos 15% do scroll sustentam o frame final dos Andes com o CTA
      tl.to(videoProxy, {
        duration: 0.15,
      });

      return tl;
    };

    let activeTl: gsap.core.Timeline | null = null;

    if (video.readyState >= 1) {
      activeTl = setupTimeline();
    } else {
      video.onloadedmetadata = () => {
        activeTl = setupTimeline();
      };
    }

    return () => {
      if (activeTl) {
        activeTl.scrollTrigger?.kill();
        activeTl.kill();
      }
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return (
      <section
        className="relative min-h-[90vh] flex flex-col justify-center border-b border-border overflow-hidden"
        aria-label="Experiência de Viagem CADIFE Tour"
      >
        <StaticAtmosphere />
        <TravelOverlay progress={1.0} />
      </section>
    );
  }

  const sectionHeight = `${TRAVEL_EXPERIENCE_CONFIG.heroScrollHeightVh}vh`;

  return (
    <section
      ref={containerRef}
      className="relative w-full border-b border-border"
      style={{ height: sectionHeight }}
      aria-label="Experiência de Viagem CADIFE Tour — Trilha Interativa"
      data-testid="travel-experience-hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Vídeo com aceleração de hardware e renderização direta */}
        <video
          ref={videoRef}
          src={ASSET_MANIFEST.videos.heroJourney}
          playsInline
          muted
          autoPlay={false}
          preload="auto"
          className="h-full w-full object-cover object-center will-change-transform"
        />

        {/* Gradientes cinematográficos de contraste para os textos */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />

        {/* Overlay com Tipografia, Semântica e CTAs HTML/React */}
        <TravelOverlay progress={progress} />

        {/* Loading / Status leve no canto da tela */}
        <LoadingScreen isReady={isLoaded} />
      </div>
    </section>
  );
};
