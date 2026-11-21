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
  /** Desfoque absoluto do que está atrás, em px (0–64). Use quando há texto passando por trás. */
  blur?: number;
}

export const glassPresets = {
  /** Barras e pílulas com texto branco: header, seletor de página. */
  bar: { tint: 0.42, tintTone: "dark", frost: 0.05, refraction: 84 },
  /** Barra com conteúdo passando atrás: mesmo vidro, mais desfoque para o texto não vazar. */
  barScrolled: { tint: 0.5, tintTone: "dark", frost: 0.05, refraction: 84, blur: 12 },
  /** Menus sobre conteúdo variado: mais corpo para legibilidade. */
  menu: { tint: 0.85, tintTone: "dark", frost: 0.22, refraction: 52 },
} satisfies Record<string, LiquidGlassLook>;

interface GlassInstance {
  update: (options: Record<string, unknown>) => unknown;
  destroy: () => void;
}

function toGlassOptions({ tint, tintTone, frost, refraction, blur }: LiquidGlassLook) {
  return {
    tint,
    tintTone,
    frost,
    material: {
      ...(refraction === undefined ? {} : { refraction }),
      backdropBlur: blur ?? 0,
    },
  };
}

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
  const instanceRef = useRef<GlassInstance | null>(null);
  const lookRef = useRef(look);
  lookRef.current = look;
  const { tint, tintTone, frost, refraction, blur } = look;

  // Cria o renderer uma vez por elemento; mudanças de aparência vão por update() abaixo.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cancelled = false;

    import("apple-liquid-glass-webgl")
      .then(({ LiquidGlass }) => {
        if (cancelled || !LiquidGlass.isSupported()) return;
        instanceRef.current = new LiquidGlass(element, {
          ...toGlassOptions(lookRef.current),
          fallback: "none",
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
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  // Ajusta o vidro sem recriá-lo (ex.: mais desfoque quando há conteúdo passando atrás).
  useEffect(() => {
    instanceRef.current?.update(toGlassOptions({ tint, tintTone, frost, refraction, blur }));
  }, [tint, tintTone, frost, refraction, blur]);

  return createElement(as, { ref, className: clsx("liquid-glass", className), ...rest }, children);
}
