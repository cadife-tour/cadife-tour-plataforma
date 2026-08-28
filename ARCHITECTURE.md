# Documento Arquitetural & Plano de Implementação — CADIFE Tour (Etapa 1)

> **Status**: Consolidado e Aprovado via Grilling Process  
> **Horizonte**: 30 a 60 dias (Lançamento MVP Etapa 1)  
> **Filosofia Central**: *Core First, Progressive Enhancement Always* (HTML + Conteúdo + Conversão = Núcleo; WebGL + Motion + Shaders = Camada Visual Incremental).

---

## 1. Princípios Arquiteturais e Critérios de Decisão

Toda decisão técnica e de produto é regida por 4 critérios objetivos:
1. **Valor para o Usuário**: A experiência é rápida, acessível, compreensível e encantadora.
2. **Impacto no Negócio**: Cada seção conduz naturalmente o viajante ao atendimento humano no WhatsApp com contexto claro.
3. **Custo/Complexidade de Manutenção**: Zero overhead de ferramentas pesadas desnecessárias no MVP; código limpo e fácil de colaborar.
4. **Evolução Futura**: Base pronta para desacoplar e expandir para o ecossistema *Cadife Smart Travel* sem retrabalho do marketing institucional.

---

## 2. Stack Tecnológica e Ferramentas

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Base** | **Next.js (App Router) + React + TypeScript** | SSR/SSG nativo para SEO e performance, tipagem estrita e ecossistema robusto. |
| **Estilização** | **Tailwind CSS + Design Tokens em CSS Variables** | Produtividade com consistência. Tokens semânticos agnósticos a frameworks. |
| **Narrativa Visual** | **React Three Fiber / Three.js + GSAP** | WebGL encapsulado em camada passiva/progressiva, sincronizado por scroll. |
| **Internacionalização** | **`next-intl` + Dicionários Tipados** | Suporte a PT-BR, EN e ES com validação estática de chaves no build. |
| **Analytics** | **Fachada Agnóstica (`src/core/analytics`)** | Isolamento de componentes; suporte inicial privacy-first (Plausible/Umami/GA4 sem acoplamento). |
| **Deployment / CI** | **Vercel + GitHub Actions** | Deploy automatizado com preview branches e guardrails de lint/typecheck. |

---

## 3. Arquitetura Dual-Layer & Matriz de Degradação Elegante

```
┌───────────────────────────────────────────────────────────┐
│                     CAMADA SUPERIOR (DOM)                 │
│  HTML Semântico, h1-h6, Textos, Links, Botões, CTAs       │
│  (Acessível a Leitores de Tela, Navegação por Teclado)    │
└─────────────────────────────┬─────────────────────────────┘
                              │ Dispara eventos de scroll / posição
┌─────────────────────────────▼─────────────────────────────┐
│                 CAMADA DE FUNDO (VISUAL-JOURNEY)          │
│  Canvas WebGL / Three.js / Partículas / Cenas 3D          │
│  (Progressive Enhancement — Totalmente Opcional)          │
└───────────────────────────────────────────────────────────┘
```

### Matriz de Fallback (4 Níveis)

1. **`prefers-reduced-motion: reduce`**: Desativa Canvas 3D e scrolljacking. Scroll nativo do browser com imagens estáticas e transições simples.
2. **WebGL/GPU Indisponível / Falha de Contexto**: Canvas é desmontado em runtime; entra fallback visual de gradientes e imagens em CSS puro sem travar a interface.
3. **Conexão Lenta (`Save-Data` / 2G/3G)**: Modelos 3D e mídias pesadas não são baixados. Carregamento estrito de HTML, CSS e imagens essenciais em WebP/AVIF.
4. **JavaScript Desativado**: Todo o conteúdo institucional, cards de destinos, depoimentos e links diretos para o WhatsApp continuam renderizados e utilizáveis via HTML estático.

---

## 4. Estrutura Modular de Pastas (Feature-Driven)

