"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import { createWhatsAppUrl } from "@/shared/utils/whatsapp";

export interface WhatsAppCtaProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  destination?: string;
  destinationTitle?: string;
  source?: "hero" | "header" | "footer" | "card" | "floating" | string;
  variant?: "primary" | "secondary" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  customMessage?: string;
}

/**
 * Ícone oficial minimalista e nítido do WhatsApp em SVG puro
 */
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Componente oficial de conversão para atendimento via WhatsApp da CADIFE Tour.
 *
 * - Suporta mensagens contextuais automáticas por destino
 * - Rastreamento analítico unificado sem PII
 * - Totalmente acessível (teclado, focus ring, target/rel, aria-label)
 */
export const WhatsAppCta = React.forwardRef<HTMLAnchorElement, WhatsAppCtaProps>(
  (
    {
      destination,
      destinationTitle,
      source = "hero",
      variant = "primary",
      size = "md",
      showIcon = true,
      customMessage,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { locale } = useLocale();

    const whatsappUrl = createWhatsAppUrl({
      destination,
      destinationTitle,
      source,
      locale,
      customMessage,
    });

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackEvent("whatsapp_conversion", {
        cta_location: source,
        destination: destination || destinationTitle || "geral",
        locale,
      });

      if (onClick) {
        onClick(e);
      }
    };

    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-secondary focus-visible:outline-brand-accent shadow-brand-primary/20",
      secondary:
        "bg-surface-elevated text-foreground hover:bg-surface-muted focus-visible:outline-brand-accent border border-border",
      glass:
        "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus-visible:outline-white",
      outline:
        "border border-border text-foreground hover:bg-surface-elevated hover:border-brand-accent focus-visible:outline-brand-accent",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-7 text-base gap-2.5",
    };

    const fallbackLabel =
      destination || destinationTitle
        ? `Conversar sobre ${destinationTitle || destination} no WhatsApp (abre em nova aba)`
        : "Conversar com a CADIFE Tour no WhatsApp (abre em nova aba)";

    return (
      <a
        ref={ref}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={props["aria-label"] || fallbackLabel}
        className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
        {...props}
      >
        {showIcon && <WhatsAppIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
        <span>{children || "Fale com a CADIFE Tour"}</span>
      </a>
    );
  }
);

WhatsAppCta.displayName = "WhatsAppCta";
