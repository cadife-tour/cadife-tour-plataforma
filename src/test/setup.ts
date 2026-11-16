import "@testing-library/jest-dom/vitest";
import { afterAll } from "vitest";

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
