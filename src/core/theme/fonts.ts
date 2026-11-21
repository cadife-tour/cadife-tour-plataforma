import { Poppins, Roboto } from "next/font/google";

/** Fonte principal da interface e dos títulos. */
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
});

/**
 * Reserva da marca: só é baixada se a Roboto não puder ser usada
 * (o navegador ignora @font-face que não chega a desenhar nenhum texto).
 */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-poppins",
});

/** Classes que expõem as variáveis CSS das fontes no <html>. */
export const brandFontVariables = `${roboto.variable} ${poppins.variable}`;
