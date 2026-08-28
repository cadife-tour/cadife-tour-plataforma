import type {
  DestinationItem,
  AgencyValueItem,
  HowItWorksStep,
  TestimonialItem,
  FaqItem,
  ContactInfo,
} from "./types";

/**
 * Informações Institucionais e de Contato
 * (Campos ainda não homologados formalmente usam flags pendentes)
 */
const configuredPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();

export const contactInfo: ContactInfo = {
  whatsappNumber: configuredPhone || undefined,
  isWhatsappNumberPending: !configuredPhone,
  email: "contato@cadifetour.com.br",
  address: "Atendimento Consultivo Online e Presencial (Sob agendamento)",
  cadasturNumber: undefined,
  isCadasturPending: true, // [Pendente de confirmação do registro oficial pela CADIFE]
  googleReviewsUrl: "https://maps.google.com",
};

/**
 * Categorias e Destinos Emblemáticos
 */
export const destinationsData: DestinationItem[] = [
  {
    id: "dest-europa",
    slug: "europa-classica",
    category: "culture",
    title: {
      pt: "Europa Clássica & Cidades Históricas",
      en: "Classic Europe & Historic Cities",
      es: "Europa Clásica y Ciudades Históricas",
    },
    subtitle: {
      pt: "França, Itália, Espanha e Portugal com curadoria exclusiva",
      en: "France, Italy, Spain and Portugal with exclusive curation",
      es: "Francia, Italia, España y Portugal con curaduría exclusiva",
    },
    description: {
      pt: "Roteiros planejados com traslados privativos, hospedagens selecionadas e suporte de concierge durante toda a estadia.",
      en: "Tailored itineraries with private transfers, boutique hotels, and dedicated concierge support throughout your stay.",
      es: "Itinerarios personalizados con traslados privados, hoteles boutique y soporte de conserjería durante toda la estadía.",
    },
    highlights: {
      pt: [
        "Curadoria de hotéis com localização estratégica",
        "Passeios culturais com guias credenciados",
        "Suporte em tempo real para reservas e imprevistos",
      ],
      en: [
        "Strategically located boutique accommodation",
        "Cultural excursions with certified local guides",
        "Real-time concierge assistance for reservations",
      ],
      es: [
        "Hoteles seleccionados en ubicaciones estratégicas",
        "Paseos culturales con guías certificados",
        "Asistencia en tiempo real para reservas",
      ],
    },
    imageRef: "/assets/destinations/europa.webp",
    whatsappContextId: "europa_classica",
    isCommercialDetailsPending: false,
  },
  {
    id: "dest-patagonia",
    slug: "natureza-patagonia-mendoza",
    category: "nature",
    title: {
      pt: "Ecoturismo & Paisagens Naturais",
      en: "Ecotourism & Natural Landscapes",
      es: "Ecoturismo y Paisajes Naturales",
    },
    subtitle: {
      pt: "Patagônia, Mendoza e experiências imersivas na natureza",
      en: "Patagonia, Mendoza, and immersive wilderness experiences",
      es: "Patagonia, Mendoza y experiencias inmersivas en la naturaleza",
    },
    description: {
      pt: "Conecte-se com paisagens exuberantes, vinhedos renomados e trilhas guiadas, tudo com logística segura e suporte integral.",
      en: "Connect with majestic scenery, renowned vineyards, and guided hikes, all backed by seamless logistics and support.",
      es: "Conéctese con paisajes majestuosos, viñedos de renombre y excursiones guiadas con logística y soporte integral.",
    },
    highlights: {
      pt: [
        "Degustações exclusivas em vinhedos de Mendoza",
        "Navegações pelos glaciares da Patagônia",
        "Assessoria completa de vestuário e clima",
      ],
      en: [
        "Private tastings at world-class vineyards",
        "Glacier boat expeditions in Patagonia",
        "Pre-trip advisory for gear and weather",
      ],
      es: [
        "Degustaciones privadas en viñedos seleccionados",
        "Navegación por los glaciares de la Patagonia",
        "Asesoría completa de indumentaria y clima",
      ],
    },
    imageRef: "/assets/destinations/patagonia.webp",
    whatsappContextId: "patagonia_mendoza",
    isCommercialDetailsPending: false,
  },
  {
    id: "dest-cruzeiros",
    slug: "cruzeiros-e-resorts",
    category: "cruise",
    title: {
      pt: "Cruzeiros Marítimos & Resorts All-Inclusive",
      en: "Ocean Cruises & All-Inclusive Resorts",
      es: "Cruceros Marítimos y Resorts All-Inclusive",
    },
    subtitle: {
      pt: "O melhor do litoral e alto mar para viajar em família",
      en: "The best of coasts and ocean journeys for family leisure",
      es: "Lo melhor del litoral y alta mar para viajar en familia",
    },
    description: {
      pt: "Conforto total, gastronomia internacional e entretenimento completo para você relaxar sem se preocupar com detalhes operacionais.",
      en: "Maximum comfort, international cuisine, and world-class entertainment with zero stress over logistics.",
      es: "Máximo confort, gastronomía internacional y entretenimiento para relajarse sin preocupaciones logísticas.",
    },
    highlights: {
      pt: [
        "Seleção das melhores cabines e categorias de navios",
        "Roteiros com paradas estratégicas em ilhas e praias",
        "Pacotes com todas as refeições e taxas inclusas",
      ],
      en: [
        "Handpicked staterooms and ship classes",
        "Itineraries with pristine island ports",
        "All-inclusive dining and port fees included",
      ],
      es: [
        "Selección de las mejores cabinas y categorías de barcos",
        "Itinerarios con paradas estratégicas en islas y playas",
        "Paquetes con todas las comidas e impuestos incluidos",
      ],
    },
    imageRef: "/assets/destinations/cruzeiros.webp",
    whatsappContextId: "cruzeiros_resorts",
    isCommercialDetailsPending: false,
  },
];

