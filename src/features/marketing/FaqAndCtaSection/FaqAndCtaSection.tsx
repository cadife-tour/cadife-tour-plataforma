"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { faqData, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import { isWhatsAppConfigured } from "@/shared/utils/whatsapp";

const MailIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export interface FaqAndCtaSectionProps {
  /** Número customizado para teste ou sobrescrita do canal de atendimento */
  phoneNumber?: string | null;
}

export const FaqAndCtaSection: React.FC<FaqAndCtaSectionProps> = ({ phoneNumber }) => {
  const { locale } = useLocale();
  const isAvailable = isWhatsAppConfigured(phoneNumber);

  const labels = {
    pt: {
      badge: "Perguntas Frequentes",
      title: "Dúvidas comuns sobre nossos serviços",
      subtitle: "Tudo o que você precisa saber antes de iniciar o planejamento da sua viagem.",
      bannerTitle: "Pronto para transformar seu próximo destino em realidade?",
      bannerSubtitle:
        "Fale diretamente com nossa consultoria no WhatsApp e receba um roteiro personalizado com cotação sob medida.",
      bannerSubtitleFallback:
        "Fale diretamente com nossa consultoria especializada e receba um roteiro personalizado com cotação sob medida.",
      bannerCta: "Falar com Consultor no WhatsApp",
      bannerCtaAria: "Falar com Consultor no WhatsApp (abre em nova aba)",
      emailCta: "Falar com Consultor por E-mail",
      emailAriaLabel: "Falar com Consultor por E-mail — contato@cadifetour.com.br",
      emailSubject: "Planejamento de Roteiro Personalizado — CADIFE Tour",
    },
    en: {
      badge: "Frequently Asked Questions",
      title: "Common questions about our advisory",
      subtitle: "Everything you need to know before we begin designing your travel itinerary.",
      bannerTitle: "Ready to turn your next dream journey into reality?",
      bannerSubtitle:
        "Connect directly with our travel advisory on WhatsApp and receive a personalized itinerary tailored to your style.",
      bannerSubtitleFallback:
        "Connect directly with our specialized travel advisory and receive a personalized itinerary tailored to your style.",
      bannerCta: "Connect on WhatsApp",
      bannerCtaAria: "Connect on WhatsApp (opens in new tab)",
      emailCta: "Contact Advisor by Email",
      emailAriaLabel: "Contact Advisor by Email — contato@cadifetour.com.br",
      emailSubject: "Travel Itinerary Inquiry — CADIFE Tour",
    },
    es: {
      badge: "Preguntas Frequentes",
      title: "Dudas comunes sobre nuestros servicios",
      subtitle: "Todo lo que necesita saber antes de comenzar la planificación de su viaje.",
      bannerTitle: "¿Listo para convertir su próximo destino en realidad?",
      bannerSubtitle:
        "Hable directamente con nuestros asesores en WhatsApp y reciba un itinerario personalizado a su medida.",
      bannerSubtitleFallback:
        "Hable directamente con nuestros asesores especializados y reciba un itinerario personalizado a su medida.",
      bannerCta: "Hablar por WhatsApp",
      bannerCtaAria: "Hablar por WhatsApp (abre en nueva pestaña)",
      emailCta: "Contactar Asesor por Correo",
      emailAriaLabel: "Contactar Asesor por Correo — contato@cadifetour.com.br",
      emailSubject: "Consulta de Itinerario de Viaje — CADIFE Tour",
    },
  };

  const t = labels[locale] || labels.pt;

  const handleToggleFaq = (idx: number, e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = e.currentTarget.open;
    trackEvent("faq_toggle", {
      question_id: `faq_${idx + 1}`,
      locale,
      state: isOpen ? "opened" : "closed",
    });
  };

  return (
    <section id="faq" className="border-b border-border py-20 lg:py-28">
      <Container>
        {/* 1. FAQ Accordion / Semântico */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
            {t.badge}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqData.map((item, idx) => {
            const question = item.question[locale] || item.question.pt;
            const answer = item.answer[locale] || item.answer.pt;

            return (
              <details
                key={idx}
                onToggle={(e) => handleToggleFaq(idx, e)}
                className="group rounded-xl border border-border bg-surface p-5 transition-colors open:bg-surface-elevated"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between rounded p-1 text-base font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent">
                  <span>{question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-brand-accent transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="border-border/50 mt-4 border-t pt-3 text-sm leading-relaxed text-foreground-muted">
                  {answer}
                </div>
              </details>
            );
          })}
        </div>

        {/* 2. Banner Final de Conversão & Atendimento */}
        <div
          id="contato"
          className="border-brand-primary/30 mt-20 scroll-mt-24 rounded-2xl border bg-gradient-to-b from-surface-elevated to-surface p-8 text-center shadow-lg sm:p-14"
        >
          <div className="mx-auto max-w-2xl space-y-6">
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.bannerTitle}
            </h3>
            <p className="text-base text-foreground-muted sm:text-lg">
              {isAvailable ? t.bannerSubtitle : t.bannerSubtitleFallback}
            </p>
            {isAvailable ? (
              <div className="flex justify-center pt-4">
                <WhatsAppCta
                  source="faq_banner"
                  size="lg"
                  variant="primary"
                  phoneNumber={phoneNumber}
                  aria-label={t.bannerCtaAria}
                >
                  {t.bannerCta}
                </WhatsAppCta>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="flex justify-center">
                  <a
                    href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(t.emailSubject)}`}
                    className="shadow-brand-primary/20 inline-flex h-12 min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-brand-primary px-7 font-heading text-base font-semibold text-white shadow-sm transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transform-none motion-reduce:transition-none"
                    aria-label={t.emailAriaLabel}
                  >
                    <MailIcon className="h-4 w-4 shrink-0" />
                    <span>{t.emailCta}</span>
                  </a>
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-semibold text-foreground">{contactInfo.email}</p>
                  <p className="text-foreground-muted">{contactInfo.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
