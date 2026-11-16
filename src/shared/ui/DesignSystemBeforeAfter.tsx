"use client";

import type { ReactNode } from "react";
import styles from "@/shared/ui/before-after.module.css";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button/Button";
import { Card } from "@/shared/ui/Card/Card";
import { TextField } from "@/shared/ui/TextField/TextField";
import { LiquidGlassSurface } from "@/shared/ui/LiquidGlass/LiquidGlassSurface";
import { PassportStamp } from "@/shared/ui/travel/PassportStamp";
import { PostageStamp } from "@/shared/ui/travel/PostageStamp";
import { BoardingPass, Barcode } from "@/shared/ui/travel/BoardingPass";
import { TravelEyebrow } from "@/shared/ui/travel/TravelEyebrow";

interface ComparisonProps {
  id: string;
  index: string;
  title: string;
  changes: string[];
  before: ReactNode;
  after: ReactNode;
  /** Fundo fotográfico nos dois painéis (para comparar vidro e sobreposições). */
  photo?: boolean;
  /** Empilha os painéis em largura total (peças largas, como a navegação). */
  stacked?: boolean;
}

function Comparison({ id, index, title, changes, before, after, photo, stacked }: ComparisonProps) {
  return (
    <section className={styles.row} aria-labelledby={`${id}-title`}>
      <div className={styles.rowHeading}>
        <p className={styles.rowIndex}>{index}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <ul className={styles.changes}>
          {changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
      </div>
      <div className={styles.panes} data-stacked={stacked || undefined}>
        <figure className={`${styles.pane} ${styles.legacy}`} data-photo={photo || undefined}>
          <figcaption className={styles.paneLabel}>Antes · v1</figcaption>
          <div className={styles.paneBody}>{before}</div>
        </figure>
        <figure className={styles.pane} data-photo={photo || undefined}>
          <figcaption className={`${styles.paneLabel} ${styles.paneLabelAfter}`}>
            Depois · v2
          </figcaption>
          <div className={styles.paneBody}>{after}</div>
        </figure>
      </div>
    </section>
  );
}

const legacyImage = "/assets/destinations/patagonia.webp";

export function DesignSystemBeforeAfter() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>CADIFE TOUR / DESIGN SYSTEM</p>
        <h1>Antes e depois</h1>
        <p className={styles.lede}>
          A mesma interface, peça por peça: à esquerda o sistema original, à direita a proposta v2
          com identidade de viagem, Liquid Glass e tipografia da marca.
        </p>
        <a className={styles.back} href="/design-system">
          ← Voltar à biblioteca
        </a>
      </header>

      <Comparison
        id="type"
        index="01"
        title="Tipografia e títulos de seção"
        changes={[
          "Fonte do sistema → Fraunces (títulos) + Manrope (textos)",
          "Sobretítulo vira rota de voo",
          "Escala maior e peso mais elegante",
        ]}
        before={
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
              Curadoria de Experiências
            </span>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              Roteiros e Destinos Planejados
            </h3>
            <p className="mt-4 text-base text-foreground-muted">
              Do charme histórico da Europa à imponência dos glaciares.
            </p>
          </div>
        }
        after={
          <div>
            <TravelEyebrow>Curadoria de Experiências</TravelEyebrow>
            <h3 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              Roteiros e Destinos Planejados
            </h3>
            <p className="mt-4 text-base text-foreground-muted">
              Do charme histórico da Europa à imponência dos glaciares.
            </p>
          </div>
        }
      />

      <Comparison
        id="nav"
        index="02"
        title="Navegação"
        photo
        stacked
        changes={[
          "Barra sólida colada no topo → pílula flutuante de Liquid Glass",
          "Refração real em WebGL2 (Chrome, Safari e Firefox)",
          "CTA com brilho da marca",
        ]}
        before={
          <div className="flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#393532]/95 px-4 shadow-md">
            <span className="whitespace-nowrap text-lg font-bold text-white">
              CADIFE <span className="text-brand-primary">Tour</span>
            </span>
            <span className="hidden text-sm text-white/85 sm:inline">Destinos · Contato</span>
            <span className="whitespace-nowrap rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white">
              Falar com Consultor
            </span>
          </div>
        }
        after={
          <LiquidGlassSurface className="flex h-14 items-center justify-between gap-3 rounded-full pl-5 pr-2">
            <span className="whitespace-nowrap font-heading text-lg font-bold text-white">
              CADIFE <span className="text-brand-primary">Tour</span>
            </span>
            <span className="hidden text-sm font-semibold text-white/85 sm:inline">
              Destinos · Contato
            </span>
            <span className="whitespace-nowrap rounded-full bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-glow">
              Falar com Consultor
            </span>
          </LiquidGlassSurface>
        }
      />

      <Comparison
        id="card"
        index="03"
        title="Card de destino"
        changes={[
          "Foto vira selo postal picotado",
          "Carimbo de passaporte por categoria",
          "Badge oficial no lugar do selinho feito à mão",
        ]}
        before={
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div
              className="aspect-video w-full rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${legacyImage})` }}
            />
            <span className="mt-4 inline-block rounded bg-surface-muted px-2.5 py-1 text-xs font-semibold text-brand-accent">
              NATURE
            </span>
            <h3 className="mt-3 text-xl font-bold text-foreground">Ecoturismo & Paisagens</h3>
            <p className="mt-1 text-xs font-medium text-brand-gold">Patagônia e Mendoza</p>
          </article>
        }
        after={
          <Card as="article" padding="sm" className="p-5">
            <div className="relative">
              <PostageStamp denomination="CDF 02" className="-rotate-1">
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${legacyImage})` }}
                />
              </PostageStamp>
              <PassportStamp
                label="CADIFE TOUR"
                title="NATUREZA"
                caption="VISTO · 2026"
                tone="green"
                size={92}
                className="absolute -right-3 -top-5"
              />
            </div>
            <Badge className="mt-5">Natureza</Badge>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Ecoturismo & Paisagens</h3>
            <p className="mt-1 text-xs font-medium text-brand-gold">Patagônia e Mendoza</p>
          </Card>
        }
      />

      <Comparison
        id="steps"
        index="04"
        title="Etapas do atendimento"
        changes={[
          "Card genérico → cartão de embarque com canhoto",
          "Número em destaque com gradiente pôr do sol",
          "Portão, assento e código de barras contam a jornada",
        ]}
        before={
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/15 text-base font-bold text-brand-accent">
              1
            </div>
            <h3 className="text-lg font-bold text-foreground">1. Conversa Inicial & Perfil</h3>
            <p className="mt-2 text-sm text-foreground-muted">
              Entendemos seu estilo de viagem e preferências.
            </p>
          </div>
        }
        after={
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
            <span
              aria-hidden="true"
              className="block bg-sunset bg-clip-text font-heading text-5xl font-semibold leading-none text-transparent"
            >
              01
            </span>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              1. Conversa Inicial & Perfil
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              Entendemos seu estilo de viagem e preferências.
            </p>
          </BoardingPass>
        }
      />

      <Comparison
        id="controls"
        index="05"
        title="Botões e formulários"
        changes={[
          "Botão grande corrigido (h-13 não existia e achatava o botão)",
          "Estado de carregamento acessível",
          "Campo de texto com rótulo, dica e erro — antes não existia",
        ]}
        before={
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="h-13 inline-flex items-center justify-center rounded-md bg-brand-primary px-7 text-base font-medium text-foreground"
              >
                Large size
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground"
              >
                Outline
              </button>
            </div>
            <p className={styles.missing}>Sem componente de campo de texto.</p>
          </div>
        }
        after={
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">Large size</Button>
              <Button variant="outline">Outline</Button>
              <Button loading>Enviando</Button>
            </div>
            <TextField label="Destino desejado" hint="Pode ser um país, cidade ou estilo." />
          </div>
        }
      />

      <Comparison
        id="depth"
        index="06"
        title="Cores e profundidade"
        changes={[
          "Sombras pretas → sombras quentes de grafite",
          "Brilho vermelho para ações principais",
          "Um vermelho só → escala completa + gradiente assinatura",
        ]}
        before={
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                "0 1px 2px 0 rgba(0,0,0,0.3)",
                "0 4px 6px -1px rgba(0,0,0,0.4)",
                "0 10px 15px -3px rgba(0,0,0,0.5)",
              ].map((shadow) => (
                <div
                  key={shadow}
                  className="h-16 rounded-lg bg-surface-elevated"
                  style={{ boxShadow: shadow }}
                />
              ))}
            </div>
            <div className="flex h-10 overflow-hidden rounded-lg">
              <span className="flex-1 bg-[#dd0b0e]" />
              <span className="flex-1 bg-[#b8090b]" />
              <span className="flex-1 bg-[#f0282b]" />
            </div>
          </div>
        }
        after={
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-2xl bg-surface-elevated shadow-md" />
              <div className="h-16 rounded-2xl bg-surface-elevated shadow-xl" />
              <div className="h-16 rounded-2xl bg-brand-primary shadow-glow" />
            </div>
            <div className="flex h-10 overflow-hidden rounded-xl">
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
                <span
                  key={step}
                  className="flex-1"
                  style={{ backgroundColor: `var(--color-red-${step})` }}
                />
              ))}
            </div>
            <div className="h-10 rounded-xl bg-sunset" />
          </div>
        }
      />
    </div>
  );
}
