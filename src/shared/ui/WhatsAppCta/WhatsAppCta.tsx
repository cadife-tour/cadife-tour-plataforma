"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/content/types";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import type { AnalyticsEventMap } from "@/core/analytics";
import { createWhatsAppUrl } from "@/shared/utils/whatsapp";

export interface WhatsAppCtaProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  /** Identificador de destino ou slug para contextualizar a mensagem (ex: 'chile', 'europa-classica') */
  destination?: string;
  /** Título amigável do destino para interpolação da mensagem (ex: 'Chile', 'Europa Clássica') */
  destinationTitle?: string;
  /** Local de origem do CTA para telemetria (ex: 'header_nav', 'hero', 'footer', 'faq_banner') */
  source?:
    | "hero"
    | "header"
    | "header_nav"
    | "footer"
    | "card"
    | "floating"
    | "faq_banner"
    | "destination_card"
    | "how_it_works"
    | string;
  /** Variação visual do componente conforme o Design System */
  variant?: "primary" | "secondary" | "glass" | "outline" | "link";
  /** Tamanho do componente */
  size?: "sm" | "md" | "lg";
  /** Se o ícone oficial em SVG do WhatsApp deve ser exibido */
  showIcon?: boolean;
  /** Mensagem customizada explícita para o WhatsApp */
  customMessage?: string;
  /** Número customizado caso necessário (default: número oficial da CADIFE ou fallback #contato se pendente) */
  phoneNumber?: string | null;
  /** Contexto semântico para template de mensagem */
  context?: "general" | "destination" | "quote" | "custom";
  /** Sobrescreve o locale caso necessário */
  locale?: Locale;
  /** Desabilita o componente, impedindo navegação, disparos analíticos e ajustando a11y */
  disabled?: boolean;
}

/**
 * Ícone oficial minimalista e nítido do WhatsApp em SVG puro
 */
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Remove menções a WhatsApp e anúncios de nova aba para manter coerência semântica no fallback.
 */
function cleanWhatsAppMention(text: string, locale: Locale = "pt"): string {
  const trimmed = text.trim();
  if (/^chamar no whatsapp$/i.test(trimmed)) {
    return locale === "en"
      ? "Talk to Advisor"
      : locale === "es"
        ? "Hablar con Asesor"
        : "Falar com Consultor";
  }
  if (/^falar com consultor no whatsapp$/i.test(trimmed)) {
    return locale === "en"
      ? "Talk to Advisor"
      : locale === "es"
        ? "Hablar con Asesor"
        : "Falar com Consultor";
  }
  if (/^connect on whatsapp$/i.test(trimmed) || /^contact via whatsapp$/i.test(trimmed)) {
    return "Talk to Advisor";
  }
  if (
    /^hablar por whatsapp$/i.test(trimmed) ||
    /^contactar por whatsapp$/i.test(trimmed) ||
    /^conversar por whatsapp$/i.test(trimmed)
  ) {
    return "Hablar con Asesor";
  }

  return trimmed
    .replace(
      /\s*(?:\(|\[)?(?:abre|opens|abrir)\s+(?:em|no|on|en)\s+(?:nova aba|new tab|nueva pestaña|whatsapp)(?:\)|\])?/gi,
      ""
    )
    .replace(/\s*(?:no|via|por|on|en)\s*whatsapp/gi, "")
    .trim();
}

/**
 * Higieniza recursivamente os nós de texto dos filhos para remover menções enganosas a WhatsApp no fallback.
 */
function sanitizeNodeText(node: React.ReactNode, locale: Locale): React.ReactNode {
  if (typeof node === "string") {
    return cleanWhatsAppMention(node, locale);
  }
  if (Array.isArray(node)) {
    return React.Children.map(node, (child) => sanitizeNodeText(child, locale));
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props && props.children) {
      return React.cloneElement(node, {
        ...props,
        children: sanitizeNodeText(props.children, locale),
      } as React.Attributes & { children?: React.ReactNode });
    }
  }
  return node;
}

/**
 * Extrai o texto plano visível dos elementos, ignorando elementos puramente decorativos (aria-hidden).
 */
function extractTextFromNode(node: React.ReactNode): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim();
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).filter(Boolean).join(" ").trim();
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode; "aria-hidden"?: boolean | string };
    if (props["aria-hidden"] === true || props["aria-hidden"] === "true") {
      return "";
    }
    if (props.children) {
      return extractTextFromNode(props.children);
    }
  }
  return "";
}

