"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { contactInfo, institutionalInfo } from "@/content/data";
import type { SocialNetworkId } from "@/content/types";
import { useLocale } from "@/core/i18n/LocaleContext";

const SocialIcon: React.FC<{ id: SocialNetworkId; className?: string }> = ({
  id,
  className = "h-3.5 w-3.5 shrink-0",
}) => {
  switch (id) {
    case "instagram":
      return (
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
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
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
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "tiktok":
      return (
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
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "youtube":
      return (
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
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3v6z" />
        </svg>
      );
  }
};

export const Footer: React.FC = () => {
  const { locale } = useLocale();

  const labels = {
    pt: {
      tagline: `Uma experiência. Uma nova memória. Desde ${institutionalInfo.foundedYear}.`,
      socialTitle: "Redes sociais",
      socialAria: (name: string) => `${name} da CADIFE Tour (abre em nova aba)`,
      contactTitle: "Atendimento & Contato",
      phoneAria: (phone: string) => `Telefone oficial e WhatsApp: ${phone}`,
      navTitle: "Navegação",
      destinations: "Destinos em Destaque",
      howItWorks: "Como Funciona",
      about: "A Agência",
      faq: "Dúvidas Frequentes",
      legalTitle: "Segurança & Conformidade",
      cnpjLabel: "CNPJ",
      municipalRegLabel: "Inscrição Municipal",
      cadasturLabel: "Cadastur",
      cadasturVerifyAria: (number: string) =>
        `Consultar registro Cadastur ${number} no site oficial (abre em nova aba)`,
      privacyPolicy: "Política de Privacidade",
      privacyPolicyAria: "Política de Privacidade da CADIFE Tour (abre em nova aba)",
      cookiePreferences: "Preferências de Cookies",
      rights: "Todos os direitos reservados.",
      whatsappBtn: "Chamar no WhatsApp",
      whatsappAria: "Chamar no WhatsApp (abre em nova aba)",
    },
    en: {
      tagline: `A new experience. A new memory. Since ${institutionalInfo.foundedYear}.`,
      socialTitle: "Social channels",
      socialAria: (name: string) => `CADIFE Tour on ${name} (opens in new tab)`,
      contactTitle: "Contact & Support",
      phoneAria: (phone: string) => `Official phone and WhatsApp: ${phone}`,
      navTitle: "Navigation",
      destinations: "Featured Destinations",
      howItWorks: "How It Works",
      about: "About Us",
      faq: "FAQ",
      legalTitle: "Safety & Compliance",
      cnpjLabel: "CNPJ (Tax ID)",
      municipalRegLabel: "Municipal Registration",
      cadasturLabel: "Cadastur",
      cadasturVerifyAria: (number: string) =>
        `Verify Cadastur registration ${number} on the official portal (opens in new tab)`,
      privacyPolicy: "Privacy Policy",
      privacyPolicyAria: "CADIFE Tour Privacy Policy (opens in new tab)",
      cookiePreferences: "Cookie Preferences",
      rights: "All rights reserved.",
      whatsappBtn: "Contact via WhatsApp",
      whatsappAria: "Contact via WhatsApp (opens in new tab)",
    },
    es: {
      tagline: `Una nueva experiencia. Un nuevo recuerdo. Desde ${institutionalInfo.foundedYear}.`,
      socialTitle: "Redes sociales",
      socialAria: (name: string) => `${name} de CADIFE Tour (abre en nueva pestaña)`,
      contactTitle: "Atención y Contacto",
      phoneAria: (phone: string) => `Teléfono oficial y WhatsApp: ${phone}`,
      navTitle: "Navegación",
      destinations: "Destinos Destacados",
      howItWorks: "Cómo Funciona",
      about: "La Agencia",
      faq: "Preguntas Frecuentes",
      legalTitle: "Seguridad y Cumplimiento",
      cnpjLabel: "CNPJ",
      municipalRegLabel: "Inscripción Municipal",
      cadasturLabel: "Cadastur",
      cadasturVerifyAria: (number: string) =>
        `Consultar registro Cadastur ${number} en el sitio oficial (abre en nueva pestaña)`,
      privacyPolicy: "Política de Privacidad",
      privacyPolicyAria: "Política de Privacidad de CADIFE Tour (abre en nueva pestaña)",
      cookiePreferences: "Preferencias de Cookies",
      rights: "Todos los derechos reservados.",
      whatsappBtn: "Contactar por WhatsApp",
      whatsappAria: "Contactar por WhatsApp (abre en nueva pestaña)",
    },
  };

  const t = labels[locale] || labels.pt;
  const whatsappDisplay = contactInfo.whatsappDisplay || institutionalInfo.whatsapp.formatted;
  const rawPhone = (contactInfo.whatsappNumber || institutionalInfo.whatsapp.raw).replace(
    /\D/g,
    ""
  );

  return (
    <footer className="border-t border-border bg-background py-16 text-foreground-muted">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/brand/cadife-icon-192.png"
                alt={institutionalInfo.brandName}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-foreground">
                CADIFE <span className="font-medium text-brand-primary">Tour</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground-subtle">{t.tagline}</p>

            <div className="pt-1">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                {t.socialTitle}
              </p>
              <ul className="flex flex-wrap gap-2">
                {institutionalInfo.socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.socialAria(social.name)}
                      className="hover:border-brand-accent/50 inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                    >
                      <SocialIcon id={social.id} />
                      <span>{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Navegação */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.navTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/#destinos"
                  className="rounded py-0.5 transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                >
                  {t.destinations}
                </a>
              </li>
              <li>
                <a
                  href="/#como-funciona"
                  className="rounded py-0.5 transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                >
                  {t.howItWorks}
                </a>
              </li>
              <li>
                <a
                  href="/#agencia"
                  className="rounded py-0.5 transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                >
                  {t.about}
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="rounded py-0.5 transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                >
                  {t.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Contato Oficial */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.contactTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <WhatsAppCta
                  source="footer"
                  variant="link"
                  showIcon={false}
                  className="py-0.5 font-medium"
                  aria-label={t.whatsappAria}
                >
                  {t.whatsappBtn} →
                </WhatsAppCta>
              </li>
              <li>
                <a
                  href={`tel:+${rawPhone}`}
                  aria-label={t.phoneAria(whatsappDisplay)}
                  className="rounded py-0.5 font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="rounded py-0.5 transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="pt-1 text-[11px] leading-relaxed text-foreground-subtle">
                <p>{institutionalInfo.fiscalAddress.formattedLine1}</p>
                <p>{institutionalInfo.fiscalAddress.formattedLine2}</p>
              </li>
            </ul>
          </div>

          {/* 4. Conformidade, Registro Oficial e Políticas */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.legalTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={institutionalInfo.legalLinks.privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.privacyPolicyAria}
                  className="rounded py-0.5 font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {t.privacyPolicy} ↗
                </a>
              </li>
              <li>
                <Link
                  href={institutionalInfo.legalLinks.cookiePreferencesUrl}
                  className="rounded py-0.5 font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                >
                  {t.cookiePreferences}
                </Link>
              </li>
            </ul>

            <dl className="space-y-1 pt-2 text-[11px] leading-relaxed text-foreground-subtle">
              <div>
                <dt className="inline font-semibold text-foreground-muted">{t.cnpjLabel}: </dt>
                <dd className="inline">{institutionalInfo.cnpj}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-foreground-muted">
                  {t.municipalRegLabel}:{" "}
                </dt>
                <dd className="inline">{institutionalInfo.municipalRegistration}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-foreground-muted">{t.cadasturLabel}: </dt>
                <dd className="inline">
                  <a
                    href={institutionalInfo.cadastur.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.cadasturVerifyAria(institutionalInfo.cadastur.number)}
                    className="underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                  >
                    {institutionalInfo.cadastur.number}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-xs text-foreground-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {institutionalInfo.brandName}. {t.rights}
          </p>
          <p className="text-[11px]">
            {institutionalInfo.fiscalAddress.city}/{institutionalInfo.fiscalAddress.state} —{" "}
            {institutionalInfo.fiscalAddress.country}
          </p>
        </div>
      </Container>
    </footer>
  );
};
