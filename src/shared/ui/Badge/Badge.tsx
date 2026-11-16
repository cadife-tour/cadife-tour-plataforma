import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "gold" | "neutral" | "success";
  variant?: "soft" | "outline" | "solid";
  size?: "sm" | "md";
}

/** Selo curto para categorias, status e destaques (ex.: CULTURA, NOVO, ESGOTADO). */
export const Badge: React.FC<BadgeProps> = ({
  tone = "brand",
  variant = "soft",
  size = "sm",
  className,
  children,
  ...props
}) => {
  const tones = {
    brand: {
      soft: "border-brand-accent/30 bg-brand-primary/10 text-brand-accent",
      outline: "border-brand-accent/60 text-brand-accent",
      solid: "border-transparent bg-brand-primary text-white",
    },
    gold: {
      soft: "border-brand-gold/30 bg-brand-gold/10 text-brand-gold",
      outline: "border-brand-gold/60 text-brand-gold",
      solid: "border-transparent bg-brand-gold text-brand-dark",
    },
    neutral: {
      soft: "border-border bg-surface-muted text-foreground-muted",
      outline: "border-border text-foreground-muted",
      solid: "border-transparent bg-foreground text-background",
    },
    success: {
      soft: "border-ink-green/30 bg-ink-green/10 text-ink-green",
      outline: "border-ink-green/60 text-ink-green",
      solid: "border-transparent bg-ink-green text-brand-dark",
    },
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border font-sans font-bold uppercase tracking-[0.14em]",
          tones[tone][variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
