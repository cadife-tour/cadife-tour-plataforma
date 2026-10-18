export type JourneyPhaseName =
  "AIRPLANE" | "WINDOW" | "CLOUDS" | "CHILE" | "DESTINATION" | "RESORT";

export type TravelExperienceMode = "full" | "single";

export interface PhaseConfig {
  name: JourneyPhaseName;
  start: number;
  end: number;
}

export interface DestinationSceneConfig {
  id: string;
  country: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  whatsappContext: string;
  assetKey?: string;
}

export const DESTINATION_SCENES: Record<string, DestinationSceneConfig> = {
  chile: {
    id: "chile",
    country: "Chile",
    title: "Chile: Onde a imponência dos Andes encontra o infinito.",
    subtitle:
      "Das montanhas nevadas e vinhedos do Valle Central à beleza selvagem da Patagônia chilena.",
    badge: "Destino em Destaque — América do Sul",
    ctaText: "Quero conhecer o Chile",
    whatsappContext: "chile",
    assetKey: "chile_andes",
  },
  argentina: {
    id: "argentina",
    country: "Argentina",
    title: "Buenos Aires: Cidades pulsantes, cultura e momentos memoráveis.",
    subtitle: "Avenidas históricas, espetáculos apaixonantes e a essência da cultura platina.",
    badge: "América do Sul",
    ctaText: "Quero conhecer a Argentina",
    whatsappContext: "argentina",
    assetKey: "buenos_aires",
  },
  peru: {
    id: "peru",
    country: "Peru",
    title: "Machu Picchu: História viva e caminhos acima das nuvens.",
    subtitle: "Monumentalidade andina, arquitetura sagrada e espiritualidade milenar.",
    badge: "América do Sul",
    ctaText: "Quero conhecer o Peru",
    whatsappContext: "peru",
    assetKey: "machu_picchu",
  },
  cruzeiros: {
    id: "cruzeiros",
    country: "Cruzeiros",
    title: "Cruzeiros: O destino começa antes mesmo de chegar.",
    subtitle: "Navegações com conforto absoluto e vistas deslumbrantes do oceano.",
    badge: "Experiência Marítima",
    ctaText: "Quero conhecer cruzeiros",
    whatsappContext: "cruzeiros",
    assetKey: "cruises",
  },
  portugal: {
    id: "portugal",
    country: "Portugal",
    title: "Lisboa: História, cultura e encontros à beira do Atlântico.",
    subtitle: "A beleza atemporal da Torre de Belém e as cores de um país acolhedor.",
    badge: "Europa",
    ctaText: "Quero conhecer Portugal",
    whatsappContext: "portugal",
    assetKey: "portugal_belem",
  },
};

export interface TravelExperienceConfig {
  heroScrollHeightVh: number;
  mode: TravelExperienceMode;
  targetDestination: string;
  phases: {
    AIRPLANE: PhaseConfig;
    WINDOW: PhaseConfig;
    CLOUDS: PhaseConfig;
    CHILE: PhaseConfig;
    DESTINATION: PhaseConfig;
    RESORT: PhaseConfig;
  };
  camera: {
    airplane: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    };
    window: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    };
    clouds: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    };
    chile: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    };
  };
}

export const TRAVEL_EXPERIENCE_CONFIG: TravelExperienceConfig = {
  heroScrollHeightVh: 500,
  mode: "single",
  targetDestination: "chile",
  phases: {
    AIRPLANE: {
      name: "AIRPLANE",
      start: 0.0,
      end: 0.15,
    },
    WINDOW: {
      name: "WINDOW",
      start: 0.15,
      end: 0.3,
    },
    CLOUDS: {
      name: "CLOUDS",
      start: 0.3,
      end: 0.5,
    },
    CHILE: {
      name: "CHILE",
      start: 0.5,
      end: 1.0,
    },
    DESTINATION: {
      name: "DESTINATION",
      start: 0.5,
      end: 1.0,
    },
    RESORT: {
      name: "RESORT",
      start: 0.85,
      end: 1.0,
    },
  },
  camera: {
    airplane: {
      position: [0, 0, 5],
      target: [0, 0, -5],
      fov: 55,
    },
    window: {
      position: [0.95, 0.05, 0.4],
      target: [1.8, 0.05, -2],
      fov: 50,
    },
    clouds: {
      position: [1.2, 0.2, -12],
      target: [0.8, 0.1, -25],
      fov: 60,
    },
    chile: {
      position: [0, 1.2, -35],
      target: [0, 0.3, -55],
      fov: 50,
    },
  },
};

/**
 * Retorna as configurações e fases da jornada de acordo com o modo escolhido
 * (Full Journey na Homepage ou Single Destination em Landing Pages específicas).
 */
export function getExperiencePhases(
  mode: TravelExperienceMode = "single",
  targetDestination: string = "chile"
) {
  const destination = DESTINATION_SCENES[targetDestination] || DESTINATION_SCENES.chile;

  if (mode === "single") {
    return {
      scrollHeightVh: 500,
      destination,
      phases: {
        intro: { start: 0.0, end: 0.25 },
        clouds: { start: 0.28, end: 0.52 },
        destination: { start: 0.52, end: 1.0 },
      },
    };
  }

  return {
    scrollHeightVh: 800,
    destination,
    phases: {
      intro: { start: 0.0, end: 0.15 },
      clouds: { start: 0.15, end: 0.3 },
      destination: { start: 0.3, end: 0.8 },
      resort: { start: 0.8, end: 1.0 },
    },
  };
}
