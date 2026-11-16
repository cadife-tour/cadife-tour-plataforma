import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "li";
  variant?: "surface" | "elevated" | "glass";
  padding?: "sm" | "md" | "lg";
  /** Eleva levemente no hover/foco — use quando o card inteiro é clicável. */
  interactive?: boolean;
}

/** Superfície base para agrupar conteúdo com borda, raio e sombra do sistema. */
export const Card: React.FC<CardProps> = ({
  as: Tag = "div",
  variant = "surface",
  padding = "md",
  interactive = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    surface: "border border-border bg-surface shadow-md",
    elevated: "border border-border bg-surface-elevated shadow-lg",
    glass: "liquid-glass liquid-glass-strong",
  };
  const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

  return (
    <Tag
      className={twMerge(
        clsx(
          "rounded-3xl",
          variants[variant],
          paddings[padding],
          interactive &&
            "transition-all duration-300 ease-expressive focus-within:border-brand-accent/40 hover:-translate-y-1 hover:border-brand-accent/40 hover:shadow-xl motion-reduce:transform-none",
          className
        )
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
