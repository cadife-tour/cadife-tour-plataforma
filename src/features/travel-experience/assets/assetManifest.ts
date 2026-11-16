/**
 * Manifesto de mídia da Hero.
 * Os modelos experimentais não são carregados pela POC híbrida.
 */
export const ASSET_MANIFEST = {
  models: {
    airplane: "/assets/models/airplane.glb",
    chile: "/assets/models/chile_andes.glb",
  },
  textures: {
    cloud: "/assets/textures/cloud.webp",
    patagonia: "/assets/destinations/patagonia.webp",
  },
  videos: {
    heroJourney: "/assets/hero/airplane-journey-scrub.mp4",
  },
  destinations: {
    chile: {
      videoSrc: "/assets/hero/airplane-journey-scrub.mp4",
      posterImage: "/assets/hero/airplane-poster.webp",
      stillImage: "/assets/hero/andes-still.webp",
    },
    argentina: {
      videoSrc: "/assets/hero/destinations/argentina-scrub.mp4",
      posterImage: "/assets/hero/destinations/argentina-poster.webp",
      stillImage: "/assets/hero/destinations/argentina-still.webp",
    },
    peru: {
      videoSrc: "/assets/hero/destinations/peru-scrub.mp4",
      posterImage: "/assets/hero/destinations/peru-poster.webp",
      stillImage: "/assets/hero/destinations/peru-still.webp",
    },
    cruzeiros: {
      videoSrc: "/assets/hero/destinations/cruzeiros-scrub.mp4",
      posterImage: "/assets/hero/destinations/cruzeiros-poster.webp",
      stillImage: "/assets/hero/destinations/cruzeiros-still.webp",
    },
    portugal: {
      videoSrc: "/assets/hero/destinations/portugal-scrub.mp4",
      posterImage: "/assets/hero/destinations/portugal-poster.webp",
      stillImage: "/assets/hero/destinations/portugal-still.webp",
    },
    espanha: {
      videoSrc: "/assets/hero/destinations/espanha-scrub.mp4",
      posterImage: "/assets/hero/destinations/espanha-poster.webp",
      stillImage: "/assets/hero/destinations/espanha-still.webp",
    },
    franca: {
      videoSrc: "/assets/hero/destinations/franca-scrub.mp4",
      posterImage: "/assets/hero/destinations/franca-poster.webp",
      stillImage: "/assets/hero/destinations/franca-still.webp",
    },
    italia: {
      videoSrc: "/assets/hero/destinations/italia-scrub.mp4",
      posterImage: "/assets/hero/destinations/italia-poster.webp",
      stillImage: "/assets/hero/destinations/italia-still.webp",
    },
    brasil: {
      videoSrc: "/assets/hero/destinations/brasil-scrub.mp4",
      posterImage: "/assets/hero/destinations/brasil-poster.webp",
      stillImage: "/assets/hero/destinations/brasil-still.webp",
    },
    resorts: {
      videoSrc: "/assets/hero/destinations/resorts-scrub.mp4",
      posterImage: "/assets/hero/destinations/resorts-poster.webp",
      stillImage: "/assets/hero/destinations/resorts-still.webp",
    },
  },
  images: {
    airplanePoster: "/assets/hero/airplane-poster.webp",
    chileAndes: "/assets/hero/andes-still.webp",
  },
} as const;
