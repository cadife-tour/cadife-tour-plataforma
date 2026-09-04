import {
  TRAVEL_EXPERIENCE_CONFIG,
  type JourneyPhaseName,
} from "../config/travelExperienceConfig";
import type { CameraWaypoints } from "./timelineTypes";

/**
 * Clampa um número entre min e max.
 */
export function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Interpolação linear simples.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Retorna a fase atual dado o progresso normalizado [0, 1].
 */
export function getPhaseFromProgress(progress: number): JourneyPhaseName {
  const p = clamp(progress, 0, 1);
  const { phases } = TRAVEL_EXPERIENCE_CONFIG;

  if (p < phases.WINDOW.start) return "AIRPLANE";
  if (p < phases.CLOUDS.start) return "WINDOW";
  if (p < phases.CHILE.start) return "CLOUDS";
  return "CHILE";
}

/**
 * Normaliza o progresso relativo dentro da fase atual [0, 1].
 */
export function getPhaseProgress(
  progress: number,
  phase: JourneyPhaseName
): number {
  const { start, end } = TRAVEL_EXPERIENCE_CONFIG.phases[phase];
  const range = end - start;
  if (range <= 0) return 0;
  return clamp((progress - start) / range, 0, 1);
}

/**
 * Suavização suave (smoothstep).
 */
export function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/**
 * Interpola posição e alvo da câmera entre os marcos da timeline.
 */
export function interpolateCamera(progress: number): CameraWaypoints {
  const p = clamp(progress, 0, 1);
  const { camera, phases } = TRAVEL_EXPERIENCE_CONFIG;

  if (p <= phases.AIRPLANE.end) {
    // 0.00 -> 0.15: Câmera na cabine/visão geral
    const t = smoothstep(getPhaseProgress(p, "AIRPLANE"));
    return {
      position: [
        lerp(camera.airplane.position[0], camera.airplane.position[0] + 0.15, t),
        lerp(camera.airplane.position[1], camera.airplane.position[1] + 0.05, t),
        lerp(camera.airplane.position[2], camera.airplane.position[2] - 0.8, t),
      ],
      target: [
        lerp(camera.airplane.target[0], camera.airplane.target[0] + 0.2, t),
        lerp(camera.airplane.target[1], camera.airplane.target[1], t),
        lerp(camera.airplane.target[2], camera.airplane.target[2], t),
      ],
      fov: lerp(camera.airplane.fov, 53, t),
    };
  }

  if (p <= phases.WINDOW.end) {
    // 0.15 -> 0.30: Câmera se aproxima da janela
    const t = smoothstep(getPhaseProgress(p, "WINDOW"));
    return {
      position: [
        lerp(camera.airplane.position[0] + 0.15, camera.window.position[0], t),
        lerp(camera.airplane.position[1] + 0.05, camera.window.position[1], t),
        lerp(camera.airplane.position[2] - 0.8, camera.window.position[2], t),
      ],
      target: [
        lerp(camera.airplane.target[0] + 0.2, camera.window.target[0], t),
        lerp(camera.airplane.target[1], camera.window.target[1], t),
        lerp(camera.airplane.target[2], camera.window.target[2], t),
      ],
      fov: lerp(53, camera.window.fov, t),
    };
  }

  if (p <= phases.CLOUDS.end) {
    // 0.30 -> 0.50: Câmera atravessa a janela e entra/percorre as nuvens
    const t = smoothstep(getPhaseProgress(p, "CLOUDS"));
    return {
      position: [
        lerp(camera.window.position[0], camera.clouds.position[0], t),
        lerp(camera.window.position[1], camera.clouds.position[1], t),
        lerp(camera.window.position[2], camera.clouds.position[2], t),
      ],
      target: [
        lerp(camera.window.target[0], camera.clouds.target[0], t),
        lerp(camera.window.target[1], camera.clouds.target[1], t),
        lerp(camera.window.target[2], camera.clouds.target[2], t),
      ],
      fov: lerp(camera.window.fov, camera.clouds.fov, t),
    };
  }

  // 0.50 -> 1.00: Emerge das nuvens e aproxima-se dos Andes (Chile)
  const t = smoothstep(getPhaseProgress(p, "CHILE"));
  return {
    position: [
      lerp(camera.clouds.position[0], camera.chile.position[0], t),
      lerp(camera.clouds.position[1], camera.chile.position[1], t),
      lerp(camera.clouds.position[2], camera.chile.position[2], t),
    ],
    target: [
      lerp(camera.clouds.target[0], camera.chile.target[0], t),
      lerp(camera.clouds.target[1], camera.chile.target[1], t),
      lerp(camera.clouds.target[2], camera.chile.target[2], t),
    ],
    fov: lerp(camera.clouds.fov, camera.chile.fov, t),
  };
}
