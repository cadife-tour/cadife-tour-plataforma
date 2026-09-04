"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface CloudLayerProps {
  progress: number;
  opacity?: number;
}

interface PuffData {
  pos: [number, number, number];
  scale: [number, number, number];
  rotationZ: number;
}

/**
 * CloudLayer:
 * Implementa 3 camadas distintas (foreground, midground, background)
 * com esferas/elipsoides suaves semi-transparentes agrupadas.
 * Não utiliza volumetria pesada, garantindo 60fps constantes e sensação
 * cinematográfica imediata de atravessar nuvens e neblina de altitude.
 */
export const CloudLayer: React.FC<CloudLayerProps> = ({
  progress,
  opacity = 1,
}) => {
  const fgRef = useRef<THREE.Group>(null);
  const mgRef = useRef<THREE.Group>(null);
  const bgRef = useRef<THREE.Group>(null);

  // Calcula intensidade da camada de nuvens:
  // Começa sutil em 0.20, atinge ápice em 0.35 - 0.45, e abre revelando Chile em 0.50 - 0.70
  const cloudIntensity = useMemo(() => {
    if (progress < 0.15) return 0.2; // visíveis lá fora pela janela
    if (progress < 0.30) return 0.2 + (progress - 0.15) * 4; // aproximando
    if (progress < 0.50) return 1.0; // imersão total
    if (progress < 0.70) return Math.max(0, 1.0 - (progress - 0.50) * 4.5); // abrindo
    return 0;
  }, [progress]);

  const effectiveOpacity = opacity * cloudIntensity;

  // Gera nuvens em 3 profundidades
  const { fgPuffs, mgPuffs, bgPuffs } = useMemo(() => {
    const makePuffs = (count: number, zBase: number, zSpread: number, spreadX: number, spreadY: number): PuffData[] => {
      const items: PuffData[] = [];
      for (let i = 0; i < count; i++) {
        items.push({
          pos: [
            (Math.sin(i * 1.7) * spreadX) + 0.5,
            (Math.cos(i * 2.3) * spreadY) - 0.5,
            zBase + (Math.sin(i * 3.1) * zSpread),
          ],
          scale: [
            2.5 + Math.abs(Math.sin(i)) * 2,
            1.2 + Math.abs(Math.cos(i)) * 1.5,
            2.0 + Math.abs(Math.sin(i * 1.5)) * 1.5,
          ],
          rotationZ: Math.sin(i) * 0.4,
        });
      }
      return items;
    };

    return {
      // Foreground: Z entre -8 e -14 (atravessadas de perto pela câmera)
      fgPuffs: makePuffs(12, -11, 3, 6, 3),
      // Midground: Z entre -16 e -24 (corpo denso das nuvens)
      mgPuffs: makePuffs(18, -20, 4, 12, 4),
      // Background: Z entre -26 e -35 (mar de nuvens no horizonte)
      bgPuffs: makePuffs(22, -30, 5, 20, 5),
    };
  }, []);

  useFrame((_, delta) => {
    // Parallax e drift sutil em cada camada
    if (fgRef.current) {
      fgRef.current.position.x += delta * 0.08;
    }
    if (mgRef.current) {
      mgRef.current.position.x += delta * 0.04;
    }
    if (bgRef.current) {
      bgRef.current.position.x += delta * 0.02;
    }
  });

  if (effectiveOpacity <= 0.001) {
    return null;
  }

  return (
    <group name="CloudLayersRoot">
      {/* 1. Foreground Clouds (próximas da câmera) */}
      <group ref={fgRef}>
        {fgPuffs.map((puff, idx) => (
          <mesh
            key={`fg-${idx}`}
            position={puff.pos}
            scale={puff.scale}
            rotation={[0, 0, puff.rotationZ]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.9}
              transparent
              opacity={effectiveOpacity * 0.75}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 2. Midground Clouds (camada intermediária e transição) */}
      <group ref={mgRef}>
        {mgPuffs.map((puff, idx) => (
          <mesh
            key={`mg-${idx}`}
            position={puff.pos}
            scale={puff.scale}
            rotation={[0, 0, puff.rotationZ]}
          >
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshStandardMaterial
              color="#f1f5f9"
              roughness={0.8}
              transparent
              opacity={effectiveOpacity * 0.85}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Background Clouds (manto de nuvens distantes sobre os vales) */}
      <group ref={bgRef}>
        {bgPuffs.map((puff, idx) => (
          <mesh
            key={`bg-${idx}`}
            position={puff.pos}
            scale={puff.scale}
            rotation={[0, 0, puff.rotationZ]}
          >
            <sphereGeometry args={[1.8, 16, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.85}
              transparent
              opacity={effectiveOpacity * 0.6}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
