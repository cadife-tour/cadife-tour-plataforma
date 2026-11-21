import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import tailwindConfig from "../../tailwind.config";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { HowItWorksSection } from "@/features/marketing/HowItWorksSection/HowItWorksSection";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import {
  MOTION_DURATIONS_MS,
  MOTION_EASE,
  MOTION_REVEAL,
  Reveal,
  prefersReducedMotion,
  scrollToSection,
} from "@/shared/motion";

afterEach(() => {
  vi.restoreAllMocks();
});

function collectSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("Global motion and smooth scroll standards", () => {
  it("keeps Tailwind transitionDuration and CSS tokens aligned to MOTION_DURATIONS_MS", () => {
    expect(MOTION_DURATIONS_MS.micro).toBeGreaterThanOrEqual(120);
    expect(MOTION_DURATIONS_MS.micro).toBeLessThanOrEqual(220);
    expect(MOTION_DURATIONS_MS.reveal).toBeGreaterThanOrEqual(240);
    expect(MOTION_DURATIONS_MS.reveal).toBeLessThanOrEqual(480);
    expect(MOTION_DURATIONS_MS.editorial).toBeGreaterThanOrEqual(500);
    expect(MOTION_DURATIONS_MS.editorial).toBeLessThanOrEqual(900);

    const transitionDuration = tailwindConfig.theme?.extend?.transitionDuration as
      Record<string, string> | undefined;

    expect(transitionDuration?.micro).toBe(`${MOTION_DURATIONS_MS.micro}ms`);
    expect(transitionDuration?.reveal).toBe(`${MOTION_DURATIONS_MS.reveal}ms`);
    expect(transitionDuration?.editorial).toBe(`${MOTION_DURATIONS_MS.editorial}ms`);

    const tokensCss = fs.readFileSync(
      path.resolve(process.cwd(), "src/core/theme/tokens.css"),
      "utf8"
    );
    expect(tokensCss).toContain(`--duration-fast: ${MOTION_DURATIONS_MS.micro}ms;`);
    expect(tokensCss).toContain(`--duration-normal: ${MOTION_DURATIONS_MS.reveal}ms;`);
    expect(tokensCss).toContain(`--duration-slow: ${MOTION_DURATIONS_MS.editorial}ms;`);

    expect(MOTION_EASE.out).toBe("power2.out");
    expect(MOTION_EASE.editorial).toBe("power3.out");
    expect(MOTION_REVEAL.distanceY).toBeGreaterThanOrEqual(16);
    expect(MOTION_REVEAL.distanceY).toBeLessThanOrEqual(28);
  });

  it("enforces standardized duration tokens across all features and shared UI components", () => {
    const roots = [
      path.resolve(process.cwd(), "src/features"),
      path.resolve(process.cwd(), "src/shared"),
    ];
    const files = roots.flatMap(collectSourceFiles);
    const forbiddenDurationRegex = /\bduration-(75|100|150|200|300|500|700|1000)\b/;

    const violations: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      if (forbiddenDurationRegex.test(content)) {
        violations.push(path.relative(process.cwd(), file));
      }
    }

    expect(violations).toEqual([]);
  });

  it("renders #como-funciona and #faq with scroll-mt-24 for fixed header offset", () => {
    const { container } = render(
      <LocaleProvider>
        <HowItWorksSection />
        <FaqAndCtaSection />
      </LocaleProvider>
    );

    const howItWorksSection = container.querySelector("#como-funciona");
    const faqSection = container.querySelector("#faq");

    expect(howItWorksSection).not.toBeNull();
    expect(howItWorksSection).toHaveClass("scroll-mt-24");
    expect(faqSection).not.toBeNull();
    expect(faqSection).toHaveClass("scroll-mt-24");
  });

  it("keeps Reveal content visible and respects prefers-reduced-motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(prefersReducedMotion()).toBe(true);

    const { container } = render(
      <Reveal variant="editorial">
        <h2>Seção acessível</h2>
      </Reveal>
    );

    expect(screen.getByText("Seção acessível")).toBeVisible();
    expect(container.firstElementChild).toHaveClass(
      "opacity-100",
      "duration-editorial",
      "motion-reduce:transition-none"
    );
  });

  it("scrolls smoothly when motion is allowed and uses auto when reduced", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "getElementById").mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(scrollToSection("#contato")).toBe(true);
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });

    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(scrollToSection("contato")).toBe(true);
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: "auto", block: "start" });
  });
});
