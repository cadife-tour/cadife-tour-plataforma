import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisualJourney } from "@/features/visual-journey/VisualJourney";

describe("Fase 3 — VisualJourney Integration & Fallback Boundary", () => {
  it("renders StaticAtmosphere seamlessly when reduced-motion or WebGL is disabled", () => {
    // Simula ambiente padrão de teste sem WebGL real
    render(<VisualJourney />);
    const atmosphere = screen.getByTestId("static-atmosphere");
    expect(atmosphere).toBeInTheDocument();
    expect(atmosphere).toHaveClass("pointer-events-none");
  });

  it("unmounts cleanly without throwing memory or context errors", () => {
    const { unmount } = render(<VisualJourney />);
    expect(() => unmount()).not.toThrow();
  });
});
