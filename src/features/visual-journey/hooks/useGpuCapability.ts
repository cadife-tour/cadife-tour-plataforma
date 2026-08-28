"use client";

import { useState, useEffect } from "react";

export interface GpuCapability {
  canRender3D: boolean;
  isReducedMotion: boolean;
  isSaveData: boolean;
  hasWebGL: boolean;
  effectiveDpr: number;
}

/**
 * Hook de detecção de capacidade de GPU, conexões econômicas e acessibilidade.
 *
 * Avalia de forma segura:
 * 1. prefers-reduced-motion: reduce
 * 2. navigator.connection.saveData
 * 3. Suporte real a WebGL / WebGL2 via criação de contexto em canvas temporário
 * 4. Ajuste seguro de DPR (Device Pixel Ratio)
 */
export function useGpuCapability(): GpuCapability {
  const [capability, setCapability] = useState<GpuCapability>({
    canRender3D: false,
    isReducedMotion: false,
    isSaveData: false,
    hasWebGL: false,
    effectiveDpr: 1,
  });

  useEffect(() => {
    // 1. Verificação de Reduced Motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReducedMotion = motionQuery.matches;

    // 2. Verificação de Save-Data (Conexão Econômica)
    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    const isSaveData = Boolean(nav.connection?.saveData);

    // 3. Verificação de Suporte a WebGL
    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      hasWebGL = Boolean(gl);
    } catch {
      hasWebGL = false;
    }

    // 4. Cálculo de DPR Seguro (Máx 1.5 em telas móveis/densas para economizar GPU)
    const isMobile = window.innerWidth < 768;
    const rawDpr = window.devicePixelRatio || 1;
    const effectiveDpr = isMobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2.0);

    // 5. Decisão de Habilitação do 3D
    const canRender3D = hasWebGL && !isReducedMotion && !isSaveData;

    setCapability({
      canRender3D,
      isReducedMotion,
      isSaveData,
      hasWebGL,
      effectiveDpr,
    });
  }, []);

  return capability;
}
