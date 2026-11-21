/**
 * Tokens únicos de motion da CADIFE Tour.
 * Consumidos por `tailwind.config.ts`, componentes e helpers de scroll/reveal.
 * Alinhado a `docs/ai/MOTION_GUIDELINES.md`.
 */

export const MOTION_DURATIONS_MS = {
  micro: 180,
  reveal: 360,
  editorial: 680,
} as const;

export const MOTION_EASE = {
  /** Padrão para microinterações e reveals de cards/CTAs */
  out: "power2.out",
  /** Padrão para headlines e entradas editoriais */
  editorial: "power3.out",
} as const;

export const MOTION_REVEAL = {
  distanceY: 20,
  staggerMs: 60,
  cardHoverY: -1,
  cardHoverScale: 1.02,
} as const;
