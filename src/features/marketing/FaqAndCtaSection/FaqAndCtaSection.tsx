"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { faqData, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { trackEvent } from "@/core/analytics";
import { isWhatsAppConfigured } from "@/shared/utils/whatsapp";
import { TravelEyebrow } from "@/shared/ui/travel/TravelEyebrow";
import { BoardingPass, Barcode } from "@/shared/ui/travel/BoardingPass";
import { PassportStamp } from "@/shared/ui/travel/PassportStamp";

const ticketLabels = {
  pt: {
    heading: "Cartão de embarque",
    from: "De",
    to: "Para",
    you: "Você",
    next: "Próximo destino",
    stamp: "BOA VIAGEM",
    cls: "Classe",
    clsValue: "Sob medida",
    when: "Embarque",
    whenValue: "Quando quiser",
  },
  en: {
    heading: "Boarding pass",
    from: "From",
    to: "To",
    you: "You",
    next: "Next destination",
    stamp: "BON VOYAGE",
    cls: "Class",
    clsValue: "Bespoke",
    when: "Boarding",
    whenValue: "Whenever you like",
  },
  es: {
    heading: "Tarjeta de embarque",
    from: "De",
    to: "A",
    you: "Tú",
    next: "Próximo destino",
    stamp: "BUEN VIAJE",
    cls: "Clase",
    clsValue: "A medida",
    when: "Embarque",
    whenValue: "Cuando quieras",
  },
};

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
      emailAriaLabel: "Falar com Consultor por E-mail — contato@cadifetour.com",
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
      emailAriaLabel: "Contact Advisor by Email — contato@cadifetour.com",
      emailSubject: "Travel Itinerary Inquiry — CADIFE Tour",
    },
    es: {
      badge: "Preguntas Frecuentes",
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
      emailAriaLabel: "Contactar Asesor por Correo — contato@cadifetour.com",
      emailSubject: "Consulta de Itinerario de Viaje — CADIFE Tour",
    },
  };

  const t = labels[locale] || labels.pt;
  const ticket = ticketLabels[locale] || ticketLabels.pt;

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
          <TravelEyebrow align="center">{t.badge}</TravelEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
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
                className="group rounded-2xl border border-border bg-surface p-5 transition-colors open:border-brand-accent/30 open:bg-surface-elevated"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between rounded p-1 text-base font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent">
                  <span>{question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-brand-accent transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 border-t border-border/50 pt-3 text-sm leading-relaxed text-foreground-muted">
                  {answer}
                </div>
              </details>
            );
          })}
        </div>

        {/* 2. Banner Final de Conversão & Atendimento — cartão de embarque */}
        <div id="contato" className="relative mt-20 scroll-mt-24">
          <BoardingPass
            orientation="horizontal"
            heading={ticket.heading}
            code="CDF · 2026"
            bodyClassName="bg-[radial-gradient(120%_120%_at_0%_0%,rgb(221_11_14_/_0.22),transparent_55%),var(--color-surface-elevated)] p-8 sm:p-12"
            stub={
              <div className="flex h-full flex-col justify-between gap-6">
                <dl className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">
                  <div>
                    <dt>{ticket.from}</dt>
                    <dd className="mt-1 font-heading text-2xl normal-case tracking-normal text-foreground">
                      {ticket.you}
                    </dd>
                  </div>
                  <div>
                    <dt>{ticket.to}</dt>
                    <dd className="mt-1 font-heading text-2xl normal-case tracking-normal text-brand-accent">
                      ?
                    </dd>
                  </div>
                  <div>
                    <dt>{ticket.cls}</dt>
                    <dd className="mt-1 font-heading text-lg normal-case tracking-normal text-brand-gold">
                      {ticket.clsValue}
                    </dd>
                  </div>
                  <div>
                    <dt>{ticket.when}</dt>
                    <dd className="mt-1 font-heading text-lg normal-case tracking-normal text-foreground">
                      {ticket.whenValue}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt>{ticket.next}</dt>
                    <dd className="mt-1 h-px w-full bg-[repeating-linear-gradient(90deg,currentColor_0_6px,transparent_6px_11px)] opacity-60" />
                  </div>
                </dl>
                <Barcode className="text-foreground-subtle" />
              </div>
            }
          >
            <div className="max-w-xl space-y-6">
              <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {t.bannerTitle}
              </h3>
              <p className="text-base text-foreground-muted sm:text-lg">
                {isAvailable ? t.bannerSubtitle : t.bannerSubtitleFallback}
              </p>
              {isAvailable ? (
                <div className="flex pt-4">
                  <WhatsAppCta
                    source="faq_banner"
                    size="lg"
                    variant="primary"
                    phoneNumber={phoneNumber}
                    className="rounded-full shadow-glow"
                    aria-label={t.bannerCtaAria}
                  >
                    {t.bannerCta}
                  </WhatsAppCta>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <div className="flex">
                    <a
                      href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(t.emailSubject)}`}
                      className="inline-flex h-12 min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-brand-primary px-7 font-sans text-base font-semibold text-white shadow-sm shadow-brand-primary/20 transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transform-none motion-reduce:transition-none"
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
          </BoardingPass>
          <PassportStamp
            label="CADIFE TOUR"
            title={ticket.stamp}
            caption="✈ 2026 ✈"
            tone="red"
            rotate={-16}
            size={132}
            className="absolute -top-10 right-6 hidden drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] sm:block md:right-[17rem]"
          />
        </div>
      </Container>
    </section>
  );
};
