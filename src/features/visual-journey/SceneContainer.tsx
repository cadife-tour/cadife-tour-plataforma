"use client";

import React, { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { StaticAtmosphere } from "./fallback/StaticAtmosphere";
import { AtmosphereScene } from "./scenes/AtmosphereScene";
import { CameraRig } from "./scenes/CameraRig";

interface SceneContainerProps {
  scrollProgress: number;
  activeStationIndex: number;
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

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[WebGL Fallback Triggered]", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * SceneContainer isola o contexto do React Three Fiber com ErrorBoundary
 * e tratamento automático de perda de contexto (webglcontextlost).
 */
export default function SceneContainer({
  scrollProgress,
  activeStationIndex,
  effectiveDpr,
  isMobile = false,
}: SceneContainerProps) {
  return (
    <WebGlErrorBoundary fallback={<StaticAtmosphere />}>
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
        data-testid="webgl-canvas-container"
      >
        <Canvas
          dpr={effectiveDpr}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
            alpha: true,
          }}
          camera={{ position: [0, 0, 10], fov: 60 }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                if (process.env.NODE_ENV === "development") {
                  console.warn("[WebGL Context Lost] Handled safely.");
                }
              },
              false
            );
          }}
        >
          <CameraRig scrollProgress={scrollProgress} />
          <AtmosphereScene
            scrollProgress={scrollProgress}
            activeStationIndex={activeStationIndex}
            isMobile={isMobile}
          />
        </Canvas>
      </div>
    </WebGlErrorBoundary>
  );
}
