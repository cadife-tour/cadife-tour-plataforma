import "@testing-library/jest-dom/vitest";
import { afterAll, vi } from "vitest";

// next/font só funciona dentro do compilador do Next; nos testes basta expor as variáveis.
vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-fraunces", className: "font-fraunces" }),
  Manrope: () => ({ variable: "font-manrope", className: "font-manrope" }),
}));

afterAll(async () => {
  // GSAP owns process timers beyond a component's lifetime. Release them before
  // Vitest removes this file's window and requestAnimationFrame implementation.
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  if (typeof ScrollTrigger.isTouch === "number") ScrollTrigger.disable(true, true);
  const { default: gsap } = await import("gsap");
  gsap.ticker?.sleep();
});

// Mock padrão seguro de matchMedia para ambiente jsdom de testes
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  if (window.HTMLMediaElement) {
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
    window.HTMLMediaElement.prototype.pause = () => {};
  }
}
