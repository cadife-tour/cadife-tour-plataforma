import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { JOURNEY_SCENES } from "@/features/travel-experience/config/journeyScenes";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

vi.mock("@/features/visual-journey/hooks/useGpuCapability", () => ({ useGpuCapability: vi.fn() }));
const capability = vi.mocked(useGpuCapability);
const base = {
  canRender3D: true,
  isReducedMotion: false,
  isSaveData: false,
  isConstrainedDevice: false,
  hasWebGL: true,
  effectiveDpr: 1,
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Jornada completa", () => {
  it("preserva ordem, um único h1 e carrega a cena seguinte por proximidade", () => {
    capability.mockReturnValue(base);
    const callbacks = new Map<Element, (entries: { isIntersecting: boolean }[]) => void>();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
        observe(element: Element) {
          callbacks.set(element, this.callback);
        }
        disconnect() {}
      }
    );
    render(<TravelExperience mode="full" />);
    const scenes = Array.from(document.querySelectorAll("[data-destination]"));
    expect(scenes.map((scene) => scene.getAttribute("data-destination"))).toEqual(
      JOURNEY_SCENES.map((scene) => scene.destination)
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelectorAll("video[src]")).toHaveLength(1);
    const next = scenes[1];
    if (!next) throw new Error("Cena ausente");
    act(() => callbacks.get(next)?.([{ isIntersecting: true }]));
    expect(next.querySelector("video")).toHaveAttribute(
      "src",
      "/assets/hero/destinations/argentina-scrub.mp4"
    );
    expect(document.querySelectorAll("video[src]")).toHaveLength(2);
  });

  it("preserva os dez destinos sem vídeo e sem repetir abertura em reduced motion", () => {
    capability.mockReturnValue({ ...base, isReducedMotion: true });
    render(<TravelExperience mode="full" />);
    expect(document.querySelector("video")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByTestId("travel-experience-fallback")).toHaveLength(10);
    expect(screen.getByRole("heading", { name: /Resorts & Praias:/ })).toBeInTheDocument();
  });
});
