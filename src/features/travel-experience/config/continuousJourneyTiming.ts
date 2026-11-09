import journey from "./continuousJourney.json";

/** Give cloud returns three times the scroll distance of destination footage. */
export const CLOUD_SCROLL_MULTIPLIER = 3;
const lastFrame = journey.duration - 1 / 24;

export const continuousJourneySegments = journey.chapters.flatMap((chapter, index) => {
  const next = journey.chapters[index + 1];
  const start = index === 0 ? 0 : chapter.reveal;
  const cloudEnd = Math.min(next?.reveal ?? lastFrame, lastFrame);
  return [
    {
      phase: "destination" as const,
      from: start,
      to: chapter.returnStart,
      duration: chapter.returnStart - start,
    },
    {
      phase: "clouds" as const,
      from: chapter.returnStart,
      to: cloudEnd,
      duration: (cloudEnd - chapter.returnStart) * CLOUD_SCROLL_MULTIPLIER,
    },
  ];
});

export const continuousJourneyScrollScale =
  continuousJourneySegments.reduce((sum, segment) => sum + segment.duration, 0) / lastFrame;
