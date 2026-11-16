import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BoardingPassProps {
  /** Linha superior do bilhete (ex.: "CARTÃO DE EMBARQUE"). */
  heading: ReactNode;
  /** Código à direita do cabeçalho (ex.: "ETAPA 01"). */
  code?: ReactNode;
  children: ReactNode;
  /** Canhoto destacável, separado por linha picotada. */
  stub?: ReactNode;
  orientation?: "vertical" | "horizontal";
  className?: string;
  bodyClassName?: string;
  stubClassName?: string;
}

/**
 * Cartão de embarque: corpo + canhoto com recortes laterais e picote tracejado.
 * Em `horizontal`, o canhoto fica à direita a partir de 768px e embaixo no mobile.
 */
export function BoardingPass({
  heading,
  code,
  children,
  stub,
  orientation = "vertical",
  className,
  bodyClassName,
  stubClassName,
}: BoardingPassProps) {
  const horizontal = orientation === "horizontal";

  return (
    <div
      className={clsx(
        "drop-shadow-[0_18px_30px_rgba(26,10,8,0.45)]",
        horizontal
          ? "ticket-horizontal flex flex-col md:flex-row"
          : "ticket-vertical flex flex-col",
        className
      )}
    >
      <div
        className={clsx(
          "ticket-body relative flex-1 rounded-2xl bg-surface-elevated p-6",
          horizontal ? "rounded-b-none md:rounded-b-2xl md:rounded-r-none" : "rounded-b-none",
          bodyClassName
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground-subtle">
          <span className="flex items-center gap-2">
            <PlaneGlyph className="h-3.5 w-3.5 text-brand-accent" />
            {heading}
          </span>
          {code && <span className="text-brand-accent">{code}</span>}
        </div>
        {children}
      </div>
      {stub && (
        <div
          className={clsx(
            "ticket-stub relative rounded-2xl bg-surface-elevated p-6",
            horizontal
              ? "rounded-t-none md:w-72 md:rounded-l-none md:rounded-tr-2xl"
              : "rounded-t-none py-5",
            stubClassName
          )}
        >
          {stub}
        </div>
      )}
    </div>
  );
}

export function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" />
    </svg>
  );
}

/** Código de barras decorativo do canhoto. */
export function Barcode({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={twMerge(clsx("barcode h-9 w-full opacity-70", className))} />
  );
}
