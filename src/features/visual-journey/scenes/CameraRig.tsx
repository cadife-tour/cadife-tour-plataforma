"use client";

import type React from "react";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  scrollProgress: number;
}

/**
 * CameraRig controla suavemente o posicionamento da câmera 3D
 * atrelado à rolagem da página, utilizando interpolação linear (lerp).
 */
export const CameraRig: React.FC<CameraRigProps> = ({ scrollProgress }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));

  useFrame((_, delta) => {
    // A câmera desce sutilmente em Y e avança em Z conforme a jornada avança
    targetPos.current.y = -scrollProgress * 4;
    targetPos.current.z = 10 - scrollProgress * 3;
    targetPos.current.x = Math.sin(scrollProgress * Math.PI) * 1.5;

    camera.position.lerp(targetPos.current, delta * 3);
    camera.lookAt(0, targetPos.current.y, 0);
  });

  return null;
};