/**
 * Como Funciona a Consultoria (4 Passos de Redução de Insegurança)
 */
export const howItWorksSteps: HowItWorksStep[] = [
  {
    stepNumber: 1,
    title: {
      pt: "1. Conversa Inicial & Perfil",
      en: "1. Initial Consultation & Style",
      es: "1. Charla Inicial y Perfil",
    },
    description: {
      pt: "Entendemos seu estilo de viagem, datas desejadas, orçamento e preferências de hospedagem.",
      en: "We assess your travel preferences, desired dates, budget, and accommodation expectations.",
      es: "Entendemos sus preferencias, fechas estimadas, presupuesto y tipo de hospedaje.",
    },
  },
  {
    stepNumber: 2,
    title: {
      pt: "2. Proposta de Roteiro Sob Medida",
      en: "2. Tailored Itinerary Proposal",
      es: "2. Propuesta de Itinerario a Medida",
    },
    description: {
      pt: "Nossos consultores desenham o itinerário dia a dia com opções de voos, hotéis e passeios.",
      en: "Our consultants design a day-by-day plan with optimal flight, hotel, and activity options.",
      es: "Nuestros consultores diseñan el plan diario con las mejores opciones de vuelos y hoteles.",
    },
  },
  {
    stepNumber: 3,
    title: {
      pt: "3. Reserva & Emissão Segura",
      en: "3. Secure Booking & Ticketing",
      es: "3. Reserva y Emisión Segura",
    },
    description: {
      pt: "Cuidamos de todas as emissões, vouchers, seguro viagem e documentação necessária.",
      en: "We handle all ticketing, vouchers, travel insurance, and documentation requirements.",
      es: "Gestionamos todas las emisiones, vouchers, seguro de viaje y requisitos de visado.",
    },
  },
  {
    stepNumber: 4,
    title: {
      pt: "4. Suporte Humano na Viagem",
      en: "4. Dedicated In-Trip Support",
      es: "4. Asistencia Humana en Destino",
    },
    description: {
      pt: "Canal direto no WhatsApp do embarque ao retorno para resolver imprevistos e dúvidas.",
      en: "Direct WhatsApp communication from takeoff to return to assist with any unexpected needs.",
      es: "Canal directo de WhatsApp desde el despegue hasta el regreso para cualquier imprevisto.",
    },
  },
];

/**
 * Diferenciais e Valores Institucionais
 */
