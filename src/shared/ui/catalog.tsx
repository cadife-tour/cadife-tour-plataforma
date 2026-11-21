"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  Button,
  Container,
  LanguageSelector,
  LiquidGlassSurface,
  SkipToContent,
  WhatsAppCta,
} from "@/shared/ui";
import type { sharedUiComponents } from "@/shared/ui";
import { LocaleProvider } from "@/core/i18n/LocaleContext";

export interface SharedUiCatalogEntry {
  key: keyof typeof sharedUiComponents;
  name: string;
  description: string;
  source: `src/shared/ui/${string}`;
  preview: ReactNode;
}

/**
 * Intercepta cliques na fase de captura para que os exemplos não abram o WhatsApp
 * nem registrem conversões de analytics.
 */
const blockPreviewNavigation = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

export const sharedUiCatalog: SharedUiCatalogEntry[] = [
  {
    key: "Button",
    name: "Button",
    description: "Ação reutilizável com variantes, tamanhos e estado desabilitado.",
    source: "src/shared/ui/Button/Button.tsx",
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary CTA</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="outline">Outline action</Button>
        <Button variant="ghost">Ghost action</Button>
        <Button disabled>Disabled action</Button>
        <Button size="sm">Small size</Button>
        <Button size="md">Medium size</Button>
        <Button size="lg">Large size</Button>
      </div>
    ),
  },
  {
    key: "Container",
    name: "Container",
    description: "Limita e centraliza o conteúdo em larguras compartilhadas.",
    source: "src/shared/ui/Container/Container.tsx",
    preview: (
      <div className="grid gap-3">
        {(["sm", "md", "lg", "full"] as const).map((size) => (
          <Container
            key={size}
            size={size}
            className="rounded border border-border bg-surface px-3 py-2 text-center text-sm"
          >
            <code>{`Container size="${size}"`}</code>
          </Container>
        ))}
      </div>
    ),
  },
  {
    key: "LanguageSelector",
    name: "LanguageSelector",
    description: "Menu acessível para escolher português, inglês ou espanhol.",
    source: "src/shared/ui/LanguageSelector/LanguageSelector.tsx",
    preview: (
      <LocaleProvider persistPreference={false} syncDocumentLanguage={false}>
        <div
          className="flex flex-col items-end rounded-lg bg-surface p-6"
          data-testid="language-selector-preview"
        >
          <LanguageSelector className="w-fit" trackChanges={false} />
          <p className="mt-4 w-full text-sm text-foreground-muted">
            Abra o seletor para conferir os idiomas disponíveis.
          </p>
        </div>
      </LocaleProvider>
    ),
  },
  {
    key: "LiquidGlassSurface",
    name: "LiquidGlassSurface",
    description:
      "Vidro líquido com refração real em WebGL2 para superfícies flutuantes (header, menus, seletores); sem WebGL2 usa vidro em CSS como reserva.",
    source: "src/shared/ui/LiquidGlass/LiquidGlassSurface.tsx",
    preview: (
      <div className="relative overflow-hidden rounded-2xl bg-[url('/assets/destinations/patagonia.webp')] bg-cover bg-center p-8">
        <LiquidGlassSurface className="mx-auto flex max-w-sm items-center justify-between gap-4 rounded-full px-5 py-3 text-sm font-semibold text-white">
          <span className="text-base font-bold">CADIFE Tour</span>
          <span className="text-white/80">Destinos · Contato</span>
        </LiquidGlassSurface>
      </div>
    ),
  },
  {
    key: "SkipToContent",
    name: "SkipToContent",
    description: "Link de acesso rápido ao conteúdo principal, revelado no foco.",
    source: "src/shared/ui/SkipToContent/SkipToContent.tsx",
    preview: (
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="mb-4 text-sm text-foreground-muted">
          Use Tab para focar o link e visualizar seu estado acessível.
        </p>
        <SkipToContent />
      </div>
    ),
  },
  {
    key: "WhatsAppCta",
    name: "WhatsAppCta",
    description:
      "CTA oficial de conversão: monta a mensagem por destino e idioma, com variantes e telemetria centralizadas.",
    source: "src/shared/ui/WhatsAppCta/WhatsAppCta.tsx",
    preview: (
      <LocaleProvider persistPreference={false} syncDocumentLanguage={false}>
        <div
          className="grid gap-4"
          data-testid="whatsapp-cta-preview"
          onClickCapture={blockPreviewNavigation}
        >
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppCta source="design_system">Primary</WhatsAppCta>
            <WhatsAppCta source="design_system" variant="secondary">
              Secondary
            </WhatsAppCta>
            <WhatsAppCta source="design_system" variant="outline">
              Outline
            </WhatsAppCta>
            <WhatsAppCta source="design_system" variant="link">
              Link
            </WhatsAppCta>
            <WhatsAppCta source="design_system" disabled>
              Disabled
            </WhatsAppCta>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-br from-brand-primary/70 via-brand-dark to-background p-5">
            <WhatsAppCta source="design_system" variant="glass">
              Glass sobre imagem
            </WhatsAppCta>
            <WhatsAppCta
              source="design_system"

              destination="chile"
              destinationTitle="Chile"
              context="destination"
              size="sm"
            />
          </div>
          <p className="text-sm text-foreground-muted">
            Nesta biblioteca os cliques ficam bloqueados: nada abre o WhatsApp nem gera evento.
          </p>
        </div>
      </LocaleProvider>
    ),
  },
];
