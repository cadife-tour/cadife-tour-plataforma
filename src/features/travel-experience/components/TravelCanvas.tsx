"use client";

import React, { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "../camera/CameraRig";
import { TravelScene } from "./TravelScene";
import { StaticAtmosphere } from "@/features/visual-journey/fallback/StaticAtmosphere";

interface TravelCanvasProps {
  progress: number;
  effectiveDpr: number;
  isMobile?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGlErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[TravelCanvas WebGL Fallback]", error);
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * TravelCanvas:
 * Canvas R3F isolado, com DPR seguro, perda de contexto WebGL tratada e ErrorBoundary.
 */
export default function TravelCanvas({
  progress,
  effectiveDpr,
  isMobile = false,
}: TravelCanvasProps) {
  return (
    <WebGlErrorBoundary fallback={<StaticAtmosphere />}>
      <div
        className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
        aria-hidden="true"
        data-testid="travel-experience-canvas"
      >
        <Canvas
          dpr={effectiveDpr}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
            alpha: true,
          }}
          camera={{ position: [0, 0, 5], fov: 55 }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                if (process.env.NODE_ENV === "development") {
                  console.warn("[TravelCanvas WebGL Context Lost] Recovering...");
                }
              },
              false
            );
          }}
        >
          <CameraRig progress={progress} isMobile={isMobile} />
          <TravelScene progress={progress} isMobile={isMobile} />
        </Canvas>
      </div>
    </WebGlErrorBoundary>
  );
}
