import type { Locale } from "@/content/types";

/**
 * Contrato estrito e fechado de eventos de telemetria da CADIFE Tour.
 *
 * Princípios Invioláveis:
 * 1. Zero PII (Sem nomes, telefones, IPs ou mensagens pessoais).
 * 2. Tipagem estrita: impede eventos ou payloads arbitrários em compile-time.
 * 3. Privacy-First: responde "qual ação comercial ocorreu" e não "quem é o usuário".
 */
export type AnalyticsEventMap = {
  /** Evento central de negócio disparado em cliques de WhatsApp */
  whatsapp_conversion: {
    destination?: string;
    cta_location: string;
    locale: Locale;
  };

  /** Mede atenção visual a cards de destinos via IntersectionObserver */
  destination_viewed: {
    destination_id: string;
    locale: Locale;
  };

  /** Mede dúvidas e fricções abertas/fechadas no FAQ */
  faq_toggle: {
    question_id: string;
    locale: Locale;
    state: "opened" | "closed";
  };

  /** Mede alternância intencional de idioma pelo usuário */
  language_change: {
    from_locale: Locale;
    to_locale: Locale;
  };

  /** Mede consulta à prova social externa antes da tomada de decisão */
  google_reviews_clicked: {
    locale: Locale;
  };

  /** Telemetria técnica do status de inicialização/fallback da camada visual */
  webgl_status: {
    status:
      | "active"
      | "fallback_reduced_motion"
      | "fallback_save_data"
      | "fallback_no_webgl"
      | "fallback_error";
    dpr?: number;
    is_mobile?: boolean;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

/**
 * Fachada Central de Telemetria Privacy-First.
 *
 * Operação não-bloqueante, segura e desacoplada de provedores externos.
 */
export function trackEvent<K extends AnalyticsEventName>(
  event: K,
  payload: AnalyticsEventMap[K]
): void {
  try {
    if (typeof window !== "undefined") {
      // 1. Log seguro em desenvolvimento (nunca polui produção)
      if (process.env.NODE_ENV === "development") {
        console.info(`[Telemetry Event: ${event}]`, payload);
      }

      // 2. Adapter agnóstico para provedores privacy-first compatíveis (ex: Plausible)
      const win = window as unknown as {
        plausible?: (eventName: string, options?: { props: Record<string, unknown> }) => void;
      };
      if (typeof win.plausible === "function") {
        win.plausible(event, { props: payload as unknown as Record<string, unknown> });
      }

      // 3. Adapter agnóstico para gtag (se explicitamente injetado)
      const winGtag = window as unknown as {
        gtag?: (command: string, eventName: string, eventParams: Record<string, unknown>) => void;
      };
      if (typeof winGtag.gtag === "function") {
        winGtag.gtag("event", event, payload as unknown as Record<string, unknown>);
      }
    }
  } catch {
    // Falha silenciosa total para garantir que a navegação do usuário NUNCA seja interrompida
  }
}
