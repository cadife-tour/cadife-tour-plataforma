import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { HeroSection } from "@/features/marketing/HeroSection/HeroSection";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

const originalMatchMedia = window.matchMedia;

function mockReducedMotionMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const addEventListener = vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
    if (type === "change") listeners.add(listener);
  });
  const removeEventListener = vi.fn(
    (type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === "change") listeners.delete(listener);
    }
  );

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion: reduce") ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener,
    removeEventListener,
    dispatchEvent: vi.fn(),
  }));

  return {
    addEventListener,
    removeEventListener,
    triggerChange(nextMatches: boolean) {
      matches = nextMatches;
      const event = {
        matches: nextMatches,
        media: "(prefers-reduced-motion: reduce)",
      } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

describe("Hero and background capability", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("disables the decorative WebGL layer on a two-core device", () => {
    vi.spyOn(navigator, "hardwareConcurrency", "get").mockReturnValue(2);
    const contextProbe = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockImplementation(() => null);

    const { result } = renderHook(() => useGpuCapability());

    expect(result.current.isConstrainedDevice).toBe(true);
    expect(result.current.canRender3D).toBe(false);
    expect(contextProbe).not.toHaveBeenCalled();
  });

  it("updates isReducedMotion dynamically on MediaQueryList change and cleans up listener", () => {
    const media = mockReducedMotionMedia(false);
    const { result, unmount } = renderHook(() => useGpuCapability());

    expect(result.current.isReducedMotion).toBe(false);
    expect(media.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    act(() => {
      media.triggerChange(true);
    });

    expect(result.current.isReducedMotion).toBe(true);
    expect(result.current.canRender3D).toBe(false);

    unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("preserves localized destination navigation and focus in static fallback mode under reduced motion", () => {
    mockReducedMotionMedia(true);

    const { unmount } = render(
      <LocaleProvider initialLocale="en">
        <HeroSection />
      </LocaleProvider>
    );

    expect(
      screen.getByRole("navigation", { name: "Hero destination navigation" })
    ).toBeInTheDocument();
    unmount();

    render(
      <LocaleProvider initialLocale="pt">
        <HeroSection />
      </LocaleProvider>
    );

    expect(document.querySelector("video")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const nav = screen.getByRole("navigation", { name: "Navegação de destinos da Hero" });
    const destinationButtons = within(nav).getAllByRole("button", { name: /^Ver destino / });
    expect(destinationButtons).toHaveLength(10);

    const francaButton = within(nav).getByRole("button", { name: "Ver destino França" });
    francaButton.focus();
    fireEvent.click(francaButton);

    expect(document.querySelector("video")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(francaButton).toHaveFocus();
    expect(francaButton).toHaveAttribute("aria-current", "true");
    expect(document.querySelector('img[src*="franca-still.webp"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /França:/i })).toBeInTheDocument();

    const francaCta = screen.getByRole("link", { name: /Quero conhecer a França — WhatsApp/i });
    expect(francaCta.getAttribute("href")).toContain("https://wa.me/5547996714510");

    const nextButton = within(nav).getByRole("button", { name: "Próximo destino" });
    fireEvent.click(nextButton);
    expect(screen.getByRole("heading", { name: /Itália:/i })).toBeInTheDocument();

    const prevButton = within(nav).getByRole("button", { name: "Destino anterior" });
    fireEvent.click(prevButton);
    expect(screen.getByRole("heading", { name: /França:/i })).toBeInTheDocument();
  });
});
