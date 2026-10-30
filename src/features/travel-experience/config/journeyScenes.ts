/** Progressos normalizados; os segundos reais vêm dos metadados de cada clipe. */
export interface SceneTiming {
  mobileScrollVh: number;
  desktopScrollVh: number;
  videoEnd: number;
  continuationStart: number;
  introEnd: number;
  cloudsStart: number;
  cloudsEnd: number;
  revealStart: number;
  revealEnd: number;
  exitStart: number;
}

const defaults: SceneTiming = {
  mobileScrollVh: 350,
  desktopScrollVh: 500,
  videoEnd: 0.85,
  continuationStart: 0.65,
  introEnd: 0.25,
  cloudsStart: 0.42,
  cloudsEnd: 0.69,
  revealStart: 0.69,
  revealEnd: 0.82,
  exitStart: 0.94,
};

export const JOURNEY_SCENES = [
  { destination: "chile", timing: { ...defaults } },
  { destination: "argentina", timing: { ...defaults } },
  { destination: "peru", timing: { ...defaults, mobileScrollVh: 300, desktopScrollVh: 400 } },
  { destination: "cruzeiros", timing: { ...defaults } },
  { destination: "portugal", timing: { ...defaults } },
  { destination: "espanha", timing: { ...defaults } },
  { destination: "franca", timing: { ...defaults } },
  { destination: "italia", timing: { ...defaults } },
  { destination: "brasil", timing: { ...defaults } },
  { destination: "resorts", timing: { ...defaults, exitStart: 1 } },
];

export function getSceneTiming(destination: string): SceneTiming {
  return JOURNEY_SCENES.find((scene) => scene.destination === destination)?.timing ?? defaults;
}
