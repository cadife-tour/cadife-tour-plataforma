"use client";

import type React from "react";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { interpolateCamera } from "../timeline/timelineUtils";

interface CameraRigProps {
  progress: number;
  isMobile?: boolean;
}

/**
 * CameraRig:
 * Controla os vetores de posição, alvo (lookAt) e campo de visão (fov)
 * da câmera 3D de forma contínua com interpolação suave (lerp).
 * Evita saltos ou descontinuidades visuais durante a rolagem.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  progress,
  isMobile = false,
}) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -5));

  useFrame((_, delta) => {
    // Obtém pontos da timeline interpolada
    const waypoints = interpolateCamera(progress);

    // Ajuste de enquadramento para dispositivos móveis
    const targetX = isMobile ? waypoints.position[0] * 0.7 : waypoints.position[0];
    const targetY = isMobile ? waypoints.position[1] + 0.1 : waypoints.position[1];
    const targetZ = waypoints.position[2];

    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);
    const targetAim = new THREE.Vector3(
      waypoints.target[0],
      waypoints.target[1],
      waypoints.target[2]
    );

    // Interpolação suave em direção ao target
    const lerpSpeed = Math.min(1, delta * 6);
    camera.position.lerp(targetPos, lerpSpeed);
    currentLookAt.current.lerp(targetAim, lerpSpeed);
    camera.lookAt(currentLookAt.current);

    // Interpolação do FOV se for PerspectiveCamera
    if ("fov" in camera && typeof (camera as THREE.PerspectiveCamera).fov === "number") {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isMobile ? waypoints.fov + 8 : waypoints.fov;
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, targetFov, lerpSpeed);
      persCamera.updateProjectionMatrix();
    }
  });

  return null;
};
