import type { Metadata } from "next";
import { LandingSections } from "@/features/marketing/LandingSections";
import { HomePageSwitcher } from "@/features/marketing/HomePageSwitcher";
import { ContinuousJourneyHero } from "@/features/travel-experience/components/ContinuousJourneyHero";

export const metadata: Metadata = {
  title: "CADIFE Tour — Jornada contínua",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

export default function AlternativeHomePage() {
  return (
    <div className="flex flex-col">
      <HomePageSwitcher current={2} />
      <ContinuousJourneyHero />
      <LandingSections />
    </div>
  );
}
