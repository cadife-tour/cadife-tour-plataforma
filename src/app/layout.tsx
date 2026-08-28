import type { Metadata } from "next";
import "@/core/theme/globals.css";
import { LocaleProvider } from "@/core/i18n/LocaleContext";
import { SkipToContent } from "@/shared/ui/SkipToContent/SkipToContent";
import { Header } from "@/features/marketing/Header/Header";
import { Footer } from "@/features/marketing/Footer/Footer";

export const metadata: Metadata = {
  title: "CADIFE Tour — Consultoria e Experiências de Viagem Sob Medida",
  description:
    "Consultoria especializada em viagens internacionais, nacionais, ecoturismo e cruzeiros. Atendimento humano, seguro e personalizado com suporte do embarque ao retorno.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cadifetour.com.br"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "en-US": "/?lang=en",
      "es-ES": "/?lang=es",
    },
  },
  openGraph: {
    title: "CADIFE Tour — Consultoria de Viagens Sob Medida",
    description:
      "Planejamento completo, roteiros personalizados e suporte humanizado do embarque ao retorno.",
    url: "https://cadifetour.com.br",
    siteName: "CADIFE Tour",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand-primary selection:text-white">
        <LocaleProvider>
          <SkipToContent />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
