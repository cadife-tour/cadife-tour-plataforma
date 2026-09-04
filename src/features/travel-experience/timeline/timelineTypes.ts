import type { JourneyPhaseName } from "../config/travelExperienceConfig";

export interface JourneyState {
  progress: number;
  currentPhase: JourneyPhaseName;
  phaseProgress: number;
}

export interface CameraWaypoints {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
