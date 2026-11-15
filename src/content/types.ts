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

export type SocialNetworkId = "instagram" | "facebook" | "tiktok" | "youtube";

export interface SocialLink {
  id: SocialNetworkId;
  name: string;
  url: string;
  handle: string;
}

export interface FiscalAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedLine1: string;
  formattedLine2: string;
  formattedFull: string;
}

export interface CadasturRegistration {
  number: string;
  providerName: string;
  activity: Record<Locale, string>;
  validFrom: string;
  validUntil: string;
  issuedAt: string;
  verificationUrl: string;
  isPending: boolean;
}

export interface LegalLinks {
  privacyPolicyUrl: string;
  cookiePreferencesUrl: string;
}

export interface InstitutionalInfo {
  brandName: string;
  foundedYear: number;
  cnpj: string;
  municipalRegistration: string;
  cadastur: CadasturRegistration;
  fiscalAddress: FiscalAddress;
  whatsapp: {
    raw: string;
    formatted: string;
  };
  email: string;
  socialLinks: SocialLink[];
  legalLinks: LegalLinks;
}

export interface ContactInfo {
  whatsappNumber?: string;
  whatsappDisplay?: string;
  isWhatsappNumberPending?: boolean;
  email: string;
  address?: string;
  cnpj?: string;
  municipalRegistration?: string;
  cadasturNumber?: string;
  cadasturVerificationUrl?: string;
  isCadasturPending?: boolean;
  googleReviewsUrl?: string;
}
