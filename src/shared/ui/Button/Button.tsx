import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild: _asChild, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary: "bg-brand-primary text-foreground hover:bg-brand-secondary focus-visible:outline-brand-accent",
      secondary: "bg-surface-elevated text-foreground hover:bg-surface-muted focus-visible:outline-brand-accent",
      outline: "border border-border text-foreground hover:bg-surface-elevated hover:border-brand-accent focus-visible:outline-brand-accent",
      ghost: "text-foreground-muted hover:text-foreground hover:bg-surface-elevated focus-visible:outline-brand-accent",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
