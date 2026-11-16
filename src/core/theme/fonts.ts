import { Fraunces, Manrope } from "next/font/google";

/**
 * Tipografia da marca.
 * - Fraunces: serifada editorial (títulos), com eixo óptico para soar como revista de viagem.
 * - Manrope: sans geométrica e calorosa para interface e textos longos.
 * As variáveis CSS alimentam `--font-heading` e `--font-sans` em tokens.css.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const brandFontVariables = `${fraunces.variable} ${manrope.variable}`;
