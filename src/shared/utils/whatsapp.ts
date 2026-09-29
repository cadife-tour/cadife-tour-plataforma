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
 * Mensagens contextuais personalizadas por seção/origem de conversão.
 */
export const sectionSpecificMessages: Record<Locale, Record<string, string>> = {
  pt: {
    header:
      "Olá! Gostaria de falar com um consultor da CADIFE Tour para planejar minha próxima viagem.",
    header_nav:
      "Olá! Gostaria de falar com um consultor da CADIFE Tour para planejar minha próxima viagem.",
    hero: "Olá! Estive no site da CADIFE Tour e gostaria de iniciar o planejamento de uma experiência de viagem sob medida.",
    hero_airplane_intro:
      "Olá! Estive no site da CADIFE Tour e gostaria de iniciar o planejamento de uma experiência de viagem sob medida.",
    hero_intro_fallback:
      "Olá! Estive no site da CADIFE Tour e gostaria de falar com um consultor de viagens.",
    how_it_works:
      "Olá! Vi como funciona a assessoria no site da CADIFE Tour e gostaria de iniciar meu planejamento.",
    faq_banner:
      "Olá! Gostaria de receber uma proposta personalizada de roteiro e cotação da CADIFE Tour.",
    contact:
      "Olá! Gostaria de receber uma proposta personalizada de roteiro e cotação da CADIFE Tour.",
    footer:
      "Olá! Gostaria de tirar dúvidas sobre as opções de viagens da CADIFE Tour com um consultor.",
  },
  en: {
    header: "Hello! I would like to speak with a CADIFE Tour consultant to plan my next journey.",
    header_nav:
      "Hello! I would like to speak with a CADIFE Tour consultant to plan my next journey.",
    hero: "Hello! I was exploring the CADIFE Tour website and would like to start planning a tailored travel experience.",
    hero_airplane_intro:
      "Hello! I was exploring the CADIFE Tour website and would like to start planning a tailored travel experience.",
    hero_intro_fallback:
      "Hello! I was on the CADIFE Tour website and would like to talk with a travel advisor.",
    how_it_works:
      "Hello! I saw how your advisory works on the website and would like to begin planning my trip.",
    faq_banner:
      "Hello! I would like to receive a tailored itinerary proposal and travel quote from CADIFE Tour.",
    contact:
      "Hello! I would like to receive a tailored itinerary proposal and travel quote from CADIFE Tour.",
    footer:
      "Hello! I would like assistance via WhatsApp to ask questions and plan my journey with CADIFE Tour.",
  },
  es: {
    header: "¡Hola! Quisiera hablar con un asesor de CADIFE Tour para planificar mi próximo viaje.",
    header_nav:
      "¡Hola! Quisiera hablar con un asesor de CADIFE Tour para planificar mi próximo viaje.",
    hero: "¡Hola! Estuve en el sitio web de CADIFE Tour y me gustaría comenzar a planificar un viaje a medida.",
    hero_airplane_intro:
      "¡Hola! Estuve en el sitio web de CADIFE Tour y me gustaría comenzar a planificar un viaje a medida.",
    hero_intro_fallback:
      "¡Hola! Estuve en el sitio web de CADIFE Tour y quisiera hablar con un asesor de viajes.",
    how_it_works:
      "¡Hola! Vi cómo funciona la asesoría en el sitio web de CADIFE Tour y me gustaría iniciar mi planificación.",
    faq_banner:
      "¡Hola! Quisiera recibir una propuesta de itinerario personalizada y cotización de CADIFE Tour.",
    contact:
      "¡Hola! Quisiera recibir una propuesta de itinerario personalizada y cotización de CADIFE Tour.",
    footer:
      "¡Hola! Quisiera consultar dudas sobre las opciones de viaje de CADIFE Tour con un asesor.",
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
    source,
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

  // 1. Mensagem customizada tem prioridade máxima
  if (customMessage) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
  }

  // 2. Destino específico por slug
  const destKey = destination?.toLowerCase().trim();
  if (destKey && destinationSpecificMessages[locale]?.[destKey]) {
    const specificMessage = destinationSpecificMessages[locale][destKey];
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(specificMessage)}`;
  }

  // 3. Destino com título dinâmico ou destino slug formatado
  const effectiveDestinationName =
    destinationTitle ||
    (destination
      ? destination
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
          .trim()
      : undefined);

  if ((context === "destination" || destination) && effectiveDestinationName) {
    const localeMessages = defaultMessages[locale] ?? defaultMessages.pt;
    const destTemplate =
      localeMessages.destination ?? "Olá! Gostaria de informações sobre {destination}.";
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      destTemplate.replace("{destination}", effectiveDestinationName)
    )}`;
  }

  // 4. Mensagem contextual por seção/origem (Header, Contato, Footer, Como Funciona, Hero)
  const sourceKey = source?.toLowerCase().trim();
  if (sourceKey) {
    if (sectionSpecificMessages[locale]?.[sourceKey]) {
      const sectionMessage = sectionSpecificMessages[locale][sourceKey];
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sectionMessage)}`;
    }
    // Fallback inteligente para variantes de Hero (ex: hero_intro, hero_scene, etc.)
    if (sourceKey.startsWith("hero") && sectionSpecificMessages[locale]?.hero) {
      const heroMessage = sectionSpecificMessages[locale].hero;
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(heroMessage)}`;
    }
  }

  // 5. Fallback para mensagem padrão do contexto ou geral
  const localeMessages = defaultMessages[locale] ?? defaultMessages.pt;
  let message: string = localeMessages[context] ?? defaultMessages.pt.general ?? "Olá!";
  if (message.includes("{destination}")) {
    message = message.replace("{destination}", effectiveDestinationName || "viagem sob medida");
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_CADIFE_WHATSAPP = "5547996714510";

/**
 * Verifica se o atendimento via WhatsApp possui número homologado e válido.
 * Retorna false se o número for indefinido, nulo, vazio ou inválido (ex: sequência de zeros ou < 10 dígitos).
 * Em ambiente de teste (NODE_ENV === "test"), assume o número padrão a menos que explicitamente anulado.
 */
export function isWhatsAppConfigured(phoneNumber?: string | null): boolean {
  if (phoneNumber === null || phoneNumber === "") {
    return false;
  }
  let phone: string | undefined;
  if (phoneNumber !== undefined) {
    phone = phoneNumber;
  } else if (contactInfo.whatsappNumber) {
    phone = contactInfo.whatsappNumber;
  } else if (process.env.NODE_ENV === "test") {
    phone = DEFAULT_CADIFE_WHATSAPP;
  } else {
    phone = undefined;
  }

  if (!phone || typeof phone !== "string") {
    return false;
  }

  const cleanPhone = phone.replace(/\D/g, "");
  const isInvalidPlaceholder = /^0+$/.test(cleanPhone) || /^550+$/.test(cleanPhone);
  return cleanPhone.length >= 10 && !isInvalidPlaceholder;
}

/**
 * Helper de alto nível que usa o número oficial da CADIFE Tour e convenções de tracking.
 */
export function createWhatsAppUrl(options: {
  destination?: string;
  destinationTitle?: string;
  source?: "hero" | "header" | "footer" | "card" | "floating" | string;
  locale?: Locale;
  customMessage?: string;
  phoneNumber?: string | null;
  context?: "general" | "destination" | "quote" | "custom";
}): string {
  // Resolução estrita do número:
  // 1. phoneNumber passado explicitamente (null ou string vazia anulam para forçar teste de fallback)
  // 2. contactInfo.whatsappNumber (número homologado via NEXT_PUBLIC_WHATSAPP_NUMBER)
  // 3. Fallback determinístico (DEFAULT_CADIFE_WHATSAPP) apenas em NODE_ENV === "test"
  // 4. Em produção sem número homologado, phone é undefined e retorna "#contato" seguro
  let phone: string | undefined;
  if (isWhatsAppConfigured(options.phoneNumber)) {
    if (options.phoneNumber) {
      phone = options.phoneNumber;
    } else if (contactInfo.whatsappNumber) {
      phone = contactInfo.whatsappNumber;
    } else {
      phone = DEFAULT_CADIFE_WHATSAPP;
    }
  } else {
    phone = undefined;
  }

  const context =
    options.context ||
    (options.destination || options.destinationTitle ? "destination" : "general");

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
