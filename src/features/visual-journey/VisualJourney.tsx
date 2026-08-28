"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGpuCapability } from "./hooks/useGpuCapability";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { StaticAtmosphere } from "./fallback/StaticAtmosphere";

// Carregamento assíncrono estrito com fallback estático instantâneo (Zero blocking no LCP/Core)
const DynamicSceneContainer = dynamic(
  () => import("./SceneContainer"),
  {
    ssr: false,
    loading: () => <StaticAtmosphere />,
  }
);

/**
 * VisualJourney — Client Boundary Principal da Camada Visual
 *
 * Avalia as capacidades do dispositivo (Reduced Motion, WebGL, Save-Data)
 * e decide transparentemente se renderiza o Canvas WebGL ou o fallback StaticAtmosphere.
 */
export const VisualJourney: React.FC = () => {
  const { canRender3D, effectiveDpr } = useGpuCapability();
  const { scrollProgress, activeStationIndex } = useScrollProgress();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Se o dispositivo não suporta ou prefere economia de movimento/dados -> Fallback puro
  if (!canRender3D) {
    return <StaticAtmosphere />;
  }

  return (
    <DynamicSceneContainer
      scrollProgress={scrollProgress}
      activeStationIndex={activeStationIndex}
      effectiveDpr={effectiveDpr}
      isMobile={isMobile}
    />
  );
};
