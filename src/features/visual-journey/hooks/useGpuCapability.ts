"use client";

import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/core/analytics";

export interface GpuCapability {
  canRender3D: boolean;
  isReducedMotion: boolean;
  isSaveData: boolean;
  isConstrainedDevice: boolean;
  hasWebGL: boolean;
  effectiveDpr: number;
}

/**
 * Hook de detecção de capacidade de GPU, conexões econômicas e acessibilidade.
 *
 * Avalia de forma segura:
 * 1. prefers-reduced-motion: reduce
 * 2. navigator.connection.saveData
 * 3. CPU/memória limitada, quando o navegador expõe esses indicadores
 * 4. Suporte real a WebGL / WebGL2 via criação de contexto em canvas temporário
 * 5. Ajuste seguro de DPR (Device Pixel Ratio)
 */
export function useGpuCapability(): GpuCapability {
  const hasEmittedStatus = useRef(false);
  const [capability, setCapability] = useState<GpuCapability>({
    canRender3D: false,
    isReducedMotion: false,
    isSaveData: false,
    isConstrainedDevice: false,
    hasWebGL: false,
    effectiveDpr: 1,
  });

  useEffect(() => {
    // 1. Verificação de Reduced Motion
    let isReducedMotion = false;
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      isReducedMotion = Boolean(motionQuery.matches);
    }

    // 2. Verificação de Save-Data (Conexão Econômica)
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const isSaveData = Boolean(nav.connection?.saveData);
    const isConstrainedDevice =
      (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) ||
      (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2);

    // 4. Verificação de Suporte a WebGL
    let hasWebGL = false;
    if (!isReducedMotion && !isSaveData && !isConstrainedDevice) {
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
    }

    // 5. Cálculo de DPR Seguro (Máx 1.5 em telas móveis/densas para economizar GPU)
    const isMobile = window.innerWidth < 768;
    const rawDpr = window.devicePixelRatio || 1;
    const effectiveDpr = isMobile ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2.0);

    // 6. Decisão de Habilitação do 3D
    const canRender3D = hasWebGL && !isReducedMotion && !isSaveData && !isConstrainedDevice;

    setCapability({
      canRender3D,
      isReducedMotion,
      isSaveData,
      isConstrainedDevice,
      hasWebGL,
      effectiveDpr,
    });

    // 7. Emissão única do evento técnico webgl_status
    if (!hasEmittedStatus.current) {
      hasEmittedStatus.current = true;
      let status:
        | "active"
        | "fallback_reduced_motion"
        | "fallback_save_data"
        | "fallback_low_power"
        | "fallback_no_webgl" = "active";

      if (isReducedMotion) {
        status = "fallback_reduced_motion";
      } else if (isSaveData) {
        status = "fallback_save_data";
      } else if (isConstrainedDevice) {
        status = "fallback_low_power";
      } else if (!hasWebGL) {
        status = "fallback_no_webgl";
      }

      trackEvent("webgl_status", {
        status,
        dpr: effectiveDpr,
        is_mobile: isMobile,
      });
    }
  }, []);

  return capability;
}