export const agencyValues: AgencyValueItem[] = [
  {
    title: {
      pt: "Atendimento Humanizado",
      en: "Human & Personalized Touch",
      es: "Atención Humana y Personalizada",
    },
    description: {
      pt: "Você fala diretamente com especialistas em turismo que conhecem os destinos, sem respostas robóticas.",
      en: "Connect with real destination specialists who know the ground, without generic chatbot loops.",
      es: "Comuníquese directamente con especialistas en turismo que conocen el destino real.",
    },
  },
  {
    title: {
      pt: "Segurança & Conformidade",
      en: "Safety & Compliance",
      es: "Seguridad y Cumplimiento",
    },
    description: {
      pt: "Agência estabelecida com operação formal e parceiros hoteleiros e aéreos homologados internacionalmente.",
      en: "Legally registered agency partnering exclusively with vetted global airlines and hotel operators.",
      es: "Agencia registrada que trabaja exclusivamente con aerolíneas y hoteles certificados.",
    },
  },
  {
    title: {
      pt: "Roteiros Não Genéricos",
      en: "Truly Tailored Plans",
      es: "Itinerarios no Genéricos",
    },
    description: {
      pt: "Cada detalhe é ajustado ao seu ritmo — seja uma viagem em família, lua de mel ou expedição de aventura.",
      en: "Every element is shaped to your pace — whether a family journey, honeymoon, or expedition.",
      es: "Cada detalle adaptado a su ritmo — viaje familiar, luna de miel o expedición.",
    },
  },
];

/**
 * Avaliações e Prova Social (Aguardando homologação de links diretos pela CADIFE)
 */
export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    author: "Cliente CADIFE Tour",
    origin: "Viagem Europa em Família",
    text: {
      pt: "Excelente atendimento e planejamento do roteiro. Todo o suporte com traslados e hotéis foi impecável do início ao fim.",
      en: "Outstanding service and itinerary planning. Hotel bookings and transfers were seamless from start to finish.",
      es: "Excelente atención y planificación del itinerario. El soporte en traslados y hoteles fue impecable.",
    },
    rating: 5,
    source: "direct_client",
  },
  {
    id: "test-2",
    author: "Cliente CADIFE Tour",
    origin: "Ecoturismo & Vinhedos",
    text: {
      pt: "A consultoria entendeu exatamente o que queríamos em Mendoza. As vinícolas e passeios foram perfeitos.",
      en: "The team understood exactly what we wanted in Mendoza. The winery visits and tours were top notch.",
      es: "El equipo entendió exactamente lo que buscábamos en Mendoza. Las visitas a bodegas fueron perfectas.",
    },
    rating: 5,
    source: "direct_client",
  },
];

/**
 * Perguntas Frequentes (FAQ)
 */
export const faqData: FaqItem[] = [
  {
    question: {
      pt: "Como solicito uma cotação de viagem?",
      en: "How do I request a travel quote?",
      es: "¿Cómo solicito una cotización de viaje?",
    },
    answer: {
      pt: "Basta clicar em qualquer botão de WhatsApp nesta página. Um consultor atenderá você para entender suas datas, destino desejado e perfil de viagem.",
      en: "Simply click any WhatsApp button on this page. A travel advisor will connect with you to understand your dates, destination, and preferences.",
      es: "Simplemente haga clic en cualquier botón de WhatsApp en esta página. Un asesor le atenderá para conocer sus fechas y preferencias.",
    },
  },
  {
    question: {
      pt: "A CADIFE Tour emite passagens aéreas e seguro viagem?",
      en: "Does CADIFE Tour issue flight tickets and travel insurance?",
      es: "¿CADIFE Tour emite pasajes aéreos y seguro de viaje?",
    },
    answer: {
      pt: "Sim! Cuidamos da emissão completa de passagens nacionais e internacionais, seguro de saúde viagem obrigatório, traslados e hospedagens.",
      en: "Yes! We coordinate domestic and international airline tickets, mandatory travel medical insurance, transfers, and accommodations.",
      es: "¡Sí! Gestionamos pasajes aéreos nacionales e internacionales, seguro médico de viaje, traslados y alojamientos.",
    },
  },
  {
    question: {
      pt: "Quais formas de pagamento são aceitas?",
      en: "What payment methods are accepted?",
      es: "¿Qué métodos de pago se aceptan?",
    },
    answer: {
      pt: "Trabalhamos com cartões de crédito parcelados, PIX e transferências bancárias com faturamento formal e recibos fiscais para cada serviço.",
      en: "We offer credit card installments, bank transfers, and formal invoicing for every booked service.",
      es: "Aceptamos tarjetas de crédito en cuotas, transferencias bancarias y facturación formal para cada servicio.",
    },
  },
];
