import type { Locale } from "@/content/types";
import { contactInfo } from "@/content/data";

export interface WhatsAppUrlOptions {
  phoneNumber?: string;
  locale?: Locale;
  context?: "general" | "destination" | "quote" | "custom";
  destination?: string;
  destinationTitle?: string;
  source?: string;
  customMessage?: string;
}

const destinationSpecificMessages: Record<Locale, Record<string, string>> = {
  pt: {
    chile:
      "Olá! Estava conhecendo o Chile no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    cruzeiros:
      "Olá! Vi a opção de cruzeiros no site da CADIFE Tour e gostaria de saber mais sobre essa viagem.",
    argentina:
      "Olá! Estava conhecendo a Argentina no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    peru: "Olá! Estava conhecendo o Peru no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    portugal:
      "Olá! Estava conhecendo Portugal no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    espanha:
      "Olá! Estava conhecendo a Espanha no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    franca:
      "Olá! Estava conhecendo a França no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    italia:
      "Olá! Estava conhecendo a Itália no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    brasil:
      "Olá! Estava conhecendo os destinos no Brasil no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
    resort:
      "Olá! Estava conhecendo as opções de resorts no site da CADIFE Tour e gostaria de conversar sobre essa viagem.",
  },
  en: {
    chile:
      "Hello! I was exploring Chile on the CADIFE Tour website and would like to talk about this trip.",
    cruzeiros:
      "Hello! I saw the cruise options on the CADIFE Tour website and would like to know more.",
    argentina:
      "Hello! I was exploring Argentina on the CADIFE Tour website and would like to talk about this trip.",
    peru: "Hello! I was exploring Peru on the CADIFE Tour website and would like to talk about this trip.",
    portugal:
      "Hello! I was exploring Portugal on the CADIFE Tour website and would like to talk about this trip.",
    espanha:
      "Hello! I was exploring Spain on the CADIFE Tour website and would like to talk about this trip.",
    franca:
      "Hello! I was exploring France on the CADIFE Tour website and would like to talk about this trip.",
    italia:
      "Hello! I was exploring Italy on the CADIFE Tour website and would like to talk about this trip.",
    brasil:
      "Hello! I was exploring Brazil destinations on the CADIFE Tour website and would like to talk about this trip.",
    resort:
      "Hello! I was exploring the resort options on the CADIFE Tour website and would like to talk about this trip.",
  },
  es: {
    chile:
      "¡Hola! Estaba conociendo Chile en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    cruzeiros:
      "¡Hola! Vi la opción de cruceros en el sitio web de CADIFE Tour y me gustaría saber más.",
    argentina:
      "¡Hola! Estaba conociendo Argentina en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    peru: "¡Hola! Estaba conociendo Perú en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    portugal:
      "¡Hola! Estaba conociendo Portugal en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    espanha:
      "¡Hola! Estaba conociendo España en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    franca:
      "¡Hola! Estaba conociendo Francia en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    italia:
      "¡Hola! Estaba conociendo Italia en el sitio web de CADIFE Tour e me gustaría conversar sobre este viaje.",
    brasil:
      "¡Hola! Estaba conociendo los destinos de Brasil en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
    resort:
      "¡Hola! Estaba conociendo las opciones de resorts en el sitio web de CADIFE Tour y me gustaría conversar sobre este viaje.",
  },
};

const defaultMessages: Record<Locale, Record<string, string>> = {
  pt: {
    general: "Olá! Gostaria de conversar com um consultor da CADIFE Tour sobre uma viagem.",
    quote: "Olá! Gostaria de receber uma cotação personalizada de viagem.",
    destination:
      "Olá! Estava no site da CADIFE e gostaria de informações sobre a experiência em {destination}.",
  },
  en: {
    general: "Hello! I would like to speak with a CADIFE Tour travel consultant.",
    quote: "Hello! I would like to request a tailored travel proposal.",
    destination:
      "Hello! I saw the {destination} itinerary on your website and would love more details.",
  },
  es: {
    general: "¡Hola! Quisiera hablar con un asesor de viajes de CADIFE Tour.",
    quote: "¡Hola! Quisiera solicitar una cotización de viaje personalizada.",
    destination:
      "¡Hola! Vi el itinerario de {destination} en su sitio web y me gustaría recibir más información.",
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
  const {
    phoneNumber,
    locale = "pt",
    context = "general",
    destination,
    destinationTitle,
    customMessage,
  } = options;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return "#contato";
  }

  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Validação estrita: requer pelo menos 10 dígitos e não pode ser sequência de zeros
  const isInvalidPlaceholder = /^0+$/.test(cleanPhone) || /^550+$/.test(cleanPhone);
  if (cleanPhone.length < 10 || isInvalidPlaceholder) {
    return "#contato";
  }

  if (customMessage) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
  }

  const destKey = destination?.toLowerCase().trim();
  if (destKey && destinationSpecificMessages[locale]?.[destKey]) {
    const specificMessage = destinationSpecificMessages[locale][destKey];
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(specificMessage)}`;
  }

  const localeMessages = defaultMessages[locale] ?? defaultMessages.pt;
  let message: string = localeMessages[context] ?? defaultMessages.pt.general ?? "Olá!";

  if (context === "destination" && destinationTitle) {
    message = message.replace("{destination}", destinationTitle);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export const DEFAULT_CADIFE_WHATSAPP = "5547996714510";

/**
 * Helper de alto nível que usa o número oficial da CADIFE Tour e convenções de tracking.
 */
export function createWhatsAppUrl(options: {
  destination?: string;
  destinationTitle?: string;
  source?: "hero" | "header" | "footer" | "card" | "floating" | string;
  locale?: Locale;
  customMessage?: string;
  phoneNumber?: string;
}): string {
  const phone = options.phoneNumber || contactInfo.whatsappNumber || DEFAULT_CADIFE_WHATSAPP;
  const context = options.destination || options.destinationTitle ? "destination" : "general";

  return buildWhatsAppUrl({
    phoneNumber: phone,
    locale: options.locale ?? "pt",
    context,
    destination: options.destination,
    destinationTitle: options.destinationTitle,
    source: options.source,
    customMessage: options.customMessage,
  });
}
