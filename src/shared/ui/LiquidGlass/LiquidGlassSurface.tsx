"use client";

import { createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

/** Aparência do vidro passada ao renderer WebGL (subconjunto das opções da biblioteca). */
export interface LiquidGlassLook {
  /** Camada leitosa, 0–1.5. Use ~0.5+ quando houver texto por cima. */
  tint?: number;
  /** "dark" para texto branco; "light" para texto escuro. */
  tintTone?: "light" | "dark" | "auto";
  /** Desfoque atrás da lente, proporcional ao lado menor. */
  frost?: number;
  /** Força de refração do corpo (0–110). */
  refraction?: number;
}

export const glassPresets = {
  /** Barras e pílulas com texto branco: header, seletor de página. */
  bar: { tint: 0.42, tintTone: "dark", frost: 0.05, refraction: 84 },
  /** Menus sobre conteúdo variado: mais corpo para legibilidade. */
  menu: { tint: 0.85, tintTone: "dark", frost: 0.22, refraction: 52 },
} satisfies Record<string, LiquidGlassLook>;

interface LiquidGlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "nav";
  look?: LiquidGlassLook;
  /** Classes extras: a superfície já recebe `liquid-glass` como reserva em CSS. */
  className?: string;
  children?: ReactNode;
}

/**
 * Superfície de Liquid Glass com refração real em WebGL2 (apple-liquid-glass-webgl).
 *
 * - A biblioteca é carregada só no navegador, sob demanda, fora do bundle inicial.
 * - Sem WebGL2 (ou se o carregamento falhar) fica o vidro em CSS da classe `liquid-glass`.
 * - Quando o WebGL assume, a biblioteca marca `data-liquid-glass="webgl"` e o CSS
 *   desliga a camada de reserva para não duplicar o efeito.
 */
export function LiquidGlassSurface({
  as = "div",
  look = glassPresets.bar,
  className,
  children,
  ...rest
}: LiquidGlassSurfaceProps) {
  const ref = useRef<HTMLElement>(null);
  const { tint, tintTone, frost, refraction } = look;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cancelled = false;
    let instance: { destroy: () => void } | undefined;

    import("apple-liquid-glass-webgl")
      .then(({ LiquidGlass }) => {
        if (cancelled || !LiquidGlass.isSupported()) return;
        instance = new LiquidGlass(element, {
          tint,
          tintTone,
          frost,
          fallback: "none",
          ...(refraction === undefined ? {} : { material: { refraction } }),
        });
      })
      .catch((error: unknown) => {
        // Falha ao carregar o renderer: a reserva em CSS continua valendo.
        if (process.env.NODE_ENV === "development") {
          console.warn("[LiquidGlass] usando reserva em CSS:", error);
        }
      });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [tint, tintTone, frost, refraction]);

  return createElement(as, { ref, className: clsx("liquid-glass", className), ...rest }, children);
}
