"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface ChileSceneProps {
  progress: number;
  opacity?: number;
}

interface MountainPeak {
  pos: [number, number, number];
  scale: [number, number, number];
  color: string;
  snowHeight: number;
}

/**
 * ChileScene:
 * Representa a imponente paisagem da Cordilheira dos Andes do Chile.
 * Organizada em 3 camadas (foreground, midground, background) com picos
 * de montanha, cumes nevados, luz dourada andina e neblina de altitude.
 * Se houver um .glb do Chile no futuro, useGLTF pode ser plugado imediatamente.
 */
export const ChileScene: React.FC<ChileSceneProps> = ({
  progress,
  opacity = 1,
}) => {
  const chileGroupRef = useRef<THREE.Group>(null);

  // Aparece a partir de progress >= 0.40 com entrada gradual e atinge destaque pleno em 0.60 - 1.0
  const chileProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));
  const effectiveOpacity = opacity * chileProgress;

  // Montanhas dos Andes divididas em camadas com cumes pontiagudos e neve
  const { bgPeaks, mgPeaks, fgPeaks } = useMemo(() => {
    // Picos de fundo (cordilheira distante maciça: Z = -60 a -75)
    const bg: MountainPeak[] = [
      { pos: [-18, -2, -70], scale: [14, 18, 12], color: "#1e293b", snowHeight: 0.6 },
      { pos: [-6, 0, -68], scale: [16, 22, 14], color: "#334155", snowHeight: 0.55 },
      { pos: [8, 1, -72], scale: [18, 25, 15], color: "#1e293b", snowHeight: 0.5 },
      { pos: [22, -1, -69], scale: [15, 20, 13], color: "#334155", snowHeight: 0.6 },
    ];

    // Picos intermediários (montanhas mais próximas e detalhadas: Z = -45 a -55)
    const mg: MountainPeak[] = [
      { pos: [-12, -4, -50], scale: [10, 14, 9], color: "#475569", snowHeight: 0.58 },
      { pos: [0, -3, -48], scale: [12, 16, 10], color: "#3b4d61", snowHeight: 0.52 },
      { pos: [14, -4.5, -52], scale: [11, 15, 9.5], color: "#475569", snowHeight: 0.55 },
    ];

    // Foreground / Primeiro plano (colinas e vales: Z = -35 a -42)
    const fg: MountainPeak[] = [
      { pos: [-8, -6, -38], scale: [8, 9, 7], color: "#1e293b", snowHeight: 0.7 },
      { pos: [7, -6.5, -40], scale: [9, 10, 8], color: "#1e293b", snowHeight: 0.75 },
    ];

    return { bgPeaks: bg, mgPeaks: mg, fgPeaks: fg };
  }, []);

  useFrame((_, _delta) => {
    if (chileGroupRef.current && chileProgress > 0) {
      // Parallax sutil da cordilheira conforme a câmera avança
      chileGroupRef.current.position.y = (chileProgress - 1) * 0.8;
    }
  });

  if (effectiveOpacity <= 0.001) {
    return null;
  }

  return (
    <group ref={chileGroupRef} name="ChileSceneRoot" position={[0, 0, 0]}>
      {/* Sol andino quente / Luz de horizonte */}
      <mesh position={[15, 16, -78]}>
        <sphereGeometry args={[4, 24, 24]} />
        <meshBasicMaterial color="#fde047" transparent opacity={effectiveOpacity * 0.9} />
      </mesh>
      <pointLight
        position={[15, 16, -75]}
        intensity={3 * effectiveOpacity}
        color="#fef08a"
        distance={120}
      />

      {/* Camada 1: Picos Distantes dos Andes (Background) */}
      <group name="AndesBackground">
        {bgPeaks.map((peak, idx) => (
          <group key={`bg-peak-${idx}`} position={peak.pos} scale={peak.scale}>
            {/* Corpo rochoso da montanha */}
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[1, 1, 4]} />
              <meshStandardMaterial
                color={peak.color}
                roughness={0.9}
                transparent
                opacity={effectiveOpacity}
              />
            </mesh>
            {/* Pico nevado característico */}
            <mesh position={[0, 0.78, 0]} scale={[0.45, 0.45, 0.45]}>
              <coneGeometry args={[1, 1, 4]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.4}
                metalness={0.1}
                transparent
                opacity={effectiveOpacity}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Camada 2: Picos Intermediários (Midground) */}
      <group name="AndesMidground">
        {mgPeaks.map((peak, idx) => (
          <group key={`mg-peak-${idx}`} position={peak.pos} scale={peak.scale}>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[1, 1, 5]} />
              <meshStandardMaterial
                color={peak.color}
                roughness={0.85}
                transparent
                opacity={effectiveOpacity}
              />
            </mesh>
            <mesh position={[0, 0.75, 0]} scale={[0.5, 0.5, 0.5]}>
              <coneGeometry args={[1, 1, 5]} />
              <meshStandardMaterial
                color="#f8fafc"
                roughness={0.5}
                transparent
                opacity={effectiveOpacity}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Camada 3: Primeiro Plano / Vale Andino (Foreground) */}
      <group name="AndesForeground">
        {fgPeaks.map((peak, idx) => (
          <group key={`fg-peak-${idx}`} position={peak.pos} scale={peak.scale}>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[1.2, 1, 4]} />
              <meshStandardMaterial
                color={peak.color}
                roughness={0.9}
                transparent
                opacity={effectiveOpacity}
              />
            </mesh>
          </group>
        ))}
        {/* Solo do Vale Andino */}
        <mesh position={[0, -7.5, -45]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 60]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.95}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
      </group>
    </group>
  );
};
