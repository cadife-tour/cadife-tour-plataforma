import { institutionalInfo } from "./data";
import type { Locale } from "./types";

export interface CookieCategorySummary {
  id: "necessary" | "preferences" | "analytics" | "marketing";
  title: string;
  description: string;
  defaultState: string;
  isEssential: boolean;
}

export interface CookieInventoryItem {
  name: string;
  provider: string;
  category: string;
  purpose: string;
  duration: string;
  origin: string;
}

export interface CookiePolicySection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CookiesPolicyLocaleContent {
  backToHome: string;
  badge: string;
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  intro: string[];
  statusBannerTitle: string;
  statusBannerDescription: string;
  privacyPolicyCta: string;
  categoriesHeading: string;
  inventoryHeading: string;
  inventoryNote: string;
  inventoryColumns: {
    name: string;
    provider: string;
    category: string;
    purpose: string;
    duration: string;
    origin: string;
  };
  categories: CookieCategorySummary[];
  inventory: CookieInventoryItem[];
  sections: CookiePolicySection[];
  contactHeading: string;
  contactLabels: {
    email: string;
    whatsapp: string;
    cnpj: string;
    location: string;
  };
}

export const cookiesPolicyContent: Record<Locale, CookiesPolicyLocaleContent> = {
  pt: {
    backToHome: "Voltar para a página inicial",
    badge: "Privacidade & Transparência",
    title: "Política de Cookies e Preferências de Cookies — CADIFE Tour",
    lastUpdatedLabel: "Última atualização:",
    lastUpdatedDate: "15 de novembro de 2026",
    intro: [
      "Esta Política explica como a CADIFE Tour utiliza cookies e tecnologias semelhantes em seu site e como o usuário pode controlar suas preferências.",
      "Ela complementa a Política de Privacidade da CADIFE Tour.",
    ],
    statusBannerTitle: "Estado atual das preferências neste site",
    statusBannerDescription:
      "Nesta etapa, o site da CADIFE Tour não utiliza cookies de publicidade ou rastreamento de terceiros para anúncios. Apenas o armazenamento essencial no navegador (preferência de idioma) permanece ativo para o funcionamento adequado da navegação. Os controles interativos completos de consentimento serão disponibilizados nesta central conforme a evolução da plataforma.",
    privacyPolicyCta: "Consultar Política de Privacidade completa",
    categoriesHeading: "Categorias de cookies e estado padrão",
    inventoryHeading: "Relação técnica de registros utilizados atualmente",
    inventoryNote:
      "Esta relação reflete apenas os registros efetivamente utilizados na versão atual da plataforma e é atualizada sempre que novas tecnologias ou provedores forem integrados.",
    inventoryColumns: {
      name: "Nome",
      provider: "Provedor",
      category: "Categoria",
      purpose: "Finalidade",
      duration: "Duração",
      origin: "Origem",
    },
    categories: [
      {
        id: "necessary",
        title: "3.1. Cookies estritamente necessários",
        description:
          "Indispensáveis para segurança, funcionamento técnico, manutenção de sessão, balanceamento de carga, registro das escolhas de privacidade e prevenção de uso indevido.",
        defaultState: "Sempre ativos",
        isEssential: true,
      },
      {
        id: "preferences",
        title: "3.2. Cookies de preferências e funcionalidade",
        description:
          "Permitem lembrar escolhas realizadas pelo usuário, como idioma, configurações de interface, preferências de navegação e funcionalidades opcionais.",
        defaultState: "Desativados até consentimento (quando aplicável)",
        isEssential: false,
      },
      {
        id: "analytics",
        title: "3.3. Cookies de análise e desempenho",
        description:
          "Utilizados para compreender páginas acessadas, duração da visita, origem do acesso, dispositivo, interações, erros e desempenho do site.",
        defaultState: "Desativados",
        isEssential: false,
      },
      {
        id: "marketing",
        title: "3.4. Cookies de publicidade e marketing",
        description:
          "Quando implementados, apoiam medição de campanhas, limitação de repetição de anúncios, criação de públicos e acompanhamento de plataformas de terceiros.",
        defaultState: "Desativados até consentimento",
        isEssential: false,
      },
    ],
    inventory: [
      {
        name: "cadife_locale",
        provider: institutionalInfo.brandName,
        category: "Preferência essencial de navegação",
        purpose: "Armazenar o idioma selecionado pelo usuário (PT, EN ou ES) no navegador.",
        duration: "Persistente até limpeza pelo navegador",
        origin: "Próprio (localStorage)",
      },
    ],
    sections: [
      {
        id: "o-que-sao-cookies",
        title: "1. O que são cookies",
        paragraphs: [
          "Cookies são pequenos arquivos ou registros armazenados no dispositivo do usuário quando determinados sites são acessados.",
          "Eles podem ser utilizados para diferentes finalidades, como permitir o funcionamento de funcionalidades essenciais, lembrar configurações, compreender como o site é utilizado e, mediante consentimento quando necessário, personalizar experiências ou apoiar ações de comunicação e marketing.",
          "Tecnologias semelhantes, como armazenamento local do navegador, pixels, identificadores e outras tecnologias de rastreamento, poderão ser tratadas de maneira equivalente para fins desta Política.",
        ],
      },
      {
        id: "como-a-cadife-utiliza",
        title: "2. Como a CADIFE Tour utiliza cookies",
        paragraphs: [
          "A CADIFE Tour poderá utilizar cookies próprios ou fornecidos por terceiros para:",
          "A utilização deverá observar os princípios da necessidade, transparência, adequação e segurança previstos na legislação de proteção de dados.",
        ],
        bullets: [
          "garantir o funcionamento técnico e a segurança do site;",
          "registrar escolhas relacionadas à privacidade e cookies;",
          "lembrar preferências do usuário;",
          "melhorar a experiência de navegação;",
          "compreender desempenho e utilização das páginas;",
          "identificar erros e aprimorar funcionalidades;",
          "integrar recursos de terceiros;",
          "realizar, mediante consentimento quando aplicável, análises, medição ou ações de marketing.",
        ],
      },
      {
        id: "categorias-de-cookies",
        title: "3. Categorias de cookies",
        paragraphs: [
          "3.1. Cookies estritamente necessários: necessários para que o site e seus recursos essenciais funcionem adequadamente (segurança, funcionamento técnico, manutenção de sessão, balanceamento de carga, registro das escolhas de privacidade e prevenção de utilização indevida). Estado padrão: sempre ativos.",
          "3.2. Cookies de preferências e funcionalidade: permitem lembrar idioma, configurações de interface, preferências de navegação e funcionalidades opcionais. A desativação poderá exigir nova seleção em acessos futuros. Estado padrão: desativados até a manifestação do usuário, quando dependerem de consentimento.",
          "3.3. Cookies de análise e desempenho: ajudam a compreender páginas acessadas, duração da visita, origem do acesso, dispositivo/navegador, interações com elementos do site, erros e desempenho. Estado padrão: desativados.",
          "3.4. Cookies de publicidade e marketing: quando implementados, podem medir campanhas, limitar repetição de anúncios, criar públicos, oferecer conteúdo relevante e acompanhar interações provenientes de terceiros. Estado padrão: desativados até consentimento.",
        ],
      },
      {
        id: "cookies-de-terceiros",
        title: "4. Cookies de terceiros",
        paragraphs: [
          "Algumas funcionalidades do site poderão depender de serviços fornecidos por terceiros, tais como ferramentas de análise, serviços do Google, avaliações e prova social, mapas, plataformas de vídeo, redes sociais, ferramentas de comunicação, serviços de atendimento e soluções de segurança e desempenho.",
          "Esses serviços poderão definir seus próprios cookies ou tecnologias semelhantes. Quando forem cookies não essenciais sujeitos a consentimento, sua ativação deverá respeitar as escolhas realizadas pelo usuário no gerenciador de preferências.",
          "Os terceiros são responsáveis por suas próprias práticas de tratamento nos limites em que atuarem como controladores independentes.",
        ],
      },
      {
        id: "gerenciamento-das-preferencias",
        title: "5. Gerenciamento das preferências",
        paragraphs: [
          "Ao acessar o site pela primeira vez, o usuário deverá poder visualizar um aviso de cookies com opções claras para: Aceitar todos (autoriza as categorias opcionais), Rejeitar cookies não necessários (mantém apenas os cookies indispensáveis) e Personalizar preferências (permite escolher individualmente as categorias opcionais autorizadas).",
          "A ausência de manifestação não deverá ser interpretada automaticamente como consentimento para cookies não necessários.",
        ],
      },
      {
        id: "central-de-preferencias",
        title: "6. Central de Preferências de Cookies",
        paragraphs: [
          'O usuário poderá alterar suas escolhas posteriormente por meio da opção "Preferências de Cookies", disponível permanentemente no site.',
          "A Central de Preferências deverá permitir visualizar as categorias de cookies, verificar quais categorias estão ativas, ativar ou desativar categorias opcionais, rejeitar todos os cookies não necessários, aceitar todos os cookies opcionais, salvar novas preferências e revogar consentimentos concedidos anteriormente. A revogação do consentimento deverá ser tão acessível quanto sua concessão.",
        ],
      },
      {
        id: "informacoes-detalhadas",
        title: "7. Informações detalhadas sobre cada cookie",
        paragraphs: [
          "A Central de Preferências poderá disponibilizar, sempre que aplicável, uma relação atualizada dos cookies efetivamente utilizados contendo Nome, Provedor, Categoria, Finalidade, Duração e Origem (próprio ou de terceiro).",
          "A CADIFE Tour poderá atualizar a relação sempre que fornecedores, tecnologias ou funcionalidades forem modificados.",
        ],
      },
      {
        id: "consentimento",
        title: "8. Consentimento",
        paragraphs: [
          "Quando o consentimento for a base legal utilizada, ele deverá ser livre, informado, inequívoco e relacionado a finalidades determinadas.",
          "Cookies não necessários sujeitos a consentimento deverão permanecer desativados antes da escolha do usuário. O simples fechamento do banner, continuidade da navegação ou ausência de manifestação não deverá, por si só, representar consentimento.",
        ],
      },
      {
        id: "registro-das-preferencias",
        title: "9. Registro das preferências",
        paragraphs: [
          "A CADIFE Tour poderá manter um registro técnico da escolha realizada pelo usuário para respeitar as preferências selecionadas, evitar a apresentação repetitiva do banner e demonstrar, quando necessário, a gestão adequada do consentimento.",
          "Esse registro deverá conter apenas as informações necessárias para essa finalidade.",
        ],
      },
      {
        id: "prazo-e-renovacao",
        title: "10. Prazo e renovação do consentimento",
        paragraphs: [
          "As preferências poderão ser solicitadas novamente quando houver alteração relevante nas categorias de cookies, inclusão de novas finalidades, alteração significativa dos fornecedores utilizados, expiração técnica da preferência registrada, mudança regulatória ou necessidade de renovação do consentimento.",
          "O usuário poderá modificar sua escolha a qualquer momento, independentemente desses eventos.",
        ],
      },
      {
        id: "configuracao-navegador",
        title: "11. Configuração pelo navegador",
        paragraphs: [
          "Além da Central de Preferências da CADIFE Tour, a maioria dos navegadores permite bloquear, apagar ou controlar cookies diretamente em suas configurações.",
          "O bloqueio de cookies estritamente necessários, realizado diretamente pelo navegador, poderá comprometer determinadas funcionalidades do site.",
        ],
      },
      {
        id: "dados-pessoais-e-cookies",
        title: "12. Dados pessoais e cookies",
        paragraphs: [
          "Determinados cookies podem envolver o tratamento de dados pessoais, como endereço IP, identificadores do dispositivo, informações de navegação ou outras informações que possam ser associadas a uma pessoa.",
          "Nesses casos, aplicam-se também as disposições da Política de Privacidade da CADIFE Tour e da LGPD.",
        ],
      },
      {
        id: "transferencias-internacionais",
        title: "13. Transferências internacionais",
        paragraphs: [
          "Fornecedores de tecnologias utilizadas no site poderão possuir infraestrutura ou servidores localizados fora do Brasil.",
          "Nesses casos, eventual transferência internacional de dados deverá observar os requisitos previstos na LGPD e na regulamentação aplicável.",
        ],
      },
      {
        id: "atualizacoes",
        title: "14. Atualizações desta Política",
        paragraphs: [
          "Esta Política poderá ser atualizada quando houver alteração das tecnologias utilizadas, dos fornecedores, das categorias de cookies, das finalidades, da legislação/regulamentação ou das orientações da Autoridade Nacional de Proteção de Dados.",
          "A versão mais recente permanecerá disponível no site, acompanhada da data da última atualização.",
        ],
      },
      {
        id: "contato",
        title: "15. Contato",
        paragraphs: [
          "Dúvidas sobre cookies, privacidade ou tratamento de dados pessoais poderão ser encaminhadas para os canais oficiais abaixo.",
          "Para informações mais amplas sobre o tratamento de dados pessoais, consulte também a Política de Privacidade da CADIFE Tour.",
        ],
      },
    ],
    contactHeading: "Canais oficiais para privacidade e LGPD",
    contactLabels: {
      email: "E-mail",
      whatsapp: "WhatsApp",
      cnpj: "CNPJ",
      location: "Localização",
    },
  },
  en: {
    backToHome: "Back to home page",
    badge: "Privacy & Transparency",
    title: "Cookie Policy & Cookie Preferences — CADIFE Tour",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedDate: "November 15, 2026",
    intro: [
      "This Policy explains how CADIFE Tour uses cookies and similar technologies on its website and how users can manage their preferences.",
      "It complements the CADIFE Tour Privacy Policy.",
    ],
    statusBannerTitle: "Current preference status on this website",
    statusBannerDescription:
      "At this stage, the CADIFE Tour website does not use advertising or third-party marketing tracking cookies. Only essential browser storage (interface language preference) remains active for proper navigation. Full interactive consent controls will be available in this center as the platform evolves.",
    privacyPolicyCta: "View full Privacy Policy",
    categoriesHeading: "Cookie categories and default states",
    inventoryHeading: "Technical list of currently active browser entries",
    inventoryNote:
      "This list reflects only technologies actually active in the current platform release and is updated whenever providers or features change.",
    inventoryColumns: {
      name: "Name",
      provider: "Provider",
      category: "Category",
      purpose: "Purpose",
      duration: "Duration",
      origin: "Origin",
    },
    categories: [
      {
        id: "necessary",
        title: "3.1. Strictly necessary cookies",
        description:
          "Required for security, technical operation, session maintenance, load balancing, storing privacy choices, and preventing misuse.",
        defaultState: "Always active",
        isEssential: true,
      },
      {
        id: "preferences",
        title: "3.2. Preferences & functionality cookies",
        description:
          "Remember user choices such as language, interface settings, browsing preferences, and optional features.",
        defaultState: "Disabled until consent (when applicable)",
        isEssential: false,
      },
      {
        id: "analytics",
        title: "3.3. Analytics & performance cookies",
        description:
          "Used to understand visited pages, visit duration, traffic source, device, interactions, errors, and site performance.",
        defaultState: "Disabled",
        isEssential: false,
      },
      {
        id: "marketing",
        title: "3.4. Advertising & marketing cookies",
        description:
          "When implemented, support campaign measurement, frequency capping, audience building, and third-party platform attribution.",
        defaultState: "Disabled until consent",
        isEssential: false,
      },
    ],
    inventory: [
      {
        name: "cadife_locale",
        provider: institutionalInfo.brandName,
        category: "Essential browsing preference",
        purpose: "Store the language selected by the user (PT, EN, or ES) in the browser.",
        duration: "Persistent until cleared in browser",
        origin: "First-party (localStorage)",
      },
    ],
    sections: [
      {
        id: "o-que-sao-cookies",
        title: "1. What cookies are",
        paragraphs: [
          "Cookies are small files or records stored on a user's device when visiting websites.",
          "They serve purposes such as enabling essential features, remembering settings, understanding website usage and, subject to consent where required, personalizing experiences or supporting communication and marketing.",
          "Similar technologies such as browser local storage, pixels, identifiers, and other tracking technologies may be treated equivalently under this Policy.",
        ],
      },
      {
        id: "como-a-cadife-utiliza",
        title: "2. How CADIFE Tour uses cookies",
        paragraphs: [
          "CADIFE Tour may use first-party or third-party cookies to:",
          "Usage follows the principles of necessity, transparency, adequacy, and security under applicable data protection legislation.",
        ],
        bullets: [
          "ensure technical operation and website security;",
          "record privacy and cookie choices;",
          "remember user preferences;",
          "improve browsing experience;",
          "understand page performance and usage;",
          "identify errors and improve features;",
          "integrate third-party resources;",
          "carry out analytics, measurement, or marketing actions upon consent where applicable.",
        ],
      },
      {
        id: "categorias-de-cookies",
        title: "3. Cookie categories",
        paragraphs: [
          "3.1. Strictly necessary cookies: essential for website security, technical operation, session continuity, load balancing, privacy choice storage, and abuse prevention. Default state: always active.",
          "3.2. Preferences & functionality cookies: remember language, interface settings, browsing preferences, and optional features. Default state: disabled until user consent when required.",
          "3.3. Analytics & performance cookies: help measure visited pages, visit duration, traffic origin, device/browser, interactions, errors, and performance. Default state: disabled.",
          "3.4. Advertising & marketing cookies: when implemented, support campaign measurement, ad capping, audience creation, relevant content, and third-party tracking. Default state: disabled until consent.",
        ],
      },
      {
        id: "cookies-de-terceiros",
        title: "4. Third-party cookies",
        paragraphs: [
          "Some site features may rely on third-party providers such as analytics tools, Google services, reviews and social proof, maps, video platforms, social networks, communication tools, customer support services, and security/performance solutions.",
          "Non-essential third-party cookies subject to consent must remain disabled unless authorized by the user in the preference center. Third parties remain responsible for their own independent processing practices.",
        ],
      },
      {
        id: "gerenciamento-das-preferencias",
        title: "5. Managing preferences",
        paragraphs: [
          "On first access, users must be presented with a clear cookie notice offering options to Accept all, Reject non-essential cookies, or Customize preferences.",
          "Lack of action or continuing to browse must not be interpreted as automatic consent for non-essential cookies.",
        ],
      },
      {
        id: "central-de-preferencias",
        title: "6. Cookie Preferences Center",
        paragraphs: [
          'Users can update their choices at any time via the permanent "Cookie Preferences" option available on the website.',
          "The Preferences Center must allow viewing categories, checking active categories, toggling optional categories, rejecting all non-essential cookies, accepting all optional cookies, saving new choices, and revoking consent as easily as granting it.",
        ],
      },
      {
        id: "informacoes-detalhadas",
        title: "7. Detailed information about each cookie",
        paragraphs: [
          "Whenever applicable, the Preferences Center provides an up-to-date list containing Name, Provider, Category, Purpose, Duration, and Origin (first-party or third-party), updated as technologies change.",
        ],
      },
      {
        id: "consentimento",
        title: "8. Consent",
        paragraphs: [
          "Where consent is the legal basis, it must be free, informed, unambiguous, and tied to specific purposes. Non-essential cookies remain disabled prior to user choice.",
        ],
      },
      {
        id: "registro-das-preferencias",
        title: "9. Recording preferences",
        paragraphs: [
          "CADIFE Tour may maintain a technical record of the user's choice solely to honor selected preferences, avoid repeating banners unnecessarily, and demonstrate compliance when required.",
        ],
      },
      {
        id: "prazo-e-renovacao",
        title: "10. Retention and renewal of consent",
        paragraphs: [
          "Preferences may be requested again when categories, purposes, or providers change substantially, when the technical preference expires, or when required by regulation. Users may change their choices at any time.",
        ],
      },
      {
        id: "configuracao-navegador",
        title: "11. Browser settings",
        paragraphs: [
          "Most browsers allow blocking, deleting, or controlling cookies directly in their settings. Blocking strictly necessary cookies via browser settings may affect core website features.",
        ],
      },
      {
        id: "dados-pessoais-e-cookies",
        title: "12. Personal data and cookies",
        paragraphs: [
          "Certain cookies may involve personal data such as IP address, device identifiers, or browsing data. In these cases, CADIFE Tour's Privacy Policy and Brazilian LGPD apply.",
        ],
      },
      {
        id: "transferencias-internacionais",
        title: "13. International transfers",
        paragraphs: [
          "Technology providers may operate infrastructure outside Brazil. Any international data transfer must comply with LGPD and applicable regulations.",
        ],
      },
      {
        id: "atualizacoes",
        title: "14. Updates to this Policy",
        paragraphs: [
          "This Policy may be updated whenever technologies, providers, cookie categories, purposes, laws, or guidance from the Brazilian National Data Protection Authority (ANPD) change.",
        ],
      },
      {
        id: "contato",
        title: "15. Contact",
        paragraphs: [
          "Questions about cookies, privacy, or personal data processing may be sent to our official channels below. For broader information, please also consult the CADIFE Tour Privacy Policy.",
        ],
      },
    ],
    contactHeading: "Official privacy & LGPD channels",
    contactLabels: {
      email: "Email",
      whatsapp: "WhatsApp",
      cnpj: "CNPJ (Tax ID)",
      location: "Location",
    },
  },
  es: {
    backToHome: "Volver a la página principal",
    badge: "Privacidad y Transparencia",
    title: "Política de Cookies y Preferencias de Cookies — CADIFE Tour",
    lastUpdatedLabel: "Última actualización:",
    lastUpdatedDate: "15 de noviembre de 2026",
    intro: [
      "Esta Política explica cómo CADIFE Tour utiliza cookies y tecnologías similares en su sitio web y cómo el usuario puede controlar sus preferencias.",
      "Complementa la Política de Privacidad de CADIFE Tour.",
    ],
    statusBannerTitle: "Estado actual de las preferencias en este sitio",
    statusBannerDescription:
      "En esta etapa, el sitio web de CADIFE Tour no utiliza cookies de publicidad ni rastreo de terceros para anuncios. Solo el almacenamiento esencial del navegador (preferencia de idioma) permanece activo para el correcto funcionamiento de la navegación. Los controles interactivos completos de consentimiento estarán disponibles en este centro conforme evolucione la plataforma.",
    privacyPolicyCta: "Consultar Política de Privacidad completa",
    categoriesHeading: "Categorías de cookies y estado predeterminado",
    inventoryHeading: "Listado técnico de registros utilizados actualmente",
    inventoryNote:
      "Este listado refleja únicamente las tecnologías activas en la versión actual de la plataforma y se actualiza cada vez que cambian los proveedores o funciones.",
    inventoryColumns: {
      name: "Nombre",
      provider: "Proveedor",
      category: "Categoría",
      purpose: "Finalidad",
      duration: "Duración",
      origin: "Origen",
    },
    categories: [
      {
        id: "necessary",
        title: "3.1. Cookies estrictamente necesarias",
        description:
          "Necesarias para seguridad, funcionamiento técnico, mantenimiento de sesión, balanceo de carga, registro de elecciones de privacidad y prevención de uso indebido.",
        defaultState: "Siempre activas",
        isEssential: true,
      },
      {
        id: "preferences",
        title: "3.2. Cookies de preferencias y funcionalidad",
        description:
          "Permiten recordar elecciones del usuario como idioma, configuración de interfaz, preferencias de navegación y funciones opcionales.",
        defaultState: "Desactivadas hasta consentimiento (cuando aplique)",
        isEssential: false,
      },
      {
        id: "analytics",
        title: "3.3. Cookies de análisis y rendimiento",
        description:
          "Se utilizan para comprender páginas visitadas, duración de la visita, origen del acceso, dispositivo, interacciones, errores y rendimiento del sitio.",
        defaultState: "Desactivadas",
        isEssential: false,
      },
      {
        id: "marketing",
        title: "3.4. Cookies de publicidad y marketing",
        description:
          "Cuando se implementan, permiten medir campañas, limitar repetición de anuncios, crear audiencias y dar seguimiento desde plataformas de terceros.",
        defaultState: "Desactivadas hasta consentimiento",
        isEssential: false,
      },
    ],
    inventory: [
      {
        name: "cadife_locale",
        provider: institutionalInfo.brandName,
        category: "Preferencia esencial de navegación",
        purpose: "Almacenar el idioma seleccionado por el usuario (PT, EN o ES) en el navegador.",
        duration: "Persistente hasta su eliminación en el navegador",
        origin: "Propio (localStorage)",
      },
    ],
    sections: [
      {
        id: "o-que-sao-cookies",
        title: "1. Qué son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos o registros almacenados en el dispositivo del usuario al acceder a determinados sitios web.",
          "Pueden utilizarse para habilitar funciones esenciales, recordar configuraciones, comprender el uso del sitio y, mediante consentimiento cuando sea necesario, personalizar experiencias o apoyar acciones de comunicación y marketing.",
          "Tecnologías similares como el almacenamiento local del navegador, píxeles e identificadores podrán recibir tratamiento equivalente conforme a esta Política.",
        ],
      },
      {
        id: "como-a-cadife-utiliza",
        title: "2. Cómo CADIFE Tour utiliza cookies",
        paragraphs: [
          "CADIFE Tour podrá utilizar cookies propias o de terceros para:",
          "Su uso observará los principios de necesidad, transparencia, adecuación y seguridad previstos en la legislación de protección de datos.",
        ],
        bullets: [
          "garantizar el funcionamiento técnico y la seguridad del sitio;",
          "registrar elecciones relacionadas con privacidad y cookies;",
          "recordar preferencias del usuario;",
          "mejorar la experiencia de navegación;",
          "comprender rendimiento y utilización de las páginas;",
          "identificar errores y perfeccionar funcionalidades;",
          "integrar recursos de terceros;",
          "realizar, mediante consentimiento cuando corresponda, análisis, medición o acciones de marketing.",
        ],
      },
      {
        id: "categorias-de-cookies",
        title: "3. Categorías de cookies",
        paragraphs: [
          "3.1. Cookies estrictamente necesarias: indispensables para seguridad, operación técnica, sesión, balanceo de carga, registro de privacidad y prevención de abusos. Estado predeterminado: siempre activas.",
          "3.2. Cookies de preferencias y funcionalidad: recuerdan idioma, interfaz y preferencias de navegación. Estado predeterminado: desactivadas hasta autorización cuando dependan de consentimiento.",
          "3.3. Cookies de análisis y rendimiento: permiten analizar páginas visitadas, duración, origen, dispositivo, interacciones, errores y rendimiento. Estado predeterminado: desactivadas.",
          "3.4. Cookies de publicidad y marketing: cuando se implementen, miden campañas, limitan repetición de anuncios, crean audiencias y siguen interacciones externas. Estado predeterminado: desactivadas hasta consentimiento.",
        ],
      },
      {
        id: "cookies-de-terceiros",
        title: "4. Cookies de terceros",
        paragraphs: [
          "Algunas funciones podrán depender de terceros como herramientas de análisis, servicios de Google, reseñas, mapas, plataformas de video, redes sociales, comunicación, atención y soluciones de seguridad/rendimiento.",
          "Las cookies no esenciales sujetas a consentimiento deberán respetar las elecciones del usuario en el gestor de preferencias. Los terceros son responsables por sus propias prácticas cuando actúan como controladores independientes.",
        ],
      },
      {
        id: "gerenciamento-das-preferencias",
        title: "5. Gestión de las preferencias",
        paragraphs: [
          "Al acceder al sitio por primera vez, el usuario deberá visualizar un aviso claro con opciones para Aceptar todas, Rechazar cookies no necesarias y Personalizar preferencias.",
          "La falta de manifestación o continuación de la navegación no se interpretará automáticamente como consentimiento para cookies no necesarias.",
        ],
      },
      {
        id: "central-de-preferencias",
        title: "6. Centro de Preferencias de Cookies",
        paragraphs: [
          'El usuario podrá modificar sus elecciones posteriormente mediante la opción "Preferencias de Cookies", disponible permanentemente en el sitio.',
          "El Centro permitirá ver categorías, comprobar cuáles están activas, activar o desactivar categorías opcionales, rechazar cookies no necesarias, aceptar opcionales, guardar preferencias y revocar consentimientos con la misma facilidad con que se otorgaron.",
        ],
      },
      {
        id: "informacoes-detalhadas",
        title: "7. Información detallada sobre cada cookie",
        paragraphs: [
          "Siempre que corresponda, el Centro pondrá a disposición una relación actualizada con Nombre, Proveedor, Categoría, Finalidad, Duración y Origen (propio o de terceros).",
        ],
      },
      {
        id: "consentimento",
        title: "8. Consentimiento",
        paragraphs: [
          "Cuando el consentimiento sea la base legal, deberá ser libre, informado, inequívoco y vinculado a finalidades determinadas. Las cookies no necesarias permanecerán desactivadas antes de la elección del usuario.",
        ],
      },
      {
        id: "registro-das-preferencias",
        title: "9. Registro de las preferencias",
        paragraphs: [
          "CADIFE Tour podrá conservar un registro técnico de la elección del usuario para respetar sus preferencias, evitar mostrar el aviso repetidamente y demostrar el cumplimiento cuando sea necesario.",
        ],
      },
      {
        id: "prazo-e-renovacao",
        title: "10. Plazo y renovación del consentimiento",
        paragraphs: [
          "Las preferencias podrán solicitarse nuevamente ante cambios relevantes en categorías, finalidades, proveedores, expiración técnica o cambios regulatorios. El usuario puede modificar su elección en cualquier momento.",
        ],
      },
      {
        id: "configuracao-navegador",
        title: "11. Configuración del navegador",
        paragraphs: [
          "La mayoría de los navegadores permiten bloquear, eliminar o controlar cookies directamente en su configuración. Bloquear cookies estrictamente necesarias puede afectar funciones esenciales del sitio.",
        ],
      },
      {
        id: "dados-pessoais-e-cookies",
        title: "12. Datos personales y cookies",
        paragraphs: [
          "Determinadas cookies pueden tratar datos personales como dirección IP, identificadores del dispositivo o información de navegación. En tales casos, aplican también la Política de Privacidad de CADIFE Tour y la LGPD.",
        ],
      },
      {
        id: "transferencias-internacionais",
        title: "13. Transferencias internacionales",
        paragraphs: [
          "Los proveedores tecnológicos pueden contar con infraestructura fuera de Brasil. Cualquier transferencia internacional observará los requisitos de la LGPD y normativa aplicable.",
        ],
      },
      {
        id: "atualizacoes",
        title: "14. Actualizaciones de esta Política",
        paragraphs: [
          "Esta Política podrá actualizarse cuando cambien tecnologías, proveedores, categorías, finalidades, legislación o directrices de la Autoridad Nacional de Protección de Datos (ANPD).",
        ],
      },
      {
        id: "contato",
        title: "15. Contacto",
        paragraphs: [
          "Las dudas sobre cookies, privacidad o tratamiento de datos personales podrán enviarse a los canales oficiales indicados abajo. Para mayor detalle, consulte también la Política de Privacidad de CADIFE Tour.",
        ],
      },
    ],
    contactHeading: "Canales oficiales de privacidad y LGPD",
    contactLabels: {
      email: "Correo electrónico",
      whatsapp: "WhatsApp",
      cnpj: "CNPJ",
      location: "Ubicación",
    },
  },
};
