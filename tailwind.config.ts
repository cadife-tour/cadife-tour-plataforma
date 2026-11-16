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
        cadife: {
          50: withAlpha("--color-red-50"),
          100: withAlpha("--color-red-100"),
          200: withAlpha("--color-red-200"),
          300: withAlpha("--color-red-300"),
          400: withAlpha("--color-red-400"),
          500: withAlpha("--color-red-500"),
          600: withAlpha("--color-red-600"),
          700: withAlpha("--color-red-700"),
          800: withAlpha("--color-red-800"),
          900: withAlpha("--color-red-900"),
        },
        paper: {
          DEFAULT: withAlpha("--color-paper"),
          shade: withAlpha("--color-paper-shade"),
        },
        ink: {
          red: withAlpha("--color-ink-red"),
          blue: withAlpha("--color-ink-blue"),
          green: withAlpha("--color-ink-green"),
          gold: withAlpha("--color-ink-gold"),
        },
        border: withAlpha("--color-border"),
        focus: withAlpha("--color-focus"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
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
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        sunset: "var(--gradient-sunset)",
        dusk: "var(--gradient-dusk)",
        "scrim-strong": "var(--overlay-scrim-strong)",
        "scrim-bottom": "var(--overlay-scrim-bottom)",
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
