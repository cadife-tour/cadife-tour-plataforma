import type { Metadata } from "next";
import { DesignSystemBeforeAfter } from "@/shared/ui/DesignSystemBeforeAfter";

export const metadata: Metadata = {
  title: "Antes e depois | Design System | CADIFE Tour",
  description:
    "Comparação lado a lado entre o design system original e a proposta v2 da CADIFE Tour.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemBeforeAfterPage() {
  return <DesignSystemBeforeAfter />;
}
