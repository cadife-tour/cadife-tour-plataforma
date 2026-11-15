export { MOTION_DURATIONS_MS, MOTION_EASE, MOTION_REVEAL } from "./tokens";
export { Reveal } from "./Reveal";
export type { RevealProps } from "./Reveal";

/**
 * Verifica se o usuário solicitou redução de movimento no sistema.
 * Seguro para execução em SSR (retorna false quando `window` não existe).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Rola suavemente até uma âncora/elemento preservando `prefers-reduced-motion`.
 * Quando reduzido, usa `behavior: "auto"` para evitar desconforto vestibular.
 */
export function scrollToSection(targetId: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const normalizedId = targetId.startsWith("#") ? targetId.slice(1) : targetId;
  const element = document.getElementById(normalizedId);
  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  return true;
}
