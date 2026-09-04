export type JourneyPhaseName = "AIRPLANE" | "WINDOW" | "CLOUDS" | "CHILE";

export interface PhaseConfig {
  name: JourneyPhaseName;
  start: number;
  end: number;
}

export interface TravelExperienceConfig {
  heroScrollHeightVh: number;
  phases: Record<JourneyPhaseName, PhaseConfig>;
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
