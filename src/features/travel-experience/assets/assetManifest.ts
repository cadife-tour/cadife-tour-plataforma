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
  images: {
    airplanePoster: "/assets/hero/airplane-poster.webp",
    chileAndes: "/assets/hero/andes-still.webp",
  },
} as const;
