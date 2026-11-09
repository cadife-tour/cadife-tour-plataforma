import Link from "next/link";
import { DestinationsSection } from "@/features/destinations/DestinationsSection/DestinationsSection";
import { destinationPages } from "@/content/destinationPages";
import { HowItWorksSection } from "@/features/marketing/HowItWorksSection/HowItWorksSection";
import { AboutAndTrustSection } from "@/features/marketing/AboutAndTrustSection/AboutAndTrustSection";
import { FaqAndCtaSection } from "@/features/marketing/FaqAndCtaSection/FaqAndCtaSection";

export function LandingSections() {
  return (
    <>
      <DestinationsSection />
      <nav aria-label="Destinos" className="flex flex-wrap justify-center gap-4 px-4 py-6">
        {destinationPages.map(({ slug, name }) => (
          <Link key={slug} href={`/destinos/${slug}`} className="underline">
            {name}
          </Link>
        ))}
      </nav>
      <HowItWorksSection />
      <AboutAndTrustSection />
      <FaqAndCtaSection />
    </>
  );
}
