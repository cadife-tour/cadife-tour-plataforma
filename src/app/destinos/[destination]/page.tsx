import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { destinationPages } from "@/content/destinationPages";
import { LandingSections } from "@/features/marketing/LandingSections";
import { TravelExperience } from "@/features/travel-experience/TravelExperience";
import { getDestinationConfig } from "@/features/travel-experience/config/travelExperienceConfig";

interface PageProps {
  params: Promise<{ destination: string }>;
}

export function generateStaticParams() {
  return destinationPages.map(({ slug }) => ({ destination: slug }));
}

async function resolveDestination({ params }: PageProps) {
  const { destination } = await params;
  const page = destinationPages.find(({ slug }) => slug === destination);
  if (!page) notFound();
  return { ...page, content: getDestinationConfig(page.scene).content };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, content } = await resolveDestination(props);
  const title = slug === "rio-de-janeiro" ? "Viagem para o Rio de Janeiro" : content.pt.title;
  const url = `/destinos/${slug}`;
  return {
    title,
    description: content.pt.subtitle,
    alternates: { canonical: url },
    openGraph: { title, description: content.pt.subtitle, url, siteName: "CADIFE Tour" },
  };
}

export default async function DestinationPage(props: PageProps) {
  const { slug, scene, content } = await resolveDestination(props);
  const isRio = slug === "rio-de-janeiro";
  return (
    <div className="flex flex-col">
      <TravelExperience
        mode="single"
        targetDestination={scene}
        introTitle={
          isRio
            ? {
                pt: "Viagem para o Rio de Janeiro",
                en: "Travel to Rio de Janeiro",
                es: "Viaje a Río de Janeiro",
              }
            : { pt: content.pt.title, en: content.en.title, es: content.es.title }
        }
      />
      <LandingSections />
    </div>
  );
}
