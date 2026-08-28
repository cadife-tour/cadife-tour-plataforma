"use client";

import { useState, useEffect } from "react";

export interface ScrollProgressState {
  /** Progresso total da página de 0.0 a 1.0 */
  scrollProgress: number;
  /** Estação ativa estimada com base na rolagem: 0 (Hero) a 4 (Footer) */
  activeStationIndex: number;
}

/**
 * Hook de leitura passiva do progresso de scroll nativo sem scrolljacking.
 *
 * Utiliza requestAnimationFrame para throttlar leituras do window.scrollY
 * sem bloquear a thread principal ou o touch/mouse do usuário.
 */
export function useScrollProgress(): ScrollProgressState {
  const [state, setState] = useState<ScrollProgressState>({
    scrollProgress: 0,
    activeStationIndex: 0,
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;

          const rawProgress =
            docHeight > 0 ? Math.min(Math.max(currentScroll / docHeight, 0), 1) : 0;

          // Mapeia 0.0 -> 1.0 em 5 estações principais (0 a 4)
          const activeStation = Math.min(Math.floor(rawProgress * 5), 4);

          setState({
            scrollProgress: rawProgress,
            activeStationIndex: activeStation,
          });

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return state;
}
