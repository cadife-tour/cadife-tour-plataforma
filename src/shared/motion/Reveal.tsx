"use client";

import React, { useEffect, useRef, useState } from "react";
import { MOTION_REVEAL } from "./tokens";
import { prefersReducedMotion } from "./index";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Índice para escalonamento discreto (staggerMs * index) */
  index?: number;
  /** Variante de duração: 'reveal' para cards/blocos, 'editorial' para headlines */
  variant?: "reveal" | "editorial";
}

/**
 * Reveal:
 * Entrada única e discreta ao entrar no viewport usando `MOTION_REVEAL`.
 * Nunca esconde conteúdo em SSR, em `prefers-reduced-motion: reduce`, ou quando
 * `IntersectionObserver` não está disponível.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = "",
  index = 0,
  variant = "reveal",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasEntered, setHasEntered] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      return;
    }

    setHasEntered(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const durationClass = variant === "editorial" ? "duration-editorial" : "duration-reveal";
  const delayMs = index > 0 ? Math.min(index, 4) * MOTION_REVEAL.staggerMs : 0;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: hasEntered && delayMs > 0 ? `${delayMs}ms` : undefined,
        transform: hasEntered ? "translateY(0px)" : `translateY(${MOTION_REVEAL.distanceY}px)`,
      }}
      className={`transition-[opacity,transform] ${durationClass} ease-standard motion-reduce:transform-none motion-reduce:transition-none ${
        hasEntered ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};