```text
src/
├── app/                      # Rotas Next.js App Router (estruturação de páginas e layouts)
├── core/                     # Infraestrutura transversal agnóstica
│   ├── analytics/            # Fachada de tracking (trackEvent)
│   ├── i18n/                 # Configuração do next-intl e navegação
│   ├── theme/                # Definição e injeção de tokens semânticos (CSS Variables)
│   └── config/               # Constantes globais e variáveis de ambiente
├── content/                  # Dados estruturados tipados
│   ├── destinations/         # Catálogo de viagens (títulos, descrições, tags)
│   ├── agency/               # Missão, visão, história, equipe
│   ├── testimonials/         # Avaliações do Google / prova social
│   └── locales/              # Dicionários de tradução (pt.json, en.json, es.json)
├── features/                 # Módulos funcionais isolados
│   ├── marketing/            # Seções institucionais, Hero, Prova Social, FAQ, Footer
│   ├── destinations/         # Visualização de cards de destinos e roteiros
│   └── visual-journey/       # Canvas WebGL, Shaders, R3F Scene, Timelines GSAP
└── shared/                   # Componentes primitivos puros reutilizáveis
    ├── ui/                   # Button, Container, Card, Badge, Modal, SkipToContent
    ├── hooks/                # useMediaQuery, useReducedMotion, useIntersectionObserver
    └── utils/                # Formatters de texto, helpers de URL do WhatsApp
```

> **Regra de Ouro**: A pasta `features/visual-journey` pode ser completamente deletada do projeto sem que o site pare de compilar ou perca qualquer funcionalidade semântica.

---

## 5. Storyboard da Narrativa (6 Blocos Modulares)

1. **Hero (A Decolagem)**: Janela do avião, boas-vindas, proposta de valor da CADIFE Tour e CTA primário para atendimento.
2. **Estação 1 (Cidades & Cultura)**: Destinos internacionais e históricos (ex: Paris, Roma). Cartão de conteúdo objetivo e CTA contextualizado.
3. **Estação 2 (Natureza & Ecoturismo)**: Montanhas, parques naturais e viagens de aventura.
4. **Estação 3 (Cruzeiros & Litoral)**: Resorts, praias paradisíacas e experiências em alto mar.
5. **Estação 4 (A Agência CADIFE)**: Prova social (Google Reviews), atendimento humanizado e diferenciais da consultoria.
6. **Footer & Central de Contato**: FAQ rápido, links institucionais e canais diretos de suporte no WhatsApp.

---

## 6. Fronteiras de Escopo (O que FICA FORA da Etapa 1)

* ❌ **Sem Autenticação/Login**: Nenhuma área de membros ou clientes na Etapa 1.
* ❌ **Sem Banco de Dados / ORM**: Todo o conteúdo é estruturado em arquivos tipados locais.
* ❌ **Sem CMS Administrativo Próprio**: Edições centralizadas no repositório.
* ❌ **Sem Pagamento / E-commerce**: Conversão 100% direcionada ao atendimento humano no WhatsApp.
* ❌ **Sem Recursos SaaS / IA**: Roteirizadores automáticos, APIs de voos e assistentes de IA pertencem exclusivamente à **Etapa 2 (Cadife Smart Travel)**.

---

## 7. Governança, CI/CD e Práticas de Engenharia

1. **Conventional Commits**: Padrão de mensagens de commit (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
2. **Git Workflow**: Branch `main` protegida; branches de funcionalidade (`feat/...`, `fix/...`) com Pull Requests obrigatórios e preview automático na Vercel.
3. **Guardrails no CI**:
   - `npm run lint` (ESLint)
   - `npm run typecheck` (TypeScript strict)
   - `npm run build` (Validação de templates, rotas e integridade dos dicionários i18n)
4. **Documentação Viva**:
   - `ARCHITECTURE.md`: Filosofia e mapa arquitetural.
   - `CONTRIBUTING.md`: Guia de onboarding para desenvolvedores voluntários.
   - `docs/adr/`: Architecture Decision Records registrando as decisões consolidadas neste Grilling.
   - `.env.example`: Modelo limpo de variáveis sem qualquer credencial ou segredo.
