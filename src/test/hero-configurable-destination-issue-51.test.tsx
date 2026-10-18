import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import {
  getDestinationConfig,
  getExperiencePhases,
} from "@/features/travel-experience/config/travelExperienceConfig";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";

vi.mock("@/features/visual-journey/hooks/useGpuCapability", () => ({
  useGpuCapability: vi.fn(),
}));

const mockedCapability = vi.mocked(useGpuCapability);

function renderJourney(props = {}) {
  return render(
    <LocaleProvider>
      <TravelExperience {...props} />
    </LocaleProvider>
  );
}

describe("Issue #51 — Configuração Dinâmica da Hero por Destino", () => {
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

  describe("Catálogo de Destinos e Helpers de Configuração", () => {
    const OFFICIAL_DESTINATIONS = [
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

    it("contém todos os 10 destinos oficiais com estrutura completa", () => {
      OFFICIAL_DESTINATIONS.forEach((destId) => {
        const config = getDestinationConfig(destId);
        expect(config).toBeDefined();
        expect(config.id).toBe(destId);
        expect(config.country).toBeTruthy();
        expect(config.media.stillImage).toBeTruthy();
        expect(config.media.stillImage.startsWith("/assets/")).toBe(true);

        // Validação das 3 línguas oficiais
        (["pt", "en", "es"] as const).forEach((locale) => {
          const localized = config.content[locale];
          expect(localized).toBeDefined();
          expect(localized.badge).toBeTruthy();
          expect(localized.title).toBeTruthy();
          expect(localized.subtitle).toBeTruthy();
          expect(localized.primaryCta).toBeTruthy();
          expect(localized.secondaryCta).toBeTruthy();
        });
      });
    });

    it("faz fallback seguro para o Chile quando fornecido destino inexistente ou vazio", () => {
      const fallbackConfig = getDestinationConfig("desconhecido");
      expect(fallbackConfig.id).toBe("chile");

      const emptyConfig = getDestinationConfig("");
      expect(emptyConfig.id).toBe("chile");

      const undefinedConfig = getDestinationConfig(undefined);
      expect(undefinedConfig.id).toBe("chile");
    });

    it("getExperiencePhases calcula fases e alturas corretas para single e full mode", () => {
      const singlePhases = getExperiencePhases("single", "portugal");
      expect(singlePhases.scrollHeightVh).toBe(500);
      expect(singlePhases.destination.id).toBe("portugal");
      expect(singlePhases.phases.destination).toBeDefined();

      const fullPhases = getExperiencePhases("full", "brasil");
      expect(fullPhases.scrollHeightVh).toBe(800);
      expect(fullPhases.destination.id).toBe("brasil");
      expect(fullPhases.phases.resort).toBeDefined();
    });
  });

  describe("Renderização Dinâmica do Componente TravelExperience", () => {
    it("renderiza Portugal com badge, título e CTA contextualizados", () => {
      renderJourney({ targetDestination: "portugal" });

      expect(screen.getByText("Europa")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Lisboa: História, cultura e encontros à beira do Atlântico/i,
          hidden: true,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /Quero conhecer Portugal — WhatsApp/i,
          hidden: true,
        })
      ).toBeInTheDocument();
    });

    it("renderiza Cruzeiros com badge marítimo e CTA contextualizado", () => {
      renderJourney({ targetDestination: "cruzeiros" });

      expect(screen.getByText("Experiência Marítima")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Cruzeiros: O destino começa antes mesmo de chegar/i,
          hidden: true,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /Quero conhecer cruzeiros — WhatsApp/i,
          hidden: true,
        })
      ).toBeInTheDocument();
    });

    it("aplica classes de altura de acordo com o modo 'full' vs 'single'", () => {
      const { unmount } = renderJourney({ mode: "full" });
      const heroFull = screen.getByTestId("travel-experience-hero");
      expect(heroFull.className).toContain("h-[500vh]");
      expect(heroFull.className).toContain("lg:h-[700vh]");
      unmount();

      renderJourney({ mode: "single" });
      const heroSingle = screen.getByTestId("travel-experience-hero");
      expect(heroSingle.className).toContain("h-[350svh]");
      expect(heroSingle.className).toContain("md:h-[500vh]");
    });
  });

  describe("Localização e Internacionalização com Destinos Dinâmicos", () => {
    it("renderiza textos em inglês para a França", () => {
      localStorage.setItem("cadife_locale", "en");
      renderJourney({ targetDestination: "franca" });

      expect(screen.getByText("Europe")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /France: Elegance, heritage, and unforgettable sceneries/i,
          hidden: true,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /Discover France — WhatsApp/i,
          hidden: true,
        })
      ).toBeInTheDocument();
    });

    it("renderiza textos em espanhol para a Itália", () => {
      localStorage.setItem("cadife_locale", "es");
      renderJourney({ targetDestination: "italia" });

      expect(
        screen.getByRole("heading", {
          name: /Italia: Donde la historia clásica cobra vida/i,
          hidden: true,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /Quiero conocer Italia — WhatsApp/i,
          hidden: true,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Acessibilidade e Fallback Estático por Destino (Reduced Motion / GPU fraca)", () => {
    it("usa o still específico do destino no StaticJourney com reduced motion", () => {
      mockedCapability.mockReturnValue({
        ...mockedCapability(),
        isReducedMotion: true,
      });

      renderJourney({ targetDestination: "portugal" });

      expect(screen.getByTestId("travel-experience-fallback")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Lisboa: História, cultura e encontros à beira do Atlântico/i,
        })
      ).toBeInTheDocument();

      const images = Array.from(document.querySelectorAll("img"));
      // Verifica que a imagem do still de Portugal (/assets/destinations/europa.webp) foi solicitada
      const destinationImg = images.find((img) => img.getAttribute("src")?.includes("europa.webp"));
      expect(destinationImg).toBeDefined();
    });

    it("mantém retrocompatibilidade estrita quando invocado sem props", () => {
      mockedCapability.mockReturnValue({
        ...mockedCapability(),
        isReducedMotion: true,
      });

      renderJourney();

      expect(screen.getByTestId("travel-experience-fallback")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Chile: diante da imensidão dos Andes/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Quero conhecer esta opção: Chile — WhatsApp/i })
      ).toBeInTheDocument();
    });
  });
});
