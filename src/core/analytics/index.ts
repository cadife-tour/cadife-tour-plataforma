export type AnalyticsEventName =
  | "whatsapp_conversion"
  | "destination_view"
  | "language_change"
  | "external_link_click";

export interface AnalyticsEventParams {
  event: AnalyticsEventName;
  destination?: string;
  cta_location?: "hero" | "destination_card" | "how_it_works" | "testimonials" | "faq" | "footer" | "floating";
  locale?: string;
  label?: string;
  [key: string]: unknown;
}

/**
 * Fachada Agnóstica de Telemetria (Privacy-First)
 *
 * Registra eventos de conversão e produto sem travar a navegação do usuário.
 * No MVP, opera de forma local / console, pronta para plugar Plausible, Umami ou GA4.
 */
export function trackEvent(params: AnalyticsEventParams): void {
  try {
    if (typeof window !== "undefined") {
      // 1. Telemetria local de desenvolvimento
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.info("[Analytics Event]", params);
      }

      // 2. Integração com provedor Plausible (se injetado no window)
      const win = window as unknown as { plausible?: (event: string, options?: { props: Record<string, unknown> }) => void };
      if (typeof win.plausible === "function") {
        const { event, ...props } = params;
        win.plausible(event, { props });
      }

      // 3. Integração com Google Analytics / gtag (se injetado)
      const winGtag = window as unknown as { gtag?: (type: string, name: string, options: Record<string, unknown>) => void };
      if (typeof winGtag.gtag === "function") {
        const { event, ...props } = params;
        winGtag.gtag("event", event, props);
      }
    }
  } catch (error) {
    // Falha silenciosa para garantir que nunca impacte a experiência do usuário
    // eslint-disable-next-line no-console
    console.error("[Analytics Error]", error);
  }
}
