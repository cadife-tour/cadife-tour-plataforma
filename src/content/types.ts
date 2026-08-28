/**
 * CADIFE Tour — Content Domain Types & Schemas
 *
 * Princípio: Todo conteúdo é estritamente tipado.
 * Nenhum dado comercial inventado é permitido.
 */

export type Locale = "pt" | "en" | "es";

export interface DestinationItem {
  id: string;
  slug: string;
  category: "culture" | "nature" | "cruise" | "custom";
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  description: Record<Locale, string>;
  highlights: Record<Locale, string[]>;
  imageRef: string;
  /** Identificador de contexto para parametrização do WhatsApp */
  whatsappContextId: string;
  /** Marcação de integridade: indica se todos os dados comerciais foram homologados */
  isCommercialDetailsPending?: boolean;
}

export interface AgencyValueItem {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface TestimonialItem {
  id: string;
  author: string;
  origin?: string;
  text: Record<Locale, string>;
  rating: number; // 1 a 5
  source: "google_verified" | "direct_client" | "pending_verification";
  verificationUrl?: string;
}

export interface FaqItem {
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
}

export interface ContactInfo {
  whatsappNumber: string;
  email: string;
  address?: string;
  cadasturNumber?: string;
  isCadasturPending?: boolean;
  googleReviewsUrl?: string;
}
