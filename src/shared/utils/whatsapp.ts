import type { Locale } from "@/content/types";

export interface WhatsAppUrlOptions {
  phoneNumber?: string;
  locale: Locale;
  context?: "general" | "destination" | "quote" | "custom";
  destinationTitle?: string;
}

const defaultMessages: Record<Locale, Record<string, string>> = {
  pt: {
    general: "Olá! Gostaria de conversar com um consultor da CADIFE Tour sobre uma viagem.",
    quote: "Olá! Gostaria de receber uma cotação personalizada de viagem.",
    destination: "Olá! Estava no site da CADIFE e gostaria de informações sobre a experiência em {destination}.",
  },
  en: {
    general: "Hello! I would like to speak with a CADIFE Tour travel consultant.",
    quote: "Hello! I would like to request a tailored travel proposal.",
    destination: "Hello! I saw the {destination} itinerary on your website and would love more details.",
  },
  es: {
    general: "¡Hola! Quisiera hablar con un asesor de viajes de CADIFE Tour.",
    quote: "¡Hola! Quisiera solicitar una cotización de viaje personalizada.",
    destination: "¡Hola! Vi el itinerario de {destination} en su sitio web y me gustaría recibir más información.",
  },
};

/**
 * Constrói deep links contextuais para o WhatsApp de forma segura e padronizada.
 *
 * Regras Estritas de Segurança e Integridade:
 * 1. Sanitiza pontuações e espaços.
 * 2. Valida tamanho mínimo real (código de país + DDD + número >= 10 dígitos).
 * 3. Rejeita placeholders inválidos (ex: "5500000000000" ou sequências de zeros).
 * 4. Se o número for ausente ou inválido, retorna link seguro "#contato" para não quebrar a UI
 *    e evitar links malformados como "https://wa.me/" ou "https://wa.me/undefined".
 */
export function buildWhatsAppUrl(options: WhatsAppUrlOptions): string {
  const { phoneNumber, locale, context = "general", destinationTitle } = options;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return "#contato";
  }

  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Validação estrita: requer pelo menos 10 dígitos e não pode ser sequência de zeros
  const isInvalidPlaceholder = /^0+$/.test(cleanPhone) || /^550+$/.test(cleanPhone);
  if (cleanPhone.length < 10 || isInvalidPlaceholder) {
    return "#contato";
  }

  const localeMessages = defaultMessages[locale] ?? defaultMessages.pt;
  let message: string = (localeMessages[context] ?? defaultMessages.pt.general) ?? "Olá!";

  if (context === "destination" && destinationTitle) {
    message = message.replace("{destination}", destinationTitle);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
