import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  /** Mostra um indicador de progresso e bloqueia novos cliques. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild: _asChild,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-200 ease-standard active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer motion-reduce:transform-none motion-reduce:transition-none";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white shadow-sm hover:bg-brand-secondary hover:shadow-glow focus-visible:outline-brand-accent",
      secondary:
        "bg-surface-elevated text-foreground hover:bg-surface-muted focus-visible:outline-brand-accent",
      outline:
        "border border-border text-foreground hover:bg-surface-elevated hover:border-brand-accent focus-visible:outline-brand-accent",
      ghost:
        "text-foreground-muted hover:text-foreground hover:bg-surface-elevated focus-visible:outline-brand-accent",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 min-h-[48px] px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
