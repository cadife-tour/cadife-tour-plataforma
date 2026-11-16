import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import type { Locale } from "@/content/types";
import { TravelOverlay } from "@/features/travel-experience/components/TravelOverlay";
import { PLAYLIST_DESTINATIONS } from "@/features/travel-experience/config/journeyScenes";
import { getDestinationConfig } from "@/features/travel-experience/config/travelExperienceConfig";

const phases = [0, 0.24, 0.25, 0.42, 0.43, 0.55, 0.68, 0.69, 0.7, 0.82, 1];

describe.each<Locale>(["pt", "en", "es"])("Exclusive hero text phases (%s)", (locale) => {
  it.each(PLAYLIST_DESTINATIONS)("never overlays clouds and destination in %s", (destination) => {
    const view = (progress: number, showIntro: boolean) => (
      <LocaleProvider initialLocale={locale}>
        <TravelOverlay progress={progress} showIntro={showIntro} targetDestination={destination} />
      </LocaleProvider>
    );
    const { rerender } = render(view(0, false));
    for (const showIntro of [false, true]) {
      for (const progress of [...phases, ...[...phases].reverse()]) {
        rerender(view(progress, showIntro));
        const visibleHeadings = screen.queryAllByRole("heading");
        expect(
          visibleHeadings.length,
          `${destination}, intro=${showIntro}, progress=${progress}`
        ).toBeLessThanOrEqual(1);
        if (!showIntro) {
          expect(
            screen.getByRole("heading", {
              name: getDestinationConfig(destination).content[locale].title,
            })
          ).toBeVisible();
        }
      }
    }
  });
});
