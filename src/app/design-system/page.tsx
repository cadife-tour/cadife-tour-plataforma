import type { Metadata } from "next";
import { DesignSystemLibrary } from "@/shared/ui/DesignSystemLibrary";

export const metadata: Metadata = {
  title: "Design System | CADIFE Tour",
  description: "Biblioteca interna de tokens visuais e componentes compartilhados da CADIFE Tour.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  return <DesignSystemLibrary />;
}
