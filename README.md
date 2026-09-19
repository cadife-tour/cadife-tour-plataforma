# CADIFE Tour — Website Experience

> **Uma nova experiência. Uma nova memória.**  
> Plataforma digital imersiva e de alta performance desenvolvida para a **CADIFE Tour** (Consultoria de Viagens sob medida).

---

## ✈️ 1. Visão do Projeto

O projeto da **CADIFE Tour** foi desenvolvido com foco em estética premium, fluidez a 60fps e máxima taxa de conversão. Em vez de uma página estática tradicional, combina **design editorial cinematográfico** com **interatividade em tempo real**, guiando o viajante desde o primeiro impacto visual até o contato direto com os consultores via WhatsApp.

- **Formato:** One Page imersiva orientada por narrativa e scroll (Scrollytelling).
- **Core de Conversão:** Todos os fluxos, cartões de destino e CTAs direcionam para atendimento consultivo humanizado via links contextuais do WhatsApp.
- **Internacionalização:** Suporte completo e reativo para **Português (PT)**, **Inglês (EN)** e **Espanhol (ES)**.

---

## 🌟 2. As Duas Versões do Frontend (Hero Experience)

A Hero Section da página principal (`/`) conta com **duas experiências de ponta integradas**, que podem ser alternadas instantaneamente pelo seletor flutuante presente no canto superior:

```
                  ┌──────────────────────────────────────────────┐
                  │          CADIFE TOUR HERO SELECTOR           │
                  │   [✨ Foto Revelação]   [🎬 Jornada em Vídeo] │
                  └──────────────────────────────────────────────┘
```

### 1️⃣ Versão 1: Foto Revelação Interativa (WebGL Fluid / Estilo Lando Norris)

Inspirada no efeito visual de revelação orgânica do site do piloto Lando Norris (OFF+BRAND), esta versão apresenta uma tela limpa e de alto impacto:

- **Física de Fluidos em Tempo Real:** Motor WebGL customizado em Three.js simulando equações de Navier-Stokes (advecção de velocidade, cálculo de divergência, resolvedor de pressão de Poisson com espaçamento centrado de amostras e projeção).
- **Revelação sob o Cursor:** O movimento do mouse ou toque na tela cria ondas inerciais dinâmicas que fatiam a rotina cinzenta do escritório e revelam a praia paradisíaca sob o ponto de interação.
- **Fidelidade Cromática Pura:** Utiliza texturas originais sRGB sem pós-processamentos ou filtros degradantes (`/demo-ln4/office-original.png` e `/demo-ln4/paradise-original.png`).
- **Resiliência e Fallback:** Proteção graciosa com detecção de contexto GPU/WebGL; se o dispositivo ou ambiente não suportar WebGL, a página mantém integridade visual e funcional.

### 2️⃣ Versão 2: Jornada Cinematográfica em Vídeo (Travel Experience)

A experiência original focada em scrollytelling cinematográfico:

- **Video Scrubbing a 60fps:** Sincronização cirúrgica entre a posição de rolagem (`scroll progress`) e a reprodução do vídeo da viagem via **GSAP ScrollTrigger** com amortecimento inercial (`scrub: 0.2`) e clamping bidirecional estrito.
- **Engine Multi-Modo (ADR 0004):** Suporte nativo por configuração aos modos `full` (jornada completa na homepage) e `single` (foco restrito em destino único, ex: Chile nas Landing Pages), sem duplicação de componentes.
- **Narrativa de Bordo Sincronizada:** Transição em 5 fases em HTML semântico com contraste AAA (Cabine → Janela → Nuvens → Cordilheira dos Andes / Chile → CTA Final de Conversão).
- **Acessibilidade e Fallback (`prefers-reduced-motion`):** Detecção automática de GPU e preferência de movimento reduzido, chaveando para layout estático editorial sem perda de elegância ou conversão.
- **Componente Reutilizável de WhatsApp:** Integração do `<WhatsAppCta />` conduzindo ao atendimento humano via WhatsApp oficial (`+55 47 99671-4510`) com mensagens personalizadas por destino em PT, EN e ES.

> 📖 **Acompanhamento de Mudanças:** Para ver em detalhes o que foi feito nesta branch, como e por que (incluindo ADRs atendidos, alinhamento de escopo e testes), consulte:  
> 👉 [Plano de Implementação & Entrega — Pedro (Wildcard / Hero POC)](docs/PEDRO_IMPLEMENTATION_PLAN.md)

