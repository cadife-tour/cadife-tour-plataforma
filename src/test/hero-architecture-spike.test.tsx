import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

vi.mock("@/features/visual-journey/hooks/useGpuCapability", () => ({
  useGpuCapability: vi.fn(),
}));

const mockedCapability = vi.mocked(useGpuCapability);

function renderJourney() {
  return render(
    <LocaleProvider>
      <TravelExperience />
    </LocaleProvider>
  );
}

describe("Hero architecture spike", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    mockedCapability.mockReturnValue({
      canRender3D: true,
      isReducedMotion: false,
      isSaveData: false,
      isConstrainedDevice: false,
      hasWebGL: true,
      effectiveDpr: 1,
    });
  });

  it.each([
    ["reduced motion", { isReducedMotion: true }],
    ["data saver", { isSaveData: true }],
  ])("keeps all three scenes accessible with %s", (_name, preference) => {
    mockedCapability.mockReturnValue({
      ...mockedCapability(),
      ...preference,
    });
    renderJourney();

    expect(screen.queryByTestId("travel-experience-hero")).not.toBeInTheDocument();
    expect(screen.getByTestId("travel-experience-fallback")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Além das nuvens/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Chile:/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Quero conhecer esta opção/i })).toHaveAttribute(
      "href",
      "#contato"
    );
    expect(document.querySelector("video")).not.toBeInTheDocument();
  });

  it("uses the static journey after a media decoding error", () => {
    renderJourney();
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("poster", "/assets/hero/airplane-poster.webp");
    expect(video).toHaveAttribute("src", "/assets/hero/airplane-journey-scrub.mp4");

    fireEvent.error(video!);

    expect(screen.getByTestId("travel-experience-fallback")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Chile:/i })).toBeInTheDocument();
  });

  it("uses the static journey on devices with limited CPU capacity", () => {
    mockedCapability.mockReturnValue({
      ...mockedCapability(),
      isConstrainedDevice: true,
      canRender3D: false,
    });
    renderJourney();
    expect(screen.getByTestId("travel-experience-fallback")).toBeInTheDocument();
  });

  it.each([
    ["en", /Chile: before the vast Andes/i, /Explore this option: Chile/i],
    ["es", /Chile: ante la inmensidad de los Andes/i, /Quiero conocer esta opción: Chile/i],
  ])("keeps the Chile headline and CTA localized in %s", (locale, title, cta) => {
    localStorage.setItem("cadife_locale", locale);
    mockedCapability.mockReturnValue({
      ...mockedCapability(),
      isReducedMotion: true,
    });
    renderJourney();
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: cta })).toHaveAttribute("href", "#contato");
  });
});
