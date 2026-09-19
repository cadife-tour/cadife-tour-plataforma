# Plano de Implementação — Atribuições de Pedro (Frontend Experience & Hero)

**Papel no Time:** Wildcard (Frontend Experience, Hero Imersiva & POCs)  
**Branch:** `feat/pedro-frontend-experience`  
**Escopo:** Exclusivo da experiência da Hero e componentes diretos de jornada, sem invadir atribuições de Nicolas (Header/Nav), Caetano (Assets/Design System) e Luiz (QA/Review).

---

## 1. Visão Geral e Alinhamento

Este plano traduz as decisões da reunião de 15/09/2026, a visão inicial da CADIFE Tour e as diretrizes do AI Harness (`docs/ai/` e `AGENTS.md`) em um roteiro prático e focado nas suas atribuições.

### Guardrails Críticos:

- **ADR 0001:** Manter Next.js 15, React 19, TypeScript, Tailwind, GSAP/ScrollTrigger.
- **ADR 0004:** A engine da Hero deve suportar dois modos por configuração (`full-journey` para Homepage e `single-destination` para Landing Page de destino), sem duplicar código.
- **ADR 0005:** Nenhum banco de dados ou backend próprio na Etapa 1.
- **Acessibilidade:** Textos e botões em HTML/React puro (nunca queimados dentro de vídeo ou canvas).

---

## 2. Fases de Execução

### Fase 1 — Padronização da Hero Engine (`TravelExperience`)

Alinhar a arquitetura da Hero com `docs/ai/HERO_EXPERIENCE.md` e o ADR 0004.

- [x] **Arquitetura modular orientada a configuração**:
  - Desacoplar os dados dos destinos do componente visual.
  - Implementar suporte tipado a dois modos: `mode: 'full' | 'single'`.
  - Parâmetro opcional `targetDestination?: string` para carregar direto a cena do destino específico (ex: `chile`).
- [x] **Estrutura de Manifests**:
  - Manter `src/features/travel-experience/config/travelExperienceConfig.ts` como fonte única dos percentuais de scroll e fases (`AIRPLANE`, `WINDOW`, `CLOUDS`, `DESTINATION`).
  - Não duplicar lógica entre destinos.

---

### Fase 2 — Componente Reutilizável de Conversão WhatsApp

Conforme a visão comercial do projeto: todo CTA de destino deve conduzir a uma conversa humana no WhatsApp com mensagem contextual.

- [x] **Criar `src/shared/ui/WhatsAppCta/WhatsAppCta.tsx`**:
  - Props tipadas: `destination?: string`, `source?: 'hero' | 'header' | 'footer' | 'card'`, `variant?: 'primary' | 'secondary' | 'glass'`, `children: React.ReactNode`.
  - Helper `createWhatsAppUrl(destination, source)` que gera o link oficial (`+55 47 99671-4510`) com texto contextualizado:
    - _Chile_: `"Olá! Estava conhecendo o Chile no site da CADIFE Tour e gostaria de conversar sobre essa viagem."`
    - _Geral_: `"Olá! Gostaria de planejar minha viagem com a CADIFE Tour."`
  - Elemento semântico `<a>` com `rel="noopener noreferrer"` e suporte total a teclado e leitores de tela.

---

### Fase 3 — Spike Tecnológico da Hero & POC Restrita (Chile)

Execução da principal meta técnica da Sprint inicial (POC 01 a 03 da visão do projeto).

- [x] **Pipeline de Scroll GSAP ScrollTrigger**:
  - Revisar `TravelExperience.tsx` garantindo que o scrubbing de vídeo/canvas seja perfeitamente bidirecional (scroll para frente e para trás sem descompasso).
  - Inércia suave (`scrub: 0.15` a `0.3`) sem prender ou travar a rolagem nativa da página (sem hijack agressivo).
- [x] **Overlays e Textos HTML/React Acessíveis**:
  - Manter títulos, legendas e o CTA do Chile em HTML/React puro (`TravelOverlay.tsx`), posicionados sobre a mídia via CSS (nunca "queimados" dentro do vídeo ou canvas).
  - Fade in/out sincronizado com as janelas de progresso da timeline:
    - `0.00 – 0.15`: Interior do avião + "Uma nova experiência. Uma nova memória."
    - `0.15 – 0.30`: Zoom na janela + "O mundo começa do outro lado da janela."
    - `0.30 – 0.50`: Imersão nas nuvens.
    - `0.50 – 0.85`: Revelação da Cordilheira dos Andes (Chile) + Headline + Copy.
    - `0.85 – 1.00`: Fixação do CTA contextual WhatsApp ("Quero conhecer esta opção").

---

### Fase 4 — Acessibilidade e Fallback Progressivo (`prefers-reduced-motion`)

Alinhar com `docs/ai/ACCESSIBILITY_RESPONSIVE.md` e ADR 0002.

- [x] **Modo Acessível Sem Movimento**:
  - Integrar `useGpuCapability` para detectar `prefers-reduced-motion` ou falha de renderização.
  - O fallback (`StaticAtmosphere.tsx`) deve apresentar uma composição estática premium, tipografia elegante e CTA imediato do WhatsApp, sem animação contínua.
- [x] **Semântica e Contraste**:
  - Garantir contraste AA (mínimo 4.5:1) nos textos sobre backgrounds dinâmicos utilizando scrim / gradients sutis.

---

### Fase 5 — Benchmark de Performance & Validação Mobile

Preparar o entregável para revisão do Luiz (QA/Arquitetura) e validação com o Diego (PO).

- [x] **Métricas Alvo**:
  - 60 FPS estáveis em scroll contínuo em desktop.
  - Comportamento leve em mobile (sem aquecimento ou travamento de buffer).
  - Sem erros de console e sem memory leaks no `ScrollTrigger.kill()`.
- [x] **Auditoria de Qualidade**:
  - Execução da suíte de testes de regressão e typecheck (`npm run typecheck`, `npm run test`, `npm run lint`).

---

## 3. Arquivos Envolvidos

| Arquivo                                                           | Ação          | Descrição                                                                  |
| :---------------------------------------------------------------- | :------------ | :------------------------------------------------------------------------- |
| `src/features/travel-experience/config/travelExperienceConfig.ts` | **Modificar** | Suporte a modos `full` e `single` e parametrização de fases.               |
| `src/features/travel-experience/TravelExperience.tsx`             | **Modificar** | ScrollTrigger limpo, suporte a `mode` e integração do CTA contextual.      |
| `src/features/travel-experience/components/TravelOverlay.tsx`     | **Modificar** | Textos oficiais em HTML semântico com animação sincronizada.               |
| `src/shared/ui/WhatsAppCta/WhatsAppCta.tsx`                       | **Novo**      | Componente de conversão WhatsApp reutilizável para todo o projeto.         |
| `src/shared/utils/whatsAppUrl.ts`                                 | **Novo**      | Função utilitária pura de montagem da URL do WhatsApp com encoding seguro. |

---

## 4. Como Executar e Validar

1. **Validação de Tipos:** `npm run typecheck`
2. **Validação de Código:** `npm run lint`
3. **Testes Automatizados:** `npm run test`
4. **Inspeção Visual:** Abrir no navegador e testar scroll progressivo, reverso e responsividade mobile.
