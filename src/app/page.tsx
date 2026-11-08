import { HeroSection } from "@/features/marketing/HeroSection/HeroSection";
import { LandingSections } from "@/features/marketing/LandingSections";
import { HomePageSwitcher } from "@/features/marketing/HomePageSwitcher";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomePageSwitcher current={1} />
      {/* 1. Hero Section: Decolagem e Proposta de Valor */}
      <HeroSection />

      {/* 2. Destinos & Roteiros H�bridos: Inspira��o + Informa��o Objetiva */}
      <LandingSections />
    </div>
  );
}
