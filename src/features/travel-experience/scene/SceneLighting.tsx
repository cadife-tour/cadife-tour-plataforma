"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface SceneLightingProps {
  progress: number;
}

/**
 * SceneLighting:
 * Transiciona a iluminação dinamicamente:
 * - Cabine do avião (0.0 - 0.25): ambiente escuro acolhedor + luz pontual suave
 * - Nuvens (0.25 - 0.50): luz branca difusa intensa de alta altitude
 * - Chile (0.50 - 1.00): luz dourada quente do sol dos Andes e céu límpido
 */
export const SceneLighting: React.FC<SceneLightingProps> = ({ progress }) => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    if (!dirLightRef.current || !ambientLightRef.current) return;

    if (progress < 0.25) {
      // Cabine
      dirLightRef.current.intensity = 0.8;
      dirLightRef.current.color.set("#93c5fd");
      ambientLightRef.current.intensity = 0.35;
      ambientLightRef.current.color.set("#0f172a");
    } else if (progress < 0.5) {
      // Nuvens
      dirLightRef.current.intensity = 2.0;
      dirLightRef.current.color.set("#ffffff");
      ambientLightRef.current.intensity = 0.9;
      ambientLightRef.current.color.set("#e2e8f0");
    } else {
      // Chile / Andes
      const t = Math.min(1, (progress - 0.5) * 2);
      dirLightRef.current.intensity = 1.8;
      dirLightRef.current.color.set(t > 0.5 ? "#fed7aa" : "#ffffff");
      ambientLightRef.current.intensity = 0.7;
      ambientLightRef.current.color.set("#38bdf8");
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.4} color="#0f172a" />
      <directionalLight
        ref={dirLightRef}
        position={[10, 15, 5]}
        intensity={1.2}
        color="#ffffff"
      />
    </>
  );
};
