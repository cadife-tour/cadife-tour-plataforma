"use client";

import { sharedUiCatalog } from "@/shared/ui/catalog";
import styles from "@/shared/ui/design-system.module.css";

const colors = [
  ["Background", "--color-bg"],
  ["Surface", "--color-surface"],
  ["Surface elevated", "--color-surface-elevated"],
  ["Surface muted", "--color-surface-muted"],
  ["Text", "--color-text"],
  ["Text muted", "--color-text-muted"],
  ["Text subtle", "--color-text-subtle"],
  ["Brand primary", "--color-brand-primary"],
  ["Brand secondary", "--color-brand-secondary"],
  ["Brand accent", "--color-brand-accent"],
  ["Brand dark", "--color-brand-dark"],
  ["Brand gold", "--color-brand-gold"],
  ["Border", "--color-border"],
  ["Border hover", "--color-border-hover"],
  ["Focus", "--color-focus"],
  ["Success", "--color-success"],
  ["Warning", "--color-warning"],
  ["Error", "--color-error"],
] as const;

const typeScale = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
const radii = ["sm", "md", "lg", "xl", "full"] as const;
const shadows = ["sm", "md", "lg", "xl"] as const;
const spacingScale = [
  ["space-1", "0.25rem", "w-1"],
  ["space-2", "0.5rem", "w-2"],
  ["space-3", "0.75rem", "w-3"],
  ["space-4", "1rem", "w-4"],
  ["space-6", "1.5rem", "w-6"],
  ["space-8", "2rem", "w-8"],
] as const;
const breakpoints = [
  ["sm", "640px"],
  ["md", "768px"],
  ["lg", "1024px"],
  ["xl", "1280px"],
  ["2xl", "1536px"],
] as const;

export function DesignSystemLibrary() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>CADIFE TOUR / REFERÊNCIA DE INTERFACE</p>
        <h1>Design system</h1>
        <p className={styles.lede}>
          Tokens e componentes compartilhados, apresentados com seus estados reais e caminhos de
          origem.
        </p>
      </header>

      <nav className={styles.navigation} aria-label="Navegação da biblioteca">
        <a href="#tokens">Tokens</a>
        <a href="#components">Componentes</a>
      </nav>

      <section id="tokens" className={styles.section} aria-labelledby="tokens-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / FOUNDATIONS</p>
          <h2 id="tokens-title">Tokens visuais</h2>
          <p>
            Os valores são consumidos diretamente de <code>src/core/theme/tokens.css</code>.
          </p>
        </div>

        <div className={styles.tokenGroup}>
          <h3>Cores</h3>
          <div className={styles.colorGrid}>
            {colors.map(([name, token]) => (
              <div className={styles.colorToken} key={token}>
                <span className={styles.swatch} style={{ backgroundColor: `var(${token})` }} />
                <span>{name}</span>
                <code>{`var(${token})`}</code>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tokenColumns}>
          <div className={styles.tokenGroup}>
            <h3>Tipografia</h3>
            <p className={styles.tokenHint}>
              Interface: <code>var(--font-sans)</code> · Títulos: <code>var(--font-heading)</code>
            </p>
            <div className={styles.typeList}>
              {typeScale.map((size) => (
                <div className={styles.typeToken} key={size}>
                  <code>{`--text-${size}`}</code>
                  <span style={{ fontSize: `var(--text-${size})` }}>Uma nova memória</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tokenGroup}>
            <h3>Raios</h3>
            <div className={styles.radiusGrid}>
              {radii.map((radius) => (
                <div className={styles.radiusToken} key={radius}>
                  <span style={{ borderRadius: `var(--radius-${radius})` }} />
                  <code>{`--radius-${radius}`}</code>
                </div>
              ))}
            </div>
            <h3 className={styles.subheading}>Sombras</h3>
            <div className={styles.shadowGrid}>
              {shadows.map((shadow) => (
                <div
                  className={styles.shadowToken}
                  key={shadow}
                  style={{ boxShadow: `var(--shadow-${shadow})` }}
                >
                  <code>{`--shadow-${shadow}`}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.tokenGroup}>
          <h3>Motion</h3>
          <div className={styles.motionGrid}>
            <button type="button" className={`${styles.motionSample} ${styles.motionFast}`}>
              <code>--duration-fast · 150ms</code>
              <span>Hover ou foque para experimentar</span>
            </button>
            <button type="button" className={`${styles.motionSample} ${styles.motionNormal}`}>
              <code>--duration-normal · 250ms</code>
              <span>Hover ou foque para experimentar</span>
            </button>
            <button type="button" className={`${styles.motionSample} ${styles.motionSlow}`}>
              <code>--duration-slow · 400ms</code>
              <span>Hover ou foque para experimentar</span>
            </button>
          </div>
          <p className={styles.tokenHint}>
            A regra global <code>prefers-reduced-motion</code> reduz animações e transições não
            essenciais.
          </p>
        </div>

        <div className={styles.tokenGroup}>
          <h3>Espaçamento e breakpoints</h3>
          <p className={styles.tokenHint}>
            Escala e breakpoints padrão do Tailwind CSS, usados como referências de layout.
          </p>
          <div className={styles.layoutColumns}>
            <div>
              <h4>Espaçamento</h4>
              <div className={styles.spacingList}>
                {spacingScale.map(([name, value, width]) => (
                  <div className={styles.spacingToken} key={name}>
                    <code>{`${name} · ${value}`}</code>
                    <span className={styles.spacingTrack}>
                      <span className={`${styles.spacingBar} ${width}`} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4>Breakpoints</h4>
              <div className={styles.breakpointList}>
                {breakpoints.map(([name, value]) => (
                  <div className={styles.breakpointToken} key={name}>
                    <code>{`${name} · ${value}`}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="components" className={styles.section} aria-labelledby="components-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / SHARED UI</p>
          <h2 id="components-title">Componentes</h2>
          <p>
            Cada exemplo usa o componente real. Consulte o nome e o arquivo de origem para ver o
            contrato completo.
          </p>
        </div>

        <div className={styles.componentGrid}>
          {sharedUiCatalog.map((entry) => (
            <section
              className={styles.componentCard}
              key={entry.key}
              aria-labelledby={`component-${entry.key}`}
              aria-label={`${entry.name} preview`}
            >
              <div className={styles.componentHeading}>
                <div>
                  <p className={styles.componentCategory}>SHARED COMPONENT</p>
                  <h3 id={`component-${entry.key}`}>{entry.name}</h3>
                  <p>{entry.description}</p>
                </div>
                <code>{entry.key}</code>
              </div>
              <div className={styles.preview}>{entry.preview}</div>
              <p className={styles.source}>
                Origem <code>{entry.source}</code>
              </p>
            </section>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        Referência para desenvolvimento · Tokens definidos em <code>src/core/theme/tokens.css</code>
      </footer>
    </div>
  );
}
