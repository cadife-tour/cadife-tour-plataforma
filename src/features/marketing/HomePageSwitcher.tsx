"use client";

import { useLocale } from "@/core/i18n/LocaleContext";

const labels = {
  pt: { label: "Escolher página inicial", pages: ["Página 1", "Página 2"] },
  en: { label: "Choose homepage", pages: ["Page 1", "Page 2"] },
  es: { label: "Elegir página de inicio", pages: ["Página 1", "Página 2"] },
};

export function HomePageSwitcher({ current }: { current: 1 | 2 }) {
  const { locale } = useLocale();
  const text = labels[locale];
  return (
    <nav
      aria-label={text.label}
      className="fixed bottom-4 left-4 z-40 flex rounded-lg border border-white/30 bg-brand-dark p-1 shadow-sm"
    >
      {["/", "/home-2"].map((href, index) => (
        <a
          key={href}
          href={href}
          aria-current={current === index + 1 ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-md px-3 font-heading text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${current === index + 1 ? "bg-brand-accent" : "hover:bg-white/10"}`}
        >
          {text.pages[index]}
        </a>
      ))}
    </nav>
  );
}
