"use client";

import React from "react";

interface LoadingScreenProps {
  isReady?: boolean;
}

/**
 * LoadingScreen:
 * Feedback leve e não-bloqueante para a inicialização dos assets da viagem 3D.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isReady = false,
}) => {
  return (
    <div
      className={`pointer-events-none absolute bottom-8 right-8 z-20 flex items-center gap-3 rounded-full border border-border/60 bg-surface/80 px-4 py-2 text-xs font-medium text-foreground-muted backdrop-blur-md transition-opacity duration-500 ${
        isReady ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
    >
      <div className="h-2 w-2 rounded-full bg-brand-accent animate-ping" />
      <span>{isReady ? "Role para começar" : "Preparando sua viagem..."}</span>
    </div>
  );
};
