# CADIFE Tour — Website Experience

> **Uma nova experiência. Uma nova memória.**  
> Protótipo funcional de alta performance para a nova experiência digital da CADIFE Tour.

---

## ✈️ 1. Visão do Projeto

O site da **CADIFE Tour** foi idealizado para ir além de um site institucional tradicional. A proposta é criar uma **experiência digital imersiva** que transmita movimento, viagem, confiança e acompanhamento humano antes mesmo do primeiro contato.

- **Formato:** One Page interativa orientada por scroll (Scrollytelling).
- **Diferencial:** A **Hero Experience**, uma narrativa cinematográfica controlada pela rolagem do usuário (interior da aeronave → aproximação da janela → travessia das nuvens → revelação do destino).
- **Foco de Conversão:** Todos os pontos de contato e CTAs contextuais conduzem ao objetivo comercial principal: iniciar um atendimento consultivo e humanizado via **WhatsApp**.

---

## 🛠️ 2. Stack Tecnológica & Decisões de Frontend

Para alcançar fidelidade visual de 60fps sem sobrecarregar navegadores mobile ou consumir recursos excessivos de GPU, adotamos uma **arquitetura híbrida e performática**:

| Camada | Tecnologia | Motivação & Papel |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Renderização ágil, SEO semântico, rotas otimizadas e Server Components. |
| **Linguagem** | **TypeScript** | Tipagem estrita de contratos de dados, rotas, manifesto de assets e eventos. |
| **Estilização** | **Tailwind CSS + CSS Custom Properties** | Design tokens centralizados (`tokens.css`) com as cores originais da marca: Vermelho Cadife (`#DD0B0E`), Grafite institucional (`#393532`) e superfícies escuras cinematográficas. |
| **Motion & Scroll** | **GSAP + ScrollTrigger** | Mapeamento cirúrgico de `scroll progress` para a timeline da experiência, com scrubbing hiper-responsivo (`scrub: 0.12`). |
| **Vídeo & Scrubbing** | **HTML5 Video com GOP Reduzido** | Vídeo em 1080p re-encodado com keyframes frequentes (`-g 12`) e `faststart`, permitindo que o navegador busque quadros instantaneamente durante a rolagem sem travar. |
| **Gráficos 3D / WebGL** | **Three.js & React Three Fiber** | Base pronta para camadas de profundidade, partículas e modelos tridimensionais progressivos. |
| **Internacionalização** | **Context API nativa (i18n)** | Suporte completo para **PT-BR**, **EN** e **ES**, com seletor de idiomas em menu dropdown e bandeiras vetoriais. |

---

## 🎯 3. O Que Temos Implementado (Estado Atual)

1. **Header Institucional:**
   - Logotipo oficial e ícone original Cadife Tour.
   - Navegação por âncoras para as seções principais.
   - Seletor de idiomas dropdown com bandeiras vetoriais (PT / EN / ES).
   - Botão direto de contato via WhatsApp com mensagem pré-configurada.
   - Ocultação automática inteligente durante a navegação pela experiência.

2. **Hero Cinematográfica Interativa:**
   - Sincronização direta de scroll com o vídeo de bordo (`airplane-journey-scrub.mp4`).
   - Camadas de tipografia de alto contraste com sombras projetadas para leitura perfeita em qualquer momento da cena.
   - Micro-animações e indicadores de scroll.
   - CTA direto para planejamento da viagem.

3. **Seções Institucionais da One Page:**
   - **Destinos em Destaque:** Apresentação de roteiros com CTAs contextualizados por destino.
   - **Como Funciona:** Explicação do processo de consultoria sob medida em passos claros.
   - **A Agência & Diferenciais:** História da agência, valores e prova de credibilidade.
   - **Dúvidas Frequentes (FAQ):** Respostas para as principais perguntas dos viajantes.
   - **Rodapé Completo:** Informações de contato, conformidade, dados institucionais e links diretos.

4. **Acessibilidade & Resiliência:**
   - Suporte nativo a `prefers-reduced-motion` com fallback estático automático para quem desativar animações.
   - Estrutura de botões acessíveis, foco por teclado visível e tags semânticas completas para motores de busca (SEO).

---

## 🚀 4. Como Executar Localmente

### Pré-requisitos
- **Node.js** 18.18+ ou superior
- Gerenciador de pacotes **npm**, **pnpm** ou **yarn**

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

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a experiência funcional.

### Outros Comandos Úteis

```bash
# Verificação de tipos TypeScript
npm run typecheck

# Execução dos testes automatizados
npm run test

# Build de produção
npm run build
```

---

## 🧭 5. Próximos Passos & Evolução (Roadmap de Frontend)

- [ ] **Expansão da Sequência de Destinos:** Adicionar novas etapas à timeline da Hero (Argentina, Peru, Cruzeiros, Europa) seguindo a mesma mecânica de nuvens e transições.
- [ ] **Exploração do Conceito B (Metamorfose do Viajante):** Experimentar protótipos onde o viajante permanece como âncora visual e o ambiente/roupa se transformam com a rolagem.
- [ ] **Integração Dinâmica do Google Reviews:** Conexão com API oficial para alimentar os depoimentos de clientes reais em tempo real.
- [ ] **Modelos 3D Interativos:** Introdução progressiva de elementos `.glb` de monumentos e cenários via React Three Fiber em dispositivos com suporte a WebGL.
