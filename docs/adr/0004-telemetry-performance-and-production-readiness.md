# ADR 0004: Telemetria Privacy-First, WhatsApp Deep-Links, Otimização de Assets e Production Readiness

## Status
Accepted

## Date
2026-08-28

## Context
Após a conclusão da fundação visual e do core semântico (Fases 1, 2 e 3), a Fase 4 teve como objetivo preparar a aplicação da **CADIFE Tour** para produção real, abrangendo:
1. **Telemetria de negócio e técnica** sem ferir a privacidade dos viajantes.
2. **Arquitetura de conversão de WhatsApp** contextualizada e à prova de falhas.
3. **Estratégia de assets e imagens** com `next/image` determinístico.
4. **Governança de acessibilidade, SEO técnico e fronteiras de i18n**.
5. **Avaliação de risco de segurança e integridade de dependências**.

Os princípios imutáveis de engenharia exigem que toda a instrumentação não comprometa o **Core First Load JS (hard budget $\le 105\text{ kB}$)**, não utilize dados fictícios e funcione de forma resiliente mesmo com JavaScript desativado.

---

## Decision

### 1. Telemetria Privacy-First e Contrato Tipado (`AnalyticsEventMap`)
- **Fachada Única Desacoplada**: A UI comunica-se exclusivamente com a função `trackEvent<K>(event, payload)`. Nenhum componente React possui acoplamento direto com SDKs de terceiros (Google Analytics, Meta Pixel, Plausible, etc.).
- **Zero PII**: É expressamente proibido capturar números de telefone, mensagens digitadas, nomes de usuários, endereços de IP brutos ou fingerprints. O objetivo é responder *"qual ação comercial ocorreu"* e não *"quem é o indivíduo"*.
- **Taxonomia de Eventos Aprovada**:
  - `whatsapp_conversion`: Disparado no clique de CTAs comerciais (`cta_location`, `locale`, `destination?`).
  - `destination_viewed`: Disparado via `IntersectionObserver` (máximo de 1 evento por destino por carregamento).
  - `faq_toggle`: Disparado na abertura/fechamento nativo de `<details>` (`question_id`, `locale`, `state`).
  - `language_change`: Disparado apenas na troca real de idioma (`from_locale`, `to_locale`).
  - `google_reviews_clicked`: Disparado antes da navegação para a prova social externa (`locale`).
  - `webgl_status`: Telemetria puramente técnica da renderização visual (`status`, `dpr`, `is_mobile`).
- **Eventos Descartados**: `whatsapp_context_generated`, `whatsapp_redirect_started` e `destination_detail_viewed` foram descartados por redundância e ruído operacional.

### 2. Arquitetura de Conversão e Safe Deep-Links de WhatsApp
- **Construção Centralizada**: Toda geração de deep link ocorre via `buildWhatsAppUrl(options)`.
- **Sanitização e Validação**: O número é sanitizado (`\D`) e validado quanto a tamanho mínimo ($\ge 10$ dígitos) e ausência de sequências de zeros (placeholders como `5500000000000`).
- **Safe Fallback**: Caso o número de WhatsApp esteja ausente, malformado ou inválido, o utilitário retorna `#contato`, impedindo que a aplicação gere links quebrados como `https://wa.me/` ou `https://wa.me/undefined`.
- **Origem do Número**: O número oficial deve ser injetado estritamente via variável de ambiente `NEXT_PUBLIC_WHATSAPP_NUMBER`. Nenhum número fictício ou provisório é hardcoded no repositório.

### 3. Otimização de Assets e Imagens com `next/image`
- **Migração de Assets**: Os assets comerciais reais em `base/Home - Cadife Tour_files/` foram migrados para `public/assets/` em formato WebP otimizado (destinos e logo).
- **Isolamento de Arquivos Históricos**: Vídeos pesados (~2.07 MB) e CSS/JS legados do Elementor/WordPress permanecem intocados em `base/` e fora do build de produção.
- **Zero CLS e Responsividade**: Cards de destinos utilizam `next/image` com container determinístico `aspect-video`, propriedade `fill`, `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` e `loading="lazy"`.

