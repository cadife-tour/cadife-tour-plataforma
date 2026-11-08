import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ContinuousJourneyHero } from "@/features/travel-experience/components/ContinuousJourneyHero";
import journey from "@/features/travel-experience/config/continuousJourney.json";
import { getDestinationConfig } from "@/features/travel-experience/config/travelExperienceConfig";
import { HomePageSwitcher } from "@/features/marketing/HomePageSwitcher";
import { continuousJourneySegments } from "@/features/travel-experience/config/continuousJourneyTiming";
import { renderToString } from "react-dom/server";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ScrollTrigger owns global timers beyond a component timeline's lifetime.
// Stop them before this jsdom environment removes requestAnimationFrame.
afterAll(() => {
  ScrollTrigger.disable();
  gsap.ticker.sleep();
});

describe("Continuous journey alternative homepage", () => {
  it.each(["low-memory", "low-cpu", "save-data"])(
    "preserves a lightweight static layout with %s",
    (profile) => {
      vi.stubGlobal("navigator", {
        deviceMemory: profile === "low-memory" ? 2 : 8,
        hardwareConcurrency: profile === "low-cpu" ? 2 : 8,
        connection: { saveData: profile === "save-data" },
      });
      render(<ContinuousJourneyHero />);
      expect(document.querySelector("video")).toBeNull();
      expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
      const section = screen.getByRole("region", { name: "Jornada CADIFE Tour" });
      expect(section.style.getPropertyValue("--journey-mobile")).toBe("");
      expect(screen.getByRole("link", { name: "Explorar destinos" })).toHaveAttribute(
        "href",
        "#destinos"
      );
    }
  );
  it("reserves the full scroll height in server HTML before hydration", () => {
    const html = renderToString(<ContinuousJourneyHero />);
    expect(html).toContain("--journey-mobile:");
    expect(html).toContain("--journey-desktop:");
    expect(html).toContain("overflow-anchor:none");
  });

  it("includes a fully cloud-only interval between every pair of destinations", () => {
    expect(journey.cloudBridges).toHaveLength(journey.chapters.length - 1);
    for (const [index, bridge] of journey.cloudBridges.entries()) {
      expect(bridge.clearEnd - bridge.clearStart).toBeGreaterThanOrEqual(1.8);
      expect(bridge.clearStart).toBeGreaterThan(journey.chapters[index]!.returnStart);
      expect(bridge.clearEnd).toBeLessThan(journey.chapters[index + 1]!.reveal);
    }
  });
  it("triples cloud scroll distance while preserving destination speed and continuous seeking", () => {
    for (const [index, segment] of continuousJourneySegments.entries()) {
      expect(segment.duration).toBeCloseTo(
        (segment.to - segment.from) * (segment.phase === "clouds" ? 3 : 1)
      );
      expect(segment.to).toBeGreaterThan(segment.from);
      if (index > 0) expect(segment.from).toBeCloseTo(continuousJourneySegments[index - 1]!.to);
    }
    expect(continuousJourneySegments[0]!.from).toBe(0);
    expect(continuousJourneySegments.at(-1)!.to).toBeCloseTo(journey.duration - 1 / 24);
  });
  it("uses one real film and synchronizes destination context when seeking in either direction", () => {
    render(<ContinuousJourneyHero />);
    const video = document.querySelector("video")!;
    expect(document.querySelectorAll("video")).toHaveLength(1);
    expect(video).toHaveAttribute("src", journey.src);
    expect(video).not.toHaveAttribute("autoplay");
    expect(existsSync(resolve("public", journey.src.slice(1)))).toBe(true);
    for (const chapter of [...journey.chapters, ...[...journey.chapters].reverse()]) {
      video.currentTime = chapter.reveal + 0.1;
      fireEvent.timeUpdate(video);
      expect(document.querySelector("h2")).toHaveTextContent(
        getDestinationConfig(chapter.destination).content.pt.title
      );
    }
    video.currentTime = 0;
    fireEvent.timeUpdate(video);
    expect(document.querySelector("h2")).toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("preserves content and conversion if media fails", () => {
    render(<ContinuousJourneyHero />);
    fireEvent.error(document.querySelector("video")!);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByRole("link", { name: "Explorar destinos" })).toHaveAttribute(
      "href",
      "#destinos"
    );
  });

  it("does not load the film for reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<ContinuousJourneyHero />);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
  });

  it.each([1, 2] as const)("links both homepages and identifies page %s", (current) => {
    render(<HomePageSwitcher current={current} />);
    expect(screen.getByRole("link", { name: "Página 1" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Página 2" })).toHaveAttribute("href", "/home-2");
    expect(screen.getByRole("link", { name: `Página ${current}` })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
