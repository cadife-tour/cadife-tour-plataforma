"use client";

import React, { useRef } from "react";
import type * as THREE from "three";

interface AirplaneSceneProps {
  progress: number;
  opacity?: number;
}

/**
 * AirplaneScene:
 * Representa a cabine e estrutura de janela do avião.
 * Preparada para carregar .glb quando fornecido, ou renderizar geometria
 * elegante procedural (cabine, assento, painel e moldura da janela com vista exterior).
 */
export const AirplaneScene: React.FC<AirplaneSceneProps> = ({
  progress,
  opacity = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // O avião desvanece suavemente conforme a câmera atravessa a janela (progress > 0.3)
  const planeFade = Math.max(0, Math.min(1, 1 - (progress - 0.25) / 0.1));
  const effectiveOpacity = opacity * planeFade;

  if (effectiveOpacity <= 0.001) {
    return null;
  }

  return (
    <group ref={groupRef} name="AirplaneRoot" position={[0, 0, 0]}>
      {/* Fuselagem interna / Parede da cabine */}
      <mesh position={[1.2, 0, 0]} receiveShadow>
        <boxGeometry args={[0.05, 3.5, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.7}
          transparent
          opacity={effectiveOpacity}
        />
      </mesh>

      {/* Parede oposta da cabine */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.05, 3.5, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.7}
          transparent
          opacity={effectiveOpacity}
        />
      </mesh>

      {/* Teto da cabine */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[2.5, 0.05, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.8}
          transparent
          opacity={effectiveOpacity}
        />
      </mesh>

      {/* Piso da cabine */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[2.5, 0.05, 8]} />
        <meshStandardMaterial
          color="#090d16"
          roughness={0.9}
          transparent
          opacity={effectiveOpacity}
        />
      </mesh>

      {/* Assentos esquemáticos (Cockpit / Poltrona do passageiro) */}
      <group position={[0.4, -0.6, 0.8]}>
        {/* Assento */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.6]} />
          <meshStandardMaterial
            color="#1e3a8a"
            roughness={0.6}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
        {/* Encosto */}
        <mesh position={[0, 0.5, 0.25]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.58, 0.9, 0.12]} />
          <meshStandardMaterial
            color="#1e3a8a"
            roughness={0.6}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
        {/* Encosto de cabeça */}
        <mesh position={[0, 1.05, 0.2]}>
          <boxGeometry args={[0.4, 0.25, 0.1]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.4}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
      </group>

      {/* Moldura da Janela do Avião (Window) */}
      <group position={[1.16, 0.05, 0]}>
        {/* Moldura externa */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.55, 0.08, 16, 32]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.2}
            roughness={0.4}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>

        {/* Vidro da janela translúcido reflexivo */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.52, 32]} />
          <meshPhysicalMaterial
            color="#7dd3fc"
            transmission={0.8}
            opacity={Math.min(0.4, effectiveOpacity)}
            transparent
            roughness={0.1}
            ior={1.4}
          />
        </mesh>

        {/* Luz de leitura do painel acima da janela */}
        <pointLight
          position={[-0.3, 0.7, 0]}
          intensity={0.6 * effectiveOpacity}
          distance={2.5}
          color="#fed7aa"
        />
      </group>

      {/* Asa do avião visível através da janela */}
      <group position={[2.5, -0.4, -2]} rotation={[0.05, 0.2, -0.1]}>
        <mesh name="Wing">
          <boxGeometry args={[2.8, 0.08, 1.4]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.4}
            roughness={0.3}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
        {/* Ponta da asa / Winglet com luz de navegação */}
        <mesh position={[1.35, 0.35, -0.1]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.08, 0.8, 0.6]} />
          <meshStandardMaterial
            color="#e11d48"
            emissive="#e11d48"
            emissiveIntensity={1.5}
            transparent
            opacity={effectiveOpacity}
          />
        </mesh>
      </group>
    </group>
  );
};
