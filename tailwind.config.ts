import type { Config } from "tailwindcss";

/**
 * Converte um token CSS em cor do Tailwind que aceita modificador de opacidade
 * (ex.: `bg-brand-dark/95`). Sem modificador, o resultado é a cor sólida original.
 */
const withAlpha = (token: string) =>
  `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withAlpha("--color-bg"),
        surface: {
          DEFAULT: withAlpha("--color-surface"),
          elevated: withAlpha("--color-surface-elevated"),
          muted: withAlpha("--color-surface-muted"),
        },
        foreground: {
          DEFAULT: withAlpha("--color-text"),
          muted: withAlpha("--color-text-muted"),
          subtle: withAlpha("--color-text-subtle"),
        },
        brand: {
          primary: withAlpha("--color-brand-primary"),
          secondary: withAlpha("--color-brand-secondary"),
          accent: withAlpha("--color-brand-accent"),
          dark: withAlpha("--color-brand-dark"),
          gold: withAlpha("--color-brand-gold"),
        },
        border: withAlpha("--color-border"),
        focus: withAlpha("--color-focus"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        expressive: "var(--ease-expressive)",
      },
    },
  },
  plugins: [],
};

export default config;
