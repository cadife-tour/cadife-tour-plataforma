import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, renderHook, act } from "@testing-library/react";
import { StaticAtmosphere } from "@/features/visual-journey/fallback/StaticAtmosphere";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";
import { useScrollProgress } from "@/features/visual-journey/hooks/useScrollProgress";

describe("Fase 3A — Visual Journey Hooks & Static Fallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders StaticAtmosphere with pointer-events-none and correct test-id", () => {
    render(<StaticAtmosphere />);
    const atmosphere = screen.getByTestId("static-atmosphere");
    expect(atmosphere).toBeInTheDocument();
    expect(atmosphere).toHaveClass("pointer-events-none");
    expect(atmosphere).toHaveAttribute("aria-hidden", "true");
  });

  it("detects reduced-motion preference in useGpuCapability", () => {
    // Simula prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useGpuCapability());

    expect(result.current.isReducedMotion).toBe(true);
    expect(result.current.canRender3D).toBe(false);
  });

  it("calculates scrollProgress within 0.0 to 1.0 bounds in useScrollProgress", () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.scrollProgress).toBeGreaterThanOrEqual(0);
    expect(result.current.scrollProgress).toBeLessThanOrEqual(1);
    expect(result.current.activeStationIndex).toBeGreaterThanOrEqual(0);
    expect(result.current.activeStationIndex).toBeLessThanOrEqual(4);

    // Simula scroll no window
    act(() => {
      window.scrollY = 500;
      window.dispatchEvent(new Event("scroll"));
    });
  });
});
