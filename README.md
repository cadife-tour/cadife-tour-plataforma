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

## 🌟 2. Jornada em vídeo (Hero Experience)

A página principal (`/`) abre diretamente na jornada cinematográfica em vídeo. A implementação atual apresenta a abertura Avião → Nuvens → Andes/Chile. O [storyboard da jornada completa](docs/HERO_STORYBOARD.md) define a sequência editorial, as dez paradas e a saída para **Sua viagem em movimento**; os assets e a integração das demais cenas são trabalhos posteriores.

- **Scrollytelling:** a posição de rolagem controla o vídeo com GSAP ScrollTrigger.
- **Mídia atual:** `airplane-journey-scrub.mp4`, clipe de 8 s e ~3,9 MB preparado para busca de quadros. O vídeo cobre Avião → Nuvens → Andes; poster e imagem estática atendem ao fallback. A fonte gerada pelo Google Flow é 720p e essa limitação visual permanece.
- **Conversão:** CTAs contextuais para atendimento humano no WhatsApp.

A Foto Revelação permanece acessível em `/cursor-reveal-poc` como protótipo independente, fora da homepage.

---

## 🗺️ 3. Rotas da Aplicação

| Rota                     | Descrição                                                                                                                                                                                                    |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/`**                  | **Página Principal (One Page Oficial):** Abre diretamente na Jornada em Vídeo, seguida pelas seções de Destinos em Destaque, Como Funciona, A Agência, FAQ e Rodapé de Conversão.                            |
| **`/cursor-reveal-poc`** | **Laboratório WebGL Fluid:** Rota técnica isolada contendo o canvas puro de simulação física de fluidos e máscara de revelação do cursor em tela cheia.                                                      |
| **`/demo-escape`**       | **Protótipo Editorial LN4:** Demonstração conceitual completa no estilo visual do manifesto LN4, com lente de revelação ajustável (100px / 160px / 240px), letreiro marquee contínuo e cartões tipográficos. |

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
- **`public/assets/hero/airplane-journey-scrub.mp4`**: Único arquivo de vídeo ativo mantido no controle de versão (~3,9 MB otimizado). O poster e o still dos Andes são arquivos WebP para fallback. Versões brutas ou não utilizadas ficam isoladas no `.gitignore`.
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
