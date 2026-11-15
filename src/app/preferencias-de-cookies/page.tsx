import type { Metadata } from "next";
import { CookiesPreferencesView } from "@/features/marketing/CookiesPreferences/CookiesPreferencesView";

export const metadata: Metadata = {
  title: "Preferências de Cookies e Política de Cookies | CADIFE Tour",
  description:
    "Consulte a Política de Cookies e acesse as informações sobre preferências de privacidade e categorias de cookies da CADIFE Tour.",
  alternates: {
    canonical: "/preferencias-de-cookies",
  },
  openGraph: {
    title: "Preferências de Cookies — CADIFE Tour",
    description:
      "Transparência sobre o uso de cookies, armazenamento local e preferências de privacidade no site da CADIFE Tour.",
    url: "/preferencias-de-cookies",
    siteName: "CADIFE Tour",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPreferencesPage() {
  return <CookiesPreferencesView />;
}