---

## 🗺️ 3. Rotas da Aplicação

| Rota                     | Descrição                                                                                                                                                                                                                        |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/`**                  | **Página Principal (One Page Oficial):** Apresenta a Hero com alternância instantânea entre a Foto Revelação e a Jornada em Vídeo, além das seções de Destinos em Destaque, Como Funciona, A Agência, FAQ e Rodapé de Conversão. |
| **`/cursor-reveal-poc`** | **Laboratório WebGL Fluid:** Rota técnica isolada contendo o canvas puro de simulação física de fluidos e máscara de revelação do cursor em tela cheia.                                                                          |
| **`/demo-escape`**       | **Protótipo Editorial LN4:** Demonstração conceitual completa no estilo visual do manifesto LN4, com lente de revelação ajustável (100px / 160px / 240px), letreiro marquee contínuo e cartões tipográficos.                     |

---

## 🛠️ 4. Stack Tecnológica

| Camada                    | Tecnologia                    | Papel no Projeto                                                                                                                                                      |
| :------------------------ | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**             | **Next.js 15 (App Router)**   | Renderização ágil, Server Components, metadados SEO semânticos e roteamento.                                                                                          |
| **Linguagem**             | **TypeScript 5**              | Tipagem estrita de contratos de dados, rotas, manifesto de assets e eventos.                                                                                          |
| **Estilização**           | **Tailwind CSS + Tokens CSS** | Design system centralizado (`tokens.css` e `globals.css`) com as cores da marca Cadife: Vermelho `#DD0B0E`, Grafite `#393532` e superfícies escuras cinematográficas. |
| **Animação & Motion**     | **GSAP + ScrollTrigger**      | Mapeamento ultra-preciso de rolagem para a timeline da jornada em vídeo.                                                                                              |
| **Gráficos 3D / Shaders** | **Three.js**                  | Simulação fluidodinâmica baseada em GPU e shaders GLSL para revelação interativa.                                                                                     |
| **Internacionalização**   | **React Context API (i18n)**  | Alternância dinâmica de idiomas (PT, EN, ES) com dropdown acessível e bandeiras SVG vetoriais.                                                                        |
| **Testes Automatizados**  | **Vitest + Testing Library**  | Testes unitários e de integração cobrindo SEO, i18n, telemetria e renderização de componentes.                                                                        |

---

## 📁 5. Arquitetura Limpa de Assets

Para garantir que o repositório no GitHub permaneça leve e rápido de clonar, os arquivos foram estritamente filtrados:

- **`public/assets/brand/`**: Logotipo oficial vetorial, ícone original e variações para favicons.
- **`public/assets/destinations/`**: Imagens WebP comprimidas de alta resolução para os cards de destinos (Cruzeiros, Europa, Patagônia).
- **`public/assets/hero/airplane-journey-scrub.mp4`**: Único arquivo de vídeo ativo mantido no controle de versão (5.1 MB otimizado). Versões brutas ou não utilizadas ficam isoladas no `.gitignore`.
- **`public/demo-ln4/`**: Apenas as matrizes originais sem filtro (`office-original.png` e `paradise-original.png`). Cópias redundantes e variações de teste foram eliminadas.
- **Arquivos temporários (`scratch/`, `scripts/`, logs)**: Explicitamente ignorados no Git e no ESLint.

---

## 🚀 6. Como Executar Localmente

### Pré-requisitos

- **Node.js** 20+ ou superior
- **npm** (ou **pnpm** / **yarn**)

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cadife-tour.git

# 2. Acesse a pasta do projeto
cd cadife-tour

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para explorar a aplicação.

---

## 🛡️ 7. Comandos de Qualidade e CI

O projeto segue guardrails automatizados idênticos aos executados no **GitHub Actions** (`.github/workflows/ci.yml`):

```bash
# 1. Validação estrita de Lint (zero warnings)
npm run lint

# 2. Checagem de tipos TypeScript
npm run typecheck

# 3. Bateria completa de testes automatizados (27 testes)
npm run test

# 4. Build de produção
npm run build
```

---

## 📄 Licença

Este projeto é de propriedade da **CADIFE Tour**. Todos os direitos reservados.
