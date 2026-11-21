import { Roboto } from "next/font/google";

/** Tipografia do MVP: Roboto (fallback sans-serif em tokens.css via `--font-sans`). */
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
