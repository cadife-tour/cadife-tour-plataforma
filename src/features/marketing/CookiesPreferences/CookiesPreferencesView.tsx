"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Container } from "@/shared/ui/Container/Container";
import { useLocale } from "@/core/i18n/LocaleContext";
import { cookiesPolicyContent } from "@/content/cookiesPolicy";
import { institutionalInfo } from "@/content/data";

export const CookiesPreferencesView: React.FC = () => {
  const { locale } = useLocale();
  const content = cookiesPolicyContent[locale] || cookiesPolicyContent.pt;

  return (
    <article className="pb-20 pt-28 sm:pt-32 lg:pb-28">
      <Container>
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Header & Intro */}
          <header className="space-y-5 border-b border-border pb-8">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg text-sm font-medium text-foreground-muted transition-colors duration-micro ease-standard hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{content.backToHome}</span>
            </Link>

            <div className="space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-accent">
                {content.badge}
              </span>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {content.title}
              </h1>
              <p className="text-xs font-medium text-foreground-subtle">
                {content.lastUpdatedLabel}{" "}
                <span className="text-foreground-muted">{content.lastUpdatedDate}</span>
              </p>
            </div>

            <div className="space-y-2 text-base leading-relaxed text-foreground-muted">
              {content.intro.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={institutionalInfo.legalLinks.privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-micro ease-standard hover:border-brand-accent hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
              >
                <span>{content.privacyPolicyCta}</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </header>

          {/* Current Operational Status */}
          <section
            aria-labelledby="cookie-status-heading"
            className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent"
                aria-hidden="true"
              />
              <div className="space-y-2">
                <h2
                  id="cookie-status-heading"
                  className="font-heading text-lg font-bold text-foreground"
                >
                  {content.statusBannerTitle}
                </h2>
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {content.statusBannerDescription}
                </p>
              </div>
            </div>
          </section>

          {/* Categories Overview */}
          <section aria-labelledby="cookie-categories-heading" className="space-y-6">
            <h2
              id="cookie-categories-heading"
              className="font-heading text-2xl font-bold text-foreground"
            >
              {content.categoriesHeading}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-5"
                >
                  <div className="space-y-2">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground-muted">
                      {category.description}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        category.isEssential
                          ? "bg-brand-primary/20 text-foreground"
                          : "bg-surface-elevated text-foreground-muted"
                      }`}
                    >
                      {category.defaultState}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Inventory Table */}
          <section aria-labelledby="cookie-inventory-heading" className="space-y-4">
            <div className="space-y-2">
              <h2
                id="cookie-inventory-heading"
                className="font-heading text-2xl font-bold text-foreground"
              >
                {content.inventoryHeading}
              </h2>
              <p className="text-sm text-foreground-muted">{content.inventoryNote}</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated text-foreground">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.name}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.provider}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.category}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.purpose}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.duration}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      {content.inventoryColumns.origin}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground-muted">
                  {content.inventory.map((item) => (
                    <tr key={item.name}>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{item.name}</td>
                      <td className="px-4 py-3">{item.provider}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.purpose}</td>
                      <td className="px-4 py-3">{item.duration}</td>
                      <td className="px-4 py-3">{item.origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Full Policy Sections */}
          <section aria-label={content.title} className="space-y-8 border-t border-border pt-8">
            {content.sections.map((section) => (
              <div key={section.id} id={section.id} className="space-y-3">
                <h2 className="font-heading text-xl font-bold text-foreground">{section.title}</h2>
                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed text-foreground-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground-muted sm:text-base">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          {/* Official Contact Box */}
          <section
            aria-labelledby="cookie-contact-heading"
            className="rounded-xl border border-border bg-surface-elevated p-6 sm:p-8"
          >
            <h2
              id="cookie-contact-heading"
              className="font-heading text-lg font-bold text-foreground"
            >
              {content.contactHeading}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                  {content.contactLabels.email}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${institutionalInfo.email}`}
                    className="font-medium text-foreground underline-offset-4 transition-colors duration-micro ease-standard hover:text-brand-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                  >
                    {institutionalInfo.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                  {content.contactLabels.whatsapp}
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {institutionalInfo.whatsapp.formatted}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                  {content.contactLabels.cnpj}
                </dt>
                <dd className="mt-1 font-medium text-foreground">{institutionalInfo.cnpj}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                  {content.contactLabels.location}
                </dt>
                <dd className="mt-1 font-medium text-foreground">
                  {institutionalInfo.fiscalAddress.city}/{institutionalInfo.fiscalAddress.state} —{" "}
                  {institutionalInfo.fiscalAddress.country}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </Container>
    </article>
  );
};
