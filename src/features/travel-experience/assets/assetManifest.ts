/**
 * Manifesto de assets para a experiência 3D.
 * Centraliza URLs e caminhos para permitir substituição imediata quando modelos .glb forem adicionados.
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
    heroJourney: "/assets/hero/airplane-journey.mp4",
  },
} as const;
