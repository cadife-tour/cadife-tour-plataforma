import type { Metadata } from "next";
import "@/core/theme/globals.css";
import { SkipToContent } from "@/shared/ui/SkipToContent/SkipToContent";

export const metadata: Metadata = {
  title: "CADIFE Tour — Experiências de Viagem Sob Medida",
  description:
    "Consultoria especializada em viagens internacionais, nacionais, ecoturismo e cruzeiros. Atendimento humano, seguro e personalizado.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cadifetour.com.br"),
  openGraph: {
    title: "CADIFE Tour — Experiências de Viagem Sob Medida",
    description:
      "Consultoria especializada em viagens internacionais, nacionais, ecoturismo e cruzeiros.",
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
        <SkipToContent />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
