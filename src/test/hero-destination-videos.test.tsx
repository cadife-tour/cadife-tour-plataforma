import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";
import { ASSET_MANIFEST } from "@/features/travel-experience/assets/assetManifest";
import HeroPreviewPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/hero-preview/[destination]/page";

vi.mock("@/features/visual-journey/hooks/useGpuCapability", () => ({ useGpuCapability: vi.fn() }));
const capability = vi.mocked(useGpuCapability);
const ids = [
  "chile",
  "argentina",
  "peru",
  "cruzeiros",
  "portugal",
  "espanha",
  "franca",
  "italia",
  "brasil",
  "resorts",
];

function journey(id: string) {
  return (
    <LocaleProvider initialLocale="pt">
      <TravelExperience targetDestination={id} />
    </LocaleProvider>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  capability.mockReturnValue({
    canRender3D: true,
    isReducedMotion: false,
    isSaveData: false,
    isConstrainedDevice: false,
    hasWebGL: true,
    effectiveDpr: 1,
  });
});

describe("Vídeo próprio por destino", () => {
  it("mantém todos os vídeos, posters e stills do manifesto no diretório público", () => {
    for (const media of Object.values(ASSET_MANIFEST.destinations)) {
      for (const path of Object.values(media))
        expect(existsSync(resolve("public", path.slice(1))), path).toBe(true);
    }
  });

  it.each(ids)("carrega apenas o vídeo de %s", (id) => {
    render(journey(id));
    const videos = document.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(videos[0]).toHaveAttribute(
      "src",
      `/assets/hero/${id === "chile" ? "airplane-journey-scrub.mp4" : `destinations/${id}-scrub.mp4`}`
    );
    expect(videos[0]).toHaveAttribute("poster");
  });

  it.each(ids.slice(0, 5))("usa o still e CTA próprios de %s se o vídeo falhar", (id) => {
    render(journey(id));
    const video = document.querySelector("video");
    if (!video) throw new Error("Vídeo não renderizado");
    fireEvent.error(video);
    expect(document.querySelector("video")).not.toBeInTheDocument();
    expect(
      document.querySelector(
        `img[src*="${id === "chile" ? "andes-still.webp" : `${id}-still.webp`}"]`
      )
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", {
      name:
        id === "chile"
          ? /Quero conhecer esta opção/
          : id === "argentina"
            ? /Quero conhecer a Argentina/
            : id === "peru"
              ? /Quero conhecer o Peru/
              : id === "cruzeiros"
                ? /Quero conhecer cruzeiros/
                : /Quero conhecer Portugal/,
    });
    expect(cta.getAttribute("href")).toContain("https://wa.me/5547996714510");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(["isReducedMotion", "isSaveData", "isConstrainedDevice"] as const)(
    "preserva o destino sem carregar vídeo com %s",
    (preference) => {
      capability.mockReturnValue({ ...capability(), [preference]: true });
      render(journey("argentina"));
      expect(document.querySelector("video")).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Buenos Aires:/ })).toBeInTheDocument();
      expect(document.querySelector('img[src*="argentina-still.webp"]')).toBeInTheDocument();
    }
  );

  it("reinicia o estado de erro e a mídia ao trocar de destino", () => {
    const view = render(journey("argentina"));
    const video = document.querySelector("video");
    if (!video) throw new Error("Vídeo não renderizado");
    fireEvent.error(video);
    view.rerender(journey("portugal"));
    expect(document.querySelector("video")).toHaveAttribute(
      "src",
      "/assets/hero/destinations/portugal-scrub.mp4"
    );
  });

  it("usa o Chile para identificador desconhecido", () => {
    render(journey("desconhecido"));
    expect(document.querySelector("video")).toHaveAttribute(
      "src",
      "/assets/hero/airplane-journey-scrub.mp4"
    );
  });

  it("gera somente as dez prévias disponíveis e impede indexação", async () => {
    expect(generateStaticParams().map((item) => item.destination)).toEqual(ids);
    const params = Promise.resolve({ destination: "portugal" });
    expect((await generateMetadata({ params })).robots).toEqual({ index: false, follow: false });
    expect((await generateMetadata({ params })).alternates?.canonical).toBeNull();
    await expect(
      HeroPreviewPage({ params: Promise.resolve({ destination: "desconhecido" }) })
    ).rejects.toThrow();
  });
});
