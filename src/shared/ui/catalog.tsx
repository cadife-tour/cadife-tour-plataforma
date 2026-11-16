"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  Badge,
  BoardingPass,
  Button,
  Card,
  Container,
  LanguageSelector,
  LiquidGlassSurface,
  PassportStamp,
  PostageStamp,
  SkipToContent,
  TextField,
  TravelEyebrow,
  WhatsAppCta,
} from "@/shared/ui";
import { Barcode } from "@/shared/ui/travel/BoardingPass";
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
        <Button loading>Loading state</Button>
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
  {
    key: "Badge",
    name: "Badge",
    description: "Selo curto para categorias, status e destaques, em quatro tons e três estilos.",
    source: "src/shared/ui/Badge/Badge.tsx",
    preview: (
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge>Cultura</Badge>
          <Badge tone="gold">Sob medida</Badge>
          <Badge tone="success">Confirmado</Badge>
          <Badge tone="neutral">Rascunho</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Outline</Badge>
          <Badge variant="solid">Solid</Badge>
          <Badge tone="gold" variant="solid" size="md">
            Destaque
          </Badge>
        </div>
      </div>
    ),
  },
  {
    key: "Card",
    name: "Card",
    description:
      "Superfície base com borda, raio e sombra quente; variantes sólida, elevada e vidro.",
    source: "src/shared/ui/Card/Card.tsx",
    preview: (
      <div className="grid gap-3 sm:grid-cols-3">
        <Card padding="sm">
          <p className="font-heading text-lg">Surface</p>
          <p className="text-xs text-foreground-muted">Padrão para conteúdo.</p>
        </Card>
        <Card variant="elevated" padding="sm" interactive tabIndex={0}>
          <p className="font-heading text-lg">Interativo</p>
          <p className="text-xs text-foreground-muted">Eleva no hover e no foco.</p>
        </Card>
        <div className="rounded-3xl bg-sunset p-3">
          <Card variant="glass" padding="sm">
            <p className="font-heading text-lg text-white">Vidro</p>
            <p className="text-xs text-white/80">Sobre imagens e cores.</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    key: "TextField",
    name: "TextField",
    description: "Campo acessível com rótulo, dica e erro anunciados; aceita texto longo.",
    source: "src/shared/ui/TextField/TextField.tsx",
    preview: (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nome" placeholder="Como podemos te chamar?" required />
        <TextField label="Destino desejado" hint="Pode ser um país, cidade ou estilo." />
        <TextField label="E-mail" defaultValue="cliente@" error="Informe um e-mail válido." />
        <TextField label="Conte sua viagem" multiline placeholder="Datas, pessoas, sonhos…" />
      </div>
    ),
  },
  {
    key: "LiquidGlassSurface",
    name: "LiquidGlassSurface",
    description:
      "Vidro líquido com refração real em WebGL2; usa vidro em CSS como reserva sem WebGL2.",
    source: "src/shared/ui/LiquidGlass/LiquidGlassSurface.tsx",
    preview: (
      <div className="relative overflow-hidden rounded-2xl bg-[url('/assets/destinations/patagonia.webp')] bg-cover bg-center p-8">
        <LiquidGlassSurface className="mx-auto flex max-w-sm items-center justify-between gap-4 rounded-full px-5 py-3 text-sm font-semibold text-white">
          <span className="font-heading text-base">CADIFE Tour</span>
          <span className="text-white/80">Destinos · Contato</span>
        </LiquidGlassSurface>
      </div>
    ),
  },
  {
    key: "PassportStamp",
    name: "PassportStamp",
    description: "Carimbo de passaporte decorativo com tinta gasta, redondo ou retangular.",
    source: "src/shared/ui/travel/PassportStamp.tsx",
    preview: (
      <div className="flex flex-wrap items-center gap-6">
        <PassportStamp label="CADIFE TOUR" title="CHILE" caption="VISTO · 2026" />
        <PassportStamp
          label="CADIFE TOUR"
          title="SEGURO"
          caption="APROVADO"
          tone="blue"
          rotate={8}
        />
        <PassportStamp
          label="CADIFE"
          title="★ 5.0"
          caption="AVALIAÇÃO"
          tone="gold"
          shape="rect"
          rotate={-6}
        />
        <PassportStamp label="CADIFE TOUR" title="NATUREZA" tone="green" rotate={4} size={96} />
      </div>
    ),
  },
  {
    key: "PostageStamp",
    name: "PostageStamp",
    description: "Moldura de selo postal com picote em papel de passaporte, para fotos de destino.",
    source: "src/shared/ui/travel/PostageStamp.tsx",
    preview: (
      <div className="flex flex-wrap gap-6">
        <PostageStamp denomination="CDF 01" className="w-48 -rotate-2">
          <div className="aspect-[4/3] bg-[url('/assets/destinations/europa.webp')] bg-cover bg-center" />
        </PostageStamp>
        <PostageStamp denomination="CDF 02" className="w-48 rotate-1">
          <div className="aspect-[4/3] bg-[url('/assets/destinations/patagonia.webp')] bg-cover bg-center" />
        </PostageStamp>
      </div>
    ),
  },
  {
    key: "BoardingPass",
    name: "BoardingPass",
    description: "Cartão de embarque com recortes e canhoto picotado; vertical ou horizontal.",
    source: "src/shared/ui/travel/BoardingPass.tsx",
    preview: (
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <BoardingPass
          heading="Embarque"
          code="Etapa 01"
          stub={
            <div className="flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-foreground-subtle">
              <span>
                Portão
                <span className="mt-1 block font-heading text-lg normal-case tracking-normal text-foreground">
                  A1
                </span>
              </span>
              <Barcode className="h-8 w-14 shrink-0" />
            </div>
          }
        >
          <p className="font-heading text-xl">Conversa inicial</p>
          <p className="mt-2 text-sm text-foreground-muted">Entendemos seu estilo de viagem.</p>
        </BoardingPass>
        <BoardingPass
          orientation="horizontal"
          heading="Cartão de embarque"
          code="CDF · 2026"
          stub={<Barcode />}
        >
          <p className="font-heading text-2xl">Pronto para embarcar?</p>
          <p className="mt-2 text-sm text-foreground-muted">
            No desktop o canhoto fica à direita; no celular, embaixo.
          </p>
        </BoardingPass>
      </div>
    ),
  },
  {
    key: "TravelEyebrow",
    name: "TravelEyebrow",
    description: "Sobretítulo de seção desenhado como rota de voo.",
    source: "src/shared/ui/travel/TravelEyebrow.tsx",
    preview: (
      <div className="grid gap-4">
        <TravelEyebrow>Curadoria de experiências</TravelEyebrow>
        <h4 className="font-heading text-3xl">Roteiros e destinos planejados</h4>
      </div>
    ),
  },
];