### 4. Acessibilidade, SEO e Fronteiras de i18n
- **Acessibilidade e Semântica**: Exatamente um `<h1>` semântico, hierarquia correta de headings, skip link `#main-content`, suporte a navegação por teclado (`:focus-visible` em 100% dos interativos) e isolamento da cena 3D decorativa com `aria-hidden="true"` e `pointer-events-none`.
- **Sincronização de Idioma**: `<html lang>` é sincronizado reativamente no cliente (`pt-BR`, `en`, `es`) a partir de `LocaleContext.tsx`.
- **Open Graph & Twitter**: Metadados configurados com imagem real `/assets/brand/logo.webp` (768 × 264).
- **Remoção de hreflang Enganoso**: O `alternates.languages` com query strings fictícias (`/?lang=en`) foi removido do `metadata`. No MVP, o `canonical: "/"` permanece limpo, pois as variações de idioma ocorrem no cliente via React Context e não representam documentos HTML distintos gerados no servidor.

### 5. Gestão de Segurança e Avaliação de Risco de Dependências (`npm audit`)
- **Resultado do Audit**: 2 vulnerabilidades reportadas no PostCSS (1 high, 1 moderate) empacotado internamente no Next.js (`GHSA-qx2v-qp2m-jg93`).
- **Avaliação de Risco**: Trata-se de vulnerabilidade em tempo de build/sourcemap parsing, sem vetor de ataque identificado no runtime estático exportado da landing page.
- **Decisão**: **Não executar `npm audit fix --force`**, pois a ferramenta sugeriu atualização para versões canary do Next.js 16, o que violaria a estabilidade da produção. As dependências oficiais serão atualizadas quando o Next.js 15 disponibilizar patch estável correspondente.

---

## Consequences

### Positive
- **Bundle Altamente Otimizado**: First Load JS mantido em **104 kB** (abaixo do hard budget de 105 kB). A página `/` possui apenas 3.9 kB e shared chunks somam 99.7 kB.
- **Resiliência No-JS**: O site continua 100% funcional, legível e com links de conversão operantes mesmo sem execução de JavaScript.
- **Zero Vazamento de Dados Pessoais**: Conformidade total com LGPD/GDPR sem necessidade de scripts pesados de consentimento.
- **Estabilidade e Testabilidade**: 27 testes automatizados cobrindo acessibilidade, SEO, telemetria e fluxos de deep links.

### Trade-offs & Limitations
- **SEO Multilíngue no MVP**: O conteúdo em inglês e espanhol não é indexável individualmente pelo Googlebot devido à arquitetura de SPA client-side no i18n.
- **Métricas de Campo (RUM)**: A comprovação definitiva de Core Web Vitals reais (LCP < 2.5s, CLS < 0.1, INP < 200ms) dependerá da telemetria de campo após o deploy na Vercel.

---

## Alternatives Considered
1. **Instalar SDK oficial do Google Analytics / GTM na UI**: Rejeitado para evitar dependência de terceiros, inchaço de bundle e riscos de privacidade.
2. **Criar sub-rotas `/en` e `/es` no App Router na Etapa 1**: Rejeitado para não expandir o escopo nem atrasar a entrega da Fase 4.
3. **Executar `npm audit fix --force`**: Rejeitado por instalar versões canary instáveis do framework.

---

## Validation
- **Quality Gates**:
  - `npm run lint`: 0 errors / 0 warnings (`--max-warnings 0`).
  - `npm run typecheck`: 0 errors (`tsc --noEmit` estrito).
  - `npm run test`: 27/27 testes passando (7 suítes).
  - `npm run build`: Compilação estática SSG de 100% das páginas com 104 kB First Load JS.
- **Git State**: Commits `ee59eed` (4B), `38cb0ee` (4C), `4bdc43c` (4D) e `045981d` (4E) consolidados na branch `main`.

---

## Future Work (Etapa 2 / Roadmap)
1. **Roteamento Multilíngue Server-Side**: Migração para subdiretórios `/[locale]` no App Router com tags `<link rel="alternate" hreflang="...">` para indexação internacional nativa.
2. **Configuração de Variáveis de Produção**: Injeção da variável `NEXT_PUBLIC_WHATSAPP_NUMBER` oficial e homologada no dashboard da Vercel.
3. **Monitoramento RUM Real**: Acompanhamento dos relatórios de Core Web Vitals de campo (Vercel Speed Insights).