/**
 * Componente oficial de conversão para atendimento via WhatsApp da CADIFE Tour.
 *
 * - Suporta mensagens contextuais automáticas por destino e locale
 * - Centraliza o número oficial e regras de higienização de URLs
 * - Rastreamento analítico unificado sem PII (Privacy-First)
 * - Totalmente acessível (teclado, focus visible ring, target/rel seguro, aria-label contextual, estado disabled)
 */
export const WhatsAppCta = React.forwardRef<HTMLAnchorElement, WhatsAppCtaProps>(
  (
    {
      destination,
      destinationTitle,
      source = "hero",
      variant = "primary",
      size = "md",
      showIcon,
      customMessage,
      phoneNumber,
      context,
      locale: customLocale,
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { locale: contextLocale } = useLocale();
    const effectiveLocale = customLocale || contextLocale || "pt";

    const {
      target: _consumerTarget,
      rel: _consumerRel,
      tabIndex: _consumerTabIndex,
      "aria-disabled": _consumerAriaDisabled,
      "aria-label": consumerAriaLabel,
      ...safeRestProps
    } = props;

    const whatsappUrl = createWhatsAppUrl({
      destination,
      destinationTitle,
      source,
      locale: effectiveLocale,
      customMessage,
      phoneNumber,
      context,
    });

    const isLinkVariant = variant === "link";
    const isInternalFallback =
      !whatsappUrl || whatsappUrl.startsWith("#") || !/^https?:\/\//i.test(whatsappUrl);
    const isExternal = !isInternalFallback;
    const shouldShowIcon =
      showIcon !== undefined ? showIcon : !isLinkVariant && !isInternalFallback;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Dispara conversão analítica de WhatsApp somente se o deep link for externo e válido.
      // Se for fallback interno para a seção #contato, não registra conversão de WhatsApp indevida.
      if (isExternal) {
        const payload: AnalyticsEventMap["whatsapp_conversion"] = {
          cta_location: source,
          locale: effectiveLocale,
          ...(destinationTitle || destination
            ? { destination: destinationTitle || destination }
            : {}),
        };

        trackEvent("whatsapp_conversion", payload);
      }

      if (onClick) {
        onClick(e);
      }
    };

    const baseStyles =
      "inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none";

    const buttonInteractiveStyles =
      "cursor-pointer shadow-sm active:translate-y-0 active:scale-[0.985]";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-secondary hover:-translate-y-0.5 shadow-brand-primary/20 hover:shadow-md focus-visible:outline-brand-accent",
      secondary:
        "bg-surface-elevated text-foreground hover:bg-surface-muted hover:border-brand-accent/40 focus-visible:outline-brand-accent border border-border",
      glass:
        "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus-visible:outline-white",
      outline:
        "bg-transparent border border-border text-foreground hover:bg-surface-elevated hover:border-brand-accent focus-visible:outline-brand-accent",
      link: "bg-transparent p-0 text-brand-accent hover:text-brand-primary hover:underline underline-offset-4 focus-visible:outline-brand-accent shadow-none active:scale-100",
    };

    const buttonSizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "min-h-[44px] h-11 px-5 text-sm gap-2",
      lg: "min-h-[48px] h-12 px-7 text-base gap-2.5",
    };

    const linkSizeStyles = {
      sm: "text-xs gap-1.5",
      md: "text-sm gap-2",
      lg: "text-base gap-2.5",
    };

    const disabledStyles =
      "opacity-50 pointer-events-none cursor-not-allowed select-none shadow-none";

    const targetDestinationLabel = destinationTitle || destination;

    const defaultAriaLabelsExternal: Record<Locale, string> = {
      pt: targetDestinationLabel
        ? `Conversar sobre ${targetDestinationLabel} no WhatsApp (abre em nova aba)`
        : "Conversar com a CADIFE Tour no WhatsApp (abre em nova aba)",
      en: targetDestinationLabel
        ? `Chat about ${targetDestinationLabel} on WhatsApp (opens in new tab)`
        : "Chat with CADIFE Tour on WhatsApp (opens in new tab)",
      es: targetDestinationLabel
        ? `Conversar sobre ${targetDestinationLabel} en WhatsApp (abre en nueva pestaña)`
        : "Conversar con CADIFE Tour en WhatsApp (abre en nueva pestaña)",
    };

    const defaultAriaLabelsFallback: Record<Locale, string> = {
      pt: targetDestinationLabel
        ? `Ir para informações de contato sobre ${targetDestinationLabel}`
        : "Ir para seção de contato da CADIFE Tour",
      en: targetDestinationLabel
        ? `Go to contact information about ${targetDestinationLabel}`
        : "Go to CADIFE Tour contact section",
      es: targetDestinationLabel
        ? `Ir a la información de contacto sobre ${targetDestinationLabel}`
        : "Ir a la sección de contacto de CADIFE Tour",
    };

    const defaultChildrenExternal: Record<Locale, string> = {
      pt: targetDestinationLabel
        ? `Quero Conhecer ${targetDestinationLabel}`
        : "Fale com a CADIFE Tour",
      en: targetDestinationLabel ? `Explore ${targetDestinationLabel}` : "Talk to CADIFE Tour",
      es: targetDestinationLabel
        ? `Quiero Conocer ${targetDestinationLabel}`
        : "Hablar con CADIFE Tour",
    };

    const defaultChildrenFallback: Record<Locale, string> = {
      pt: targetDestinationLabel ? `Falar sobre ${targetDestinationLabel}` : "Falar com Consultor",
      en: targetDestinationLabel ? `Inquire about ${targetDestinationLabel}` : "Talk to Advisor",
      es: targetDestinationLabel
        ? `Consultar sobre ${targetDestinationLabel}`
        : "Hablar con Asesor",
    };

    let computedContent: React.ReactNode;
    if (isExternal) {
      computedContent =
        children !== undefined && children !== null
          ? children
          : defaultChildrenExternal[effectiveLocale] || defaultChildrenExternal.pt;
    } else {
      if (children !== undefined && children !== null) {
        computedContent = sanitizeNodeText(children, effectiveLocale);
      } else {
        computedContent = defaultChildrenFallback[effectiveLocale] || defaultChildrenFallback.pt;
      }
    }

    let computedAriaLabel: string;
    if (isExternal) {
      if (consumerAriaLabel) {
        // Se o consumidor passar um aria-label com fragmentos em PT ("abre em nova aba" ou "no WhatsApp")
        // enquanto o locale ativo for EN ou ES, higieniza e traduz para garantir acessibilidade internacional.
        let localizedAria = consumerAriaLabel;
        if (effectiveLocale === "en") {
          localizedAria = localizedAria
            .replace(/no whatsapp/gi, "on WhatsApp")
            .replace(/\(abre em nova aba\)/gi, "(opens in new tab)")
            .replace(/abre no whatsapp/gi, "opens on WhatsApp");
        } else if (effectiveLocale === "es") {
          localizedAria = localizedAria
            .replace(/no whatsapp/gi, "en WhatsApp")
            .replace(/\(abre em nova aba\)/gi, "(abre en nueva pestaña)")
            .replace(/abre no whatsapp/gi, "abre en WhatsApp");
        }
        computedAriaLabel = localizedAria;
      } else {
        computedAriaLabel =
          defaultAriaLabelsExternal[effectiveLocale] || defaultAriaLabelsExternal.pt;
      }
    } else {
      // No fallback interno (#contato), o anúncio acessível descreve a ação real para a seção de contato
      // e inclui o rótulo visível para cumprir WCAG 2.5.3 (Label in Name).
      const visibleText = extractTextFromNode(computedContent);
      const actionSuffix: Record<Locale, string> = {
        pt: "(ir para seção de contato)",
        en: "(go to contact section)",
        es: "(ir a la sección de contacto)",
      };
      const suffix = actionSuffix[effectiveLocale] || actionSuffix.pt;

      if (visibleText) {
        computedAriaLabel = `${visibleText} ${suffix}`;
      } else {
        computedAriaLabel =
          defaultAriaLabelsFallback[effectiveLocale] || defaultAriaLabelsFallback.pt;
      }
    }

    return (
      <a
        ref={ref}
        {...safeRestProps}
        href={whatsappUrl}
        target={!disabled && isExternal ? "_blank" : undefined}
        rel={!disabled && isExternal ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        aria-label={computedAriaLabel}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : _consumerTabIndex}
        className={twMerge(
          clsx(
            baseStyles,
            !isLinkVariant && buttonInteractiveStyles,
            variantStyles[variant],
            isLinkVariant ? linkSizeStyles[size] : buttonSizeStyles[size],
            disabled && disabledStyles,
            className
          )
        )}
      >
        {shouldShowIcon && <WhatsAppIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
        <span>{computedContent}</span>
      </a>
    );
  }
);

WhatsAppCta.displayName = "WhatsAppCta";
