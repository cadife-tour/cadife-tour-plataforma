import type { Locale } from "@/content/types";

export type JourneyPhaseName =
  "AIRPLANE" | "WINDOW" | "CLOUDS" | "CHILE" | "DESTINATION" | "RESORT";

export type TravelExperienceMode = "full" | "single";

export interface PhaseConfig {
  name: JourneyPhaseName;
  start: number;
  end: number;
}

export interface DestinationLocalizedText {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface DestinationMediaConfig {
  stillImage: string;
  posterImage?: string;
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
  content: Record<Locale, DestinationLocalizedText>;
  media: DestinationMediaConfig;
}

export const DESTINATION_SCENES: Record<string, DestinationSceneConfig> = {
  chile: {
    id: "chile",
    country: "Chile",
    title: "Chile: diante da imensidão dos Andes.",
    subtitle: "Montanhas e horizontes que convidam a ir mais longe.",
    badge: "Destino em Destaque — América do Sul",
    ctaText: "Quero conhecer esta opção",
    whatsappContext: "chile",
    assetKey: "chile_andes",
    media: {
      stillImage: "/assets/hero/andes-still.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Destino em Destaque — América do Sul",
        title: "Chile: diante da imensidão dos Andes.",
        subtitle: "Montanhas e horizontes que convidam a ir mais longe.",
        primaryCta: "Quero conhecer esta opção",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Featured Destination — South America",
        title: "Chile: before the vast Andes.",
        subtitle: "Mountains and horizons that invite you to go further.",
        primaryCta: "Explore this option",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Destino Destacado — Sudamérica",
        title: "Chile: ante la inmensidad de los Andes.",
        subtitle: "Montañas y horizontes que invitan a ir más lejos.",
        primaryCta: "Quiero conocer esta opción",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
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
    media: {
      stillImage: "/assets/destinations/patagonia.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "América do Sul",
        title: "Buenos Aires: Cidades pulsantes, cultura e momentos memoráveis.",
        subtitle: "Avenidas históricas, espetáculos apaixonantes e a essência da cultura platina.",
        primaryCta: "Quero conhecer a Argentina",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "South America",
        title: "Buenos Aires: Vibrant cities, culture, and lasting memories.",
        subtitle: "Historic boulevards, captivating tango, and true Latin hospitality.",
        primaryCta: "Discover Argentina",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Sudamérica",
        title: "Buenos Aires: Ciudades vibrantes, cultura y momentos memorables.",
        subtitle: "Avenidas históricas, espectáculos apasionantes y la esencia platense.",
        primaryCta: "Quiero conocer Argentina",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
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
    media: {
      stillImage: "/assets/hero/andes-still.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "América do Sul",
        title: "Machu Picchu: História viva e caminhos acima das nuvens.",
        subtitle: "Monumentalidade andina, arquitetura sagrada e espiritualidade milenar.",
        primaryCta: "Quero conhecer o Peru",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "South America",
        title: "Machu Picchu: Living history and trails above the clouds.",
        subtitle: "Andean grandeur, sacred architecture, and timeless spirituality.",
        primaryCta: "Discover Peru",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Sudamérica",
        title: "Machu Picchu: Historia viva y caminos sobre las nubes.",
        subtitle: "Monumentalidad andina, arquitectura sagrada y espiritualidad milenaria.",
        primaryCta: "Quiero conocer Perú",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
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
    media: {
      stillImage: "/assets/destinations/cruzeiros.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Experiência Marítima",
        title: "Cruzeiros: O destino começa antes mesmo de chegar.",
        subtitle: "Navegações com conforto absoluto e vistas deslumbrantes do oceano.",
        primaryCta: "Quero conhecer cruzeiros",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Maritime Experience",
        title: "Cruises: The journey begins before you even dock.",
        subtitle: "Ocean voyages with utmost comfort and endless horizons.",
        primaryCta: "Explore cruises",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Experiencia Marítima",
        title: "Cruceros: El viaje comienza antes de atracar.",
        subtitle: "Navegaciones con confort total y horizontes inolvidables.",
        primaryCta: "Quiero conocer cruceros",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
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
    media: {
      stillImage: "/assets/destinations/europa.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Europa",
        title: "Lisboa: História, cultura e encontros à beira do Atlântico.",
        subtitle: "A beleza atemporal da Torre de Belém e as cores de um país acolhedor.",
        primaryCta: "Quero conhecer Portugal",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Europe",
        title: "Lisbon: History, culture, and Atlantic coast beauty.",
        subtitle: "The timeless charm of Belém Tower and warm Portuguese hospitality.",
        primaryCta: "Discover Portugal",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Europa",
        title: "Lisboa: Historia, cultura y horizontes atlánticos.",
        subtitle: "El encanto atemporal de la Torre de Belém y la calidez portuguesa.",
        primaryCta: "Quiero conocer Portugal",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
  espanha: {
    id: "espanha",
    country: "Espanha",
    title: "Espanha: Arte, arquitetura e tradições que encantam.",
    subtitle: "Cidades históricas, gastronomia vibrante e hospitalidade sem igual.",
    badge: "Europa",
    ctaText: "Quero conhecer a Espanha",
    whatsappContext: "espanha",
    assetKey: "spain_culture",
    media: {
      stillImage: "/assets/destinations/europa.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Europa",
        title: "Espanha: Arte, arquitetura e tradições que encantam.",
        subtitle: "Cidades históricas, gastronomia vibrante e hospitalidade sem igual.",
        primaryCta: "Quero conhecer a Espanha",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Europe",
        title: "Spain: Art, architecture, and captivating traditions.",
        subtitle: "Historic cities, world-class cuisine, and unforgettable moments.",
        primaryCta: "Discover Spain",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Europa",
        title: "España: Arte, arquitectura y tradiciones cautivadoras.",
        subtitle: "Ciudades históricas, gastronomía mundial y momentos inolvidables.",
        primaryCta: "Quiero conocer España",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
  franca: {
    id: "franca",
    country: "França",
    title: "França: Elegância, história e cenários inesquecíveis.",
    subtitle: "Dos monumentos parisienses aos vinhedos do interior.",
    badge: "Europa",
    ctaText: "Quero conhecer a França",
    whatsappContext: "franca",
    assetKey: "france_paris",
    media: {
      stillImage: "/assets/destinations/europa.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Europa",
        title: "França: Elegância, história e cenários inesquecíveis.",
        subtitle: "Dos monumentos parisienses aos vinhedos do interior.",
        primaryCta: "Quero conhecer a França",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Europe",
        title: "France: Elegance, heritage, and unforgettable sceneries.",
        subtitle: "From Parisian icons to picturesque countryside vineyards.",
        primaryCta: "Discover France",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Europa",
        title: "Francia: Elegancia, patrimonio y paisajes inolvidables.",
        subtitle: "De los monumentos parisinos a los viñedos encantadores.",
        primaryCta: "Quiero conocer Francia",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
  italia: {
    id: "italia",
    country: "Itália",
    title: "Itália: Onde a história clássica ganha vida.",
    subtitle: "Ruínas milenares, colinas toscanas e culinária autêntica.",
    badge: "Europa",
    ctaText: "Quero conhecer a Itália",
    whatsappContext: "italia",
    assetKey: "italy_colosseum",
    media: {
      stillImage: "/assets/destinations/europa.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Europa",
        title: "Itália: Onde a história clássica ganha vida.",
        subtitle: "Ruínas milenares, colinas toscanas e culinária autêntica.",
        primaryCta: "Quero conhecer a Itália",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Europe",
        title: "Italy: Where classical history comes to life.",
        subtitle: "Timeless ruins, rolling hills, and world-renowned gastronomy.",
        primaryCta: "Discover Italy",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Europa",
        title: "Italia: Donde la historia clásica cobra vida.",
        subtitle: "Ruinas milenarias, colinas toscanas y gastronomía legendaria.",
        primaryCta: "Quiero conocer Italia",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
  brasil: {
    id: "brasil",
    country: "Brasil",
    title: "Brasil: Belezas naturais exuberantes e praias deslumbrantes.",
    subtitle: "Da energia dos grandes cartões-postais aos refúgios ecológicos preservados.",
    badge: "Brasil",
    ctaText: "Quero conhecer o Brasil",
    whatsappContext: "brasil",
    assetKey: "brazil_nature",
    media: {
      stillImage: "/assets/destinations/patagonia.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Brasil",
        title: "Brasil: Belezas naturais exuberantes e praias deslumbrantes.",
        subtitle: "Da energia dos grandes cartões-postais aos refúgios ecológicos preservados.",
        primaryCta: "Quero conhecer o Brasil",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Brazil",
        title: "Brazil: Exuberant nature and breathtaking coastlines.",
        subtitle: "From world-famous postcards to untouched tropical paradises.",
        primaryCta: "Discover Brazil",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Brasil",
        title: "Brasil: Bellezas naturales exuberantes y playas paradisíacas.",
        subtitle: "De las postales icónicas a los refugios ecológicos preservados.",
        primaryCta: "Quiero conocer Brasil",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
  resorts: {
    id: "resorts",
    country: "Resorts",
    title: "Resorts & Praias: Descanso com estrutura e sofisticação.",
    subtitle: "Águas cristalinas, alta gastronomia e conforto para toda a família.",
    badge: "Experiência Exclusiva",
    ctaText: "Quero conhecer resorts",
    whatsappContext: "resorts",
    assetKey: "resorts_luxury",
    media: {
      stillImage: "/assets/destinations/cruzeiros.webp",
      posterImage: "/assets/hero/airplane-poster.webp",
    },
    content: {
      pt: {
        badge: "Experiência Exclusiva",
        title: "Resorts & Praias: Descanso com estrutura e sofisticação.",
        subtitle: "Águas cristalinas, alta gastronomia e conforto para toda a família.",
        primaryCta: "Quero conhecer resorts",
        secondaryCta: "Ver Roteiros Completos",
      },
      en: {
        badge: "Exclusive Experience",
        title: "Resorts & Beaches: Unmatched relaxation and luxury.",
        subtitle: "Crystal waters, exquisite dining, and complete peace of mind.",
        primaryCta: "Explore resorts",
        secondaryCta: "View Full Itineraries",
      },
      es: {
        badge: "Experiencia Exclusiva",
        title: "Resorts y Playas: Descanso con estructura y sofisticación.",
        subtitle: "Aguas cristalinas, alta gastronomía y confort familiar absoluto.",
        primaryCta: "Quiero conocer resorts",
        secondaryCta: "Ver Itinerarios Completos",
      },
    },
  },
};

/**
 * Obtém a configuração de destino a partir do identificador ou retorna Chile por padrão.
 */
export function getDestinationConfig(targetDestination?: string): DestinationSceneConfig {
  const normalizedKey = (targetDestination || "chile").toLowerCase().trim();
  const found = DESTINATION_SCENES[normalizedKey];
  if (found) return found;
  return DESTINATION_SCENES.chile as DestinationSceneConfig;
}

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
  const destination = getDestinationConfig(targetDestination);

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
