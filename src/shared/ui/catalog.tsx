"use client";

import type { ReactNode } from "react";
import { Button, Container, LanguageSelector, SkipToContent } from "@/shared/ui";
import type { sharedUiComponents } from "@/shared/ui";
import { LocaleProvider } from "@/core/i18n/LocaleContext";

export interface SharedUiCatalogEntry {
  key: keyof typeof sharedUiComponents;
  name: string;
  description: string;
  source: `src/shared/ui/${string}`;
  preview: ReactNode;
}

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
];
