"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import { Container } from "@/shared/ui/Container/Container";
import { LanguageSelector } from "@/shared/ui/LanguageSelector/LanguageSelector";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import { useLocale } from "@/core/i18n/LocaleContext";
import type { Locale } from "@/content/types";

interface NavItem {
  key: "travel" | "testimonials" | "contact" | "about";
  sectionId: string;
}

const navigationItems: NavItem[] = [
  { key: "travel", sectionId: "destinos" },
  { key: "testimonials", sectionId: "depoimentos" },
  { key: "contact", sectionId: "contato" },
  { key: "about", sectionId: "agencia" },
];

const hrefForSection = (sectionId: string) => `/#${sectionId}`;

const labels: Record<
  Locale,
  Record<NavItem["key"] | "cta" | "ctaAria" | "menuOpen" | "menuClose", string>
> = {
  pt: {
    travel: "Viagens",
    testimonials: "Depoimentos",
    contact: "Contato",
    about: "Sobre nós",
    cta: "Planeje sua viagem",
    ctaAria: "Planeje sua viagem no WhatsApp (abre em nova aba)",
    menuOpen: "Abrir menu de navegação",
    menuClose: "Fechar menu de navegação",
  },
  en: {
    travel: "Travel",
    testimonials: "Testimonials",
    contact: "Contact",
    about: "About Us",
    cta: "Plan Your Trip",
    ctaAria: "Plan Your Trip on WhatsApp (opens in new tab)",
    menuOpen: "Open navigation menu",
    menuClose: "Close navigation menu",
  },
  es: {
    travel: "Viajes",
    testimonials: "Testimonios",
    contact: "Contacto",
    about: "Sobre Nosotros",
    cta: "Planifica tu Viaje",
    ctaAria: "Planifica tu Viaje en WhatsApp (abre en nueva pestaña)",
    menuOpen: "Abrir menú de navegación",
    menuClose: "Cerrar menú de navegación",
  },
};

export const Header: React.FC = () => {
  const { locale } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuId = useId();

  const t = labels[locale] || labels.pt;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const sections = navigationItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !isMenuOpen) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ease-in-out motion-reduce:transition-none ${
        isScrolled ? "bg-brand-dark/95 backdrop-blur-md" : "bg-brand-dark/40 backdrop-blur-sm"
      }`}
    >
      <Container>
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 sm:h-20 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <div className="flex items-center justify-self-start">
            <a
              href="/"
              className="group rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="CADIFE Tour — Início"
            >
              <Image
                src="/assets/brand/cadife-logo-horizontal.webp"
                alt="CADIFE Tour"
                width={160}
                height={40}
                priority
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none sm:h-9"
              />
            </a>
          </div>

          {/* Desktop Navigation (centered) */}
          <nav
            className="hidden items-center gap-6 justify-self-center lg:flex"
            aria-label="Navegação Principal"
          >
            {navigationItems.map((item) => {
              const isActive = activeSectionId === item.sectionId;
              return (
                <a
                  key={item.key}
                  href={hrefForSection(item.sectionId)}
                  aria-current={isActive ? "location" : undefined}
                  className={`rounded px-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                    isActive ? "text-brand-accent" : "text-white/85 hover:text-white"
                  }`}
                >
                  {t[item.key]}
                </a>
              );
            })}
          </nav>

          {/* Actions: Language Selector & WhatsApp CTA */}
          <div className="flex items-center gap-3 justify-self-end">
            <LanguageSelector className="hidden lg:inline-block" />
            <WhatsAppCta
              source="header_nav"
              size="sm"
              variant="primary"
              className="hidden lg:inline-flex"
              aria-label={t.ctaAria}
            >
              {t.cta}
            </WhatsAppCta>

            {/* Mobile: language + menu toggle */}
            <LanguageSelector className="lg:hidden" />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={isMenuOpen ? t.menuClose : t.menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Panel */}
      <div
        id={mobileMenuId}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none lg:hidden ${
          isMenuOpen ? "max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)]" : "max-h-0"
        }`}
      >
        {isMenuOpen && (
          <nav
            aria-label="Navegação Principal (móvel)"
            className="bg-brand-dark/98 flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4 backdrop-blur-md sm:max-h-[calc(100dvh-5rem)]"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            {navigationItems.map((item) => {
              const isActive = activeSectionId === item.sectionId;
              return (
                <a
                  key={item.key}
                  href={hrefForSection(item.sectionId)}
                  onClick={closeMenu}
                  aria-current={isActive ? "location" : undefined}
                  className={`rounded-lg px-3 py-3 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                    isActive
                      ? "bg-white/10 text-brand-accent"
                      : "text-white/85 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {t[item.key]}
                </a>
              );
            })}
            <WhatsAppCta
              source="header_nav"
              size="md"
              variant="primary"
              onClick={closeMenu}
              className="mt-3 w-full"
              aria-label={t.ctaAria}
            >
              {t.cta}
            </WhatsAppCta>
          </nav>
        )}
      </div>
    </header>
  );
};
