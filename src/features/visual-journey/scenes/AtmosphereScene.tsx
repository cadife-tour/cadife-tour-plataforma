"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereSceneProps {
  scrollProgress: number;
  activeStationIndex: number;
  isMobile?: boolean;
}

// Cores temáticas por estação (RGB normalizado)
const STATION_ATMOSPHERE_COLORS = [
  new THREE.Color("#0284c7"), // Estação 0 (Hero): Sky Blue / Céu de altitude
  new THREE.Color("#eab308"), // Estação 1 (Europa): Dourado quente / Cultura
  new THREE.Color("#38bdf8"), // Estação 2 (Natureza): Névoa cristalina / Andes
  new THREE.Color("#0369a1"), // Estação 3 (Cruzeiros): Azul oceano profundo
  new THREE.Color("#1e293b"), // Estação 4 (Agência): Neutro suave / Foco em leitura
];

/**
 * Cena WebGL de partículas e atmosfera procedural.
 *
 * Renderiza uma nuvem leve de partículas e horizonte iluminado,
 * interpolando cores e densidade conforme o scroll progress.
 */
export const AtmosphereScene: React.FC<AtmosphereSceneProps> = ({
  scrollProgress,
  activeStationIndex,
  isMobile = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Redução de partículas no mobile para garantir 60 FPS
  const count = isMobile ? 350 : 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor = new THREE.Color("#38bdf8");

    for (let i = 0; i < count; i++) {
      // Distribuição elíptica ampla em profundidade (Z: -20 a 10)
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      col[i * 3] = baseColor.r;
      col[i * 3 + 1] = baseColor.g;
      col[i * 3 + 2] = baseColor.b;
    }

    return [pos, col];
  }, [count]);

  // Loop de animação sutil a 60 FPS
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotação orbital extremamente suave (0.05 rad/s)
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }

    if (lightRef.current) {
      const targetColor =
        STATION_ATMOSPHERE_COLORS[activeStationIndex] ??
        STATION_ATMOSPHERE_COLORS[0]!;
      lightRef.current.color.lerp(targetColor, delta * 2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight
        ref={lightRef}
        position={[0, 5, 10]}
        intensity={2.5}
        distance={40}
      />

      {/* Nuvem de partículas de altitude */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.08 : 0.12}
          vertexColors
          transparent
          opacity={Math.max(0.2, 0.7 - scrollProgress * 0.4)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};
