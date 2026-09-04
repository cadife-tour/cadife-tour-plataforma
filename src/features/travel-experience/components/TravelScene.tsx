"use client";

import React from "react";
import { AirplaneScene } from "../scene/AirplaneScene";
import { CloudLayer } from "../scene/CloudLayer";
import { ChileScene } from "../scene/ChileScene";
import { SceneLighting } from "../scene/SceneLighting";

interface TravelSceneProps {
  progress: number;
  isMobile?: boolean;
}

/**
 * TravelScene:
 * Orquestra todos os elementos visuais 3D dentro do Canvas R3F:
 * Iluminação, Avião/Janela, Camadas de Nuvens e Cordilheira do Chile.
 */
export const TravelScene: React.FC<TravelSceneProps> = ({
  progress,
}) => {
  return (
    <>
      <SceneLighting progress={progress} />
      <AirplaneScene progress={progress} />
      <CloudLayer progress={progress} />
      <ChileScene progress={progress} />
    </>
  );
};
