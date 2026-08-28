"use client";

import React from "react";
import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";
import { faqData, contactInfo } from "@/content/data";
import { useLocale } from "@/core/i18n/LocaleContext";
import { buildWhatsAppUrl } from "@/shared/utils/whatsapp";
import { trackEvent } from "@/core/analytics";

export const FaqAndCtaSection: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      badge: "Perguntas Frequentes",
      title: "Dúvidas comuns sobre nossos serviços",
      subtitle: "Tudo o que você precisa saber antes de iniciar o planejamento da sua viagem.",
      bannerTitle: "Pronto para transformar seu próximo destino em realidade?",
      bannerSubtitle:
        "Fale diretamente com nossa consultoria no WhatsApp e receba um roteiro personalizado com cotação sob medida.",
      bannerCta: "Falar com Consultor no WhatsApp",
    },
    en: {
      badge: "Frequently Asked Questions",
      title: "Common questions about our advisory",
      subtitle: "Everything you need to know before we begin designing your travel itinerary.",
      bannerTitle: "Ready to turn your next dream journey into reality?",
      bannerSubtitle:
        "Connect directly with our travel advisory on WhatsApp and receive a personalized itinerary tailored to your style.",
      bannerCta: "Connect on WhatsApp",
    },
    es: {
      badge: "Preguntas Frecuentes",
      title: "Dudas comunes sobre nuestros servicios",
      subtitle: "Todo lo que necesita saber antes de comenzar la planificación de su viaje.",
      bannerTitle: "¿Listo para convertir su próximo destino en realidad?",
      bannerSubtitle:
        "Hable directamente con nuestros asesores en WhatsApp y reciba un itinerario personalizado a su medida.",
      bannerCta: "Hablar por WhatsApp",
    },
  };

  const t = labels[locale] || labels.pt;

  const whatsappUrl = buildWhatsAppUrl({
    phoneNumber: contactInfo.whatsappNumber,
    locale,
    context: "general",
  });

  const handleToggleFaq = (idx: number, e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = e.currentTarget.open;
    trackEvent("faq_toggle", {
      question_id: `faq_${idx + 1}`,
      locale,
      state: isOpen ? "opened" : "closed",
    });
  };

  const handleCtaClick = () => {
    trackEvent("whatsapp_conversion", {
      cta_location: "faq_banner",
      locale,
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
          <p className="mt-4 text-base text-foreground-muted sm:text-lg">
            {t.subtitle}
          </p>
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
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent rounded p-1">
                  <span>{question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-brand-accent transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 border-t border-border/50 pt-3 text-sm text-foreground-muted leading-relaxed">
                  {answer}
                </div>
              </details>
            );
          })}
        </div>

        {/* 2. Banner Final de Conversão */}
        <div className="mt-20 rounded-2xl border border-brand-primary/30 bg-gradient-to-b from-surface-elevated to-surface p-8 text-center sm:p-14 shadow-lg">
          <div className="mx-auto max-w-2xl space-y-6">
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.bannerTitle}
            </h3>
            <p className="text-base text-foreground-muted sm:text-lg">
              {t.bannerSubtitle}
            </p>
            <div className="pt-4 flex justify-center">
              <Button size="lg" asChild>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  aria-label={`${t.bannerCta} (abre no WhatsApp)`}
                >
                  {t.bannerCta}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
