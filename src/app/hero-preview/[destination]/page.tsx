import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";
import {
  AVAILABLE_VIDEO_DESTINATIONS,
  getDestinationConfig,
} from "@/features/travel-experience/config/travelExperienceConfig";

interface PreviewProps {
  params: Promise<{ destination: string }>;
}

export function generateStaticParams() {
  return AVAILABLE_VIDEO_DESTINATIONS.map((destination) => ({ destination }));
}

export async function generateMetadata({ params }: PreviewProps): Promise<Metadata> {
  const { destination } = await params;
  const content = getDestinationConfig(destination).content.pt;
  return {
    title: `Prévia da Hero — ${content.title}`,
    description: content.subtitle,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
  };
}

/** Prévia técnica de mídia. As landing pages finais serão entregues nas issues de SEO. */
export default async function HeroPreviewPage({ params }: PreviewProps) {
  const { destination } = await params;
  if (!AVAILABLE_VIDEO_DESTINATIONS.includes(destination)) notFound();
  return (
    <>
      <TravelExperience mode="single" targetDestination={destination} />
      <FaqAndCtaSection />
    </>
  );
}
