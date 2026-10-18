import React from "react";

/**
 * Fallback estático 2D em CSS puro (Matriz de Fallback Níveis 0, 1 e 2).
 *
 * Utiliza gradientes radiais suaves e profundidade ótica nativa sem baixar
 * Three.js, GSAP ou qualquer script pesado.
 */
export const StaticAtmosphere: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background ${className}`}
      aria-hidden="true"
      data-testid="static-atmosphere"
    >
      {/* 1. Horizonte Atmosférico Superior (Azul Céu Profundo) */}
      <div className="from-brand-secondary/20 via-brand-primary/10 absolute -top-[20%] left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent opacity-60 blur-3xl" />

      {/* 2. Destaque Dourado Suave Central (Luz de Viagem) */}
      <div className="from-brand-gold/10 absolute right-[10%] top-[40%] h-[50vh] w-[50vw] rounded-full bg-gradient-to-tr to-transparent opacity-40 blur-3xl" />

      {/* 3. Profundidade Oceânica Inferior */}
      <div className="from-brand-primary/15 via-surface/40 absolute -bottom-[10%] left-[5%] h-[60vh] w-[80vw] rounded-full bg-gradient-to-t to-transparent opacity-50 blur-3xl" />
    </div>
  );
};
