import type { ReactNode } from "react";
import { clsx } from "clsx";
import { PlaneGlyph } from "@/shared/ui/travel/BoardingPass";

/**
 * Sobretítulo de seção como uma rota de voo: avião + trajeto tracejado + rótulo.
 */
export function TravelEyebrow({
  children,
  align = "start",
  className,
}: {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-accent",
        align === "center" && "justify-center",
        className
      )}
    >
      <PlaneGlyph className="h-4 w-4 rotate-90" />
      <span
        aria-hidden="true"
        className="h-px w-10 bg-[repeating-linear-gradient(90deg,currentColor_0_5px,transparent_5px_9px)] opacity-70"
      />
      <span>{children}</span>
    </span>
  );
}
