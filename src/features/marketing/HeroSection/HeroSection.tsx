"use client";

import React, { useState } from "react";
import { WebGLRevealHero } from "./WebGLRevealHero";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { useLocale } from "@/core/i18n/LocaleContext";
import { Sparkles, Video, MousePointer2 } from "lucide-react";

/**
 * HeroSection:
 * Mantém as DUAS versões da hero para a CADIFE Tour:
 * 1. "reveal": Foto limpa em tela cheia (sem texto na frente) com efeito fluido estilo Lando Norris
 *    (revelando o paraíso sob o cursor do mouse com cores e aura da Cadife).
 * 2. "video": A versão original da Cadife com a jornada cinematográfica em vídeo (TravelExperience).
 *
 * O seletor superior discreto permite alternar e visualizar as duas versões instantaneamente.
 */
export const HeroSection: React.FC = () => {
  const { locale } = useLocale();
  const isPt = locale === "pt";

  // Estado que mantém as duas versões ativas e alternáveis
  const [activeHero, setActiveHero] = useState<"reveal" | "video">("reveal");

  return (
    <div className="relative w-full">
      {/* VERSÃO 1: FOTO COM EFEITO LANDO NORRIS EM TELA CHEIA LIMPA */}
      {activeHero === "reveal" && (
        <section className="relative mt-16 sm:mt-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#141312] text-white">
          {/* SELETOR FLUTUANTE DISCRETO COM AS CORES DA CADIFE TOUR */}
          <div className="absolute top-6 right-4 sm:right-8 z-30 flex items-center gap-1.5 rounded-full bg-[#141312]/85 p-1.5 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            <button
              onClick={() => setActiveHero("reveal")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#dd0b0e] text-white shadow-[0_0_16px_rgba(221,11,14,0.45)] transition-all duration-300"
              title={isPt ? "Ver versão foto revelação estilo Lando Norris" : "View photo reveal version"}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPt ? "Foto Revelação" : "Photo Reveal"}</span>
            </button>

            <button
              onClick={() => setActiveHero("video")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
              title={isPt ? "Ver versão original com jornada em vídeo" : "View original video journey version"}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isPt ? "Jornada em Vídeo (Original)" : "Video Journey (Original)"}</span>
            </button>
          </div>

          {/* O CANVAS DE REVELAÇÃO FLUIDA ESTILO LANDO NORRIS */}
          <div className="relative h-full w-full cursor-crosshair">
            <WebGLRevealHero
              imageOfficeSrc="/demo-ln4/office.png"
              imageParadiseSrc="/demo-ln4/paradise.png"
            />
          </div>

          {/* Dica sutil e elegante no rodapé da hero */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141312]/80 backdrop-blur-md border border-white/10 text-white/80 shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dd0b0e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dd0b0e]" />
            </span>
            <MousePointer2 className="w-3.5 h-3.5 text-[#dd0b0e]" />
            <span className="text-xs font-medium tracking-wide">
              {isPt
                ? "Mova o cursor pela tela para revelar o paraíso"
                : "Move cursor across the screen to reveal paradise"}
            </span>
          </div>
        </section>
      )}

      {/* VERSÃO 2: A JORNADA ORIGINAL EM VÍDEO (TRAVELEXPERIENCE) */}
      {activeHero === "video" && (
        <div className="relative w-full">
          {/* SELETOR FLUTUANTE EM MODO VÍDEO PARA VOLTAR À FOTO QUANDO QUISER */}
          <div className="fixed top-24 right-4 sm:right-8 z-40 flex items-center gap-1.5 rounded-full bg-[#141312]/85 p-1.5 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            <button
              onClick={() => setActiveHero("reveal")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
              title={isPt ? "Ver versão foto com fluido interativo" : "View fluid photo reveal version"}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPt ? "Foto Revelação" : "Photo Reveal"}</span>
            </button>

            <button
              onClick={() => setActiveHero("video")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#dd0b0e] text-white shadow-[0_0_16px_rgba(221,11,14,0.45)] transition-all duration-300"
              title={isPt ? "Ver versão original com jornada em vídeo" : "View original video journey version"}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isPt ? "Jornada em Vídeo (Original)" : "Video Journey (Original)"}</span>
            </button>
          </div>

          <TravelExperience />
        </div>
      )}
    </div>
  );
};

