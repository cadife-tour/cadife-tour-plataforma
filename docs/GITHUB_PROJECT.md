# CADIFE Tour — GitHub Project Guide

Este documento consolida a estrutura recomendada para o GitHub Project responsável pela nova landing page imersiva da CADIFE Tour.

## 1. Objetivo do Project

Centralizar planejamento, priorização, execução, revisão e qualidade do novo site da CADIFE Tour, incluindo frontend, conteúdo, design, motion, assets 3D/vídeo, integrações, SEO, analytics e lançamento.

Nome recomendado do Project:

`CADIFE Tour — Website`

Descrição sugerida:

> Desenvolvimento da nova experiência digital da CADIFE Tour, incluindo interface responsiva, experiência imersiva da Hero, conteúdo institucional, integrações, assets 3D/vídeo, performance, acessibilidade e publicação.

## 2. Status

Usar exatamente este fluxo:

1. `Backlog` — item registrado, ainda não comprometido para execução
2. `Ready` — refinado, sem bloqueios relevantes e pronto para ser puxado
3. `In Progress` — em execução
4. `In Review` — aguardando revisão de código, design, conteúdo ou asset
5. `Blocked` — impedimento externo, dependência ou decisão pendente
6. `Done` — concluído e aceito

Todo o backlog inicial deve permanecer em `Backlog` até o primeiro refinamento/distribuição de trabalho.

## 3. Campos do Project

### Type

- Epic
- Feature
- Task
- Research / Spike
- Asset
- Bug
- QA

### Area

- Global
- Header / Navigation
- Hero / Viagens
- Depoimentos
- Contato
- Sobre nós
- Footer
- Integrações
- SEO / Analytics
- Performance / QA
- DevOps

### Workstream

- Product
- UX/UI
- Content
- Frontend
- 3D / Motion
- Assets
- Integration
- Analytics
- SEO
- QA
- DevOps

### Priority

- `P0 — Critical`
- `P1 — High`
- `P2 — Medium`
- `P3 — Low`

### Effort

- XS
- S
- M
- L
- XL

Itens XL devem ser avaliados para quebra antes de entrar em `Ready`.

### Risk

- Low
- Medium
- High

### Outros campos

- Owner
- Start date
- Target date

## 4. Views

### 01 — Backlog

Layout: Table

Filtro recomendado:

`status:Backlog,Ready`

Colunas:

`Title | Status | Priority | Area | Workstream | Effort | Risk | Owner`

### 02 — Execution

Layout: Board

Colunas:

`Ready → In Progress → In Review → Blocked → Done`

Esta é a view principal para acompanhamento diário/semanal da execução.

### 03 — Hero & Assets

Filtro:

`Area = Hero / Viagens`

Agrupar por:

`Workstream`

Objetivo: separar Content, UX/UI, Frontend, 3D/Motion e Assets dentro da Hero.

### 04 — Design & Content

Filtro:

`Workstream = UX/UI OR Workstream = Content`

### 05 — Assets / 3D / Motion

Filtro:

`Workstream = Assets OR Workstream = 3D / Motion`

### 06 — Roadmap

Layout: Roadmap

Agrupar por:

`Area`

Usar os campos `Start date` e `Target date`.

### 07 — QA / Launch

Filtro recomendado:

`Workstream = QA OR Type = Bug OR Area = Performance / QA`

## 5. Hierarquia macro

### EPIC #1 — Global — Design System, arquitetura e padrões da experiência

Base visual, arquitetura, responsividade, CTAs, i18n e motion global.

### EPIC #2 — Header & Navigation — Menu principal responsivo

Logo, navegação `Viagens | Depoimentos | Contato | Sobre nós`, seletor PT/EN/ES e CTA `Planeje sua viagem`.

### EPIC #3 — Hero — Jornada imersiva de viagens

Avião → nuvens → destinos → resort, com scroll sincronizado, assets, motion, CTAs e fallback.

### EPIC #11 — Sua Viagem em Movimento

Transição da Hero para o conteúdo institucional.

### EPIC #12 — Depoimentos & Confiança

Google Reviews e diferenciais de atendimento.

### EPIC #13 — Contato

Conversão por WhatsApp, redes sociais e atendimento humano.

### EPIC #14 — Sobre a CADIFE Tour

História, missão, visão, valores e confiança institucional.

### EPIC #15 — Footer, SEO, Performance & Launch

Footer, SEO, analytics, privacidade, QA e lançamento.

## 6. Hero — sequência narrativa

Ordem proposta:

1. Avião / janela
2. Nuvens
3. Chile / Cordilheira dos Andes — issue #10
4. Argentina / Buenos Aires — issue #16
5. Peru / Machu Picchu — issue #17
6. Cruzeiros / Navio — issue #18
7. Portugal / Torre de Belém — issue #20
8. Espanha — issue #21
9. França / Torre Eiffel — issue #22
10. Itália / Coliseu — issue #23
11. Brasil / Cristo Redentor — issue #25
12. Resort / Praia — issue #26
13. Saída para `Sua viagem em movimento` — issue #19

Sistema de nuvens: issue #9.

POC/arquitetura técnica: issue #8.

Integração da timeline completa: issue #24.

Carregamento progressivo: issue #28.

Fallback mobile/reduced motion: issue #30.

QA da Hero: issue #31.

## 7. Conteúdo-base da Hero

### Abertura

Headline:

`Uma nova experiência. Uma nova memória.`

Apoio:

`O mundo começa do outro lado da janela.`

Indicador:

`Role para começar sua viagem`

### Chile

`Chile — Entre montanhas e horizontes infinitos.`

CTA: `Quero conhecer esta opção`

### Argentina

`Argentina — Cidades pulsantes, cultura e experiências que ficam na memória.`

CTA: `Quero conhecer esta opção`

### Peru

`Peru — Histórias vivas e caminhos acima das nuvens.`

CTA: `Quero conhecer esta opção`

### Cruzeiros

`Cruzeiros — O destino começa antes mesmo de chegar.`

CTA: `Quero conhecer esta opção`

### Portugal

`Portugal — História, cultura e encontros à beira do Atlântico.`

CTA: `Quero conhecer esta opção`

### Espanha

Copy final deve ser validada junto ao asset escolhido.

CTA: `Quero conhecer esta opção`

### França

`França — Lugares que transformam momentos em histórias.`

CTA: `Quero conhecer esta opção`

### Itália

`Itália — Séculos de história em cada caminho.`

CTA: `Quero conhecer esta opção`

### Brasil

`Brasil — Paisagens que surpreendem até quem já está em casa.`

CTA: `Quero conhecer esta opção`

### Resort

`Resorts — Às vezes, o melhor destino é simplesmente desacelerar.`

CTA: `Quero conhecer esta opção`

## 8. Sua Viagem em Movimento

Headline:

`Sua viagem em movimento.`

Subheadline:

`Escolha o horizonte. A gente cuida do caminho.`

Texto:

`Do primeiro sonho ao último detalhe, desenhamos viagens nacionais e internacionais do seu jeito.`

Implementação: issue #19.

## 9. Depoimentos & Confiança

Headline:

`Cuidado em cada etapa.`

Subheadline:

`Quem viaja com a gente viaja acompanhado.`

Cards:

1. `Escuta antes do roteiro` — sua viagem começa pelo que você deseja sentir, não por uma lista pronta.
2. `Presença de verdade` — atendimento próximo antes, durante e depois de embarcar.
3. `Detalhes sob controle` — roteiro, reservas e orientações organizados com clareza.

Integração Google Reviews: issue #36.

Cards interativos: issue #37.

## 10. Contato

Headline-base:

`Próxima parada: sua próxima memória começa aqui.`

Apoio:

`Conte para a gente como você imagina sua viagem. A conversa é humana, sem compromisso e já começa pelo WhatsApp.`

CTA:

`Fale com a CADIFE Tour`

Complemento:

`Atendimento humano em Joinville para todo o Brasil.`

Implementação: issue #38.

## 11. Sobre Nós

Conteúdo deve apresentar:

- História da CADIFE Tour desde 2020
- Origem do nome, após validação institucional
- Missão
- Visão
- Valores
- Bloco CADIFE Tour Oficial
- Selo Cadastur

Implementação institucional: issue #39.

Cadastur/confiança: issue #40.

## 12. Footer

Estrutura:

### Esquerda

CADIFE Tour

`Uma experiência. Uma nova memória. Desde 2020.`

### Centro

- Telefone oficial
- E-mail oficial
- Endereço oficial

### Direita

- Política de Privacidade
- Preferências de Cookies
- WhatsApp

Rodapé final:

`© 2026 CADIFE Tour. Todos os direitos reservados.`

Implementação: issue #41.

Dados oficiais centralizados: issue #43.

## 13. Tasks transversais principais

- #4 — Estrutura responsiva global
- #29 — Arquitetura frontend por features
- #32 — Design System e tokens
- #33 — CTA reutilizável de WhatsApp
- #34 — Internacionalização PT / EN / ES
- #35 — Motion e smooth scroll
- #42 — SEO técnico
- #44 — Analytics e cookies
- #45 — QA final e lançamento
- #46 — Estratégia de branches e CI

## 14. Convenção de tipos/títulos

- `[EPIC]` — agrupador macro
- `[FEATURE]` — funcionalidade percebida pelo usuário
- `[TASK]` — trabalho implementável
- `[SPIKE]` — pesquisa técnica/prova de conceito
- `[ASSET]` — produção de mídia
- `[QA]` — qualidade/validação
- `[BUG]` — defeito/regressão

## 15. Automações recomendadas no GitHub Project

1. Item adicionado ao Project → `Status = Backlog`
2. Issue fechada → `Status = Done`
3. Pull Request mergeado → `Status = Done` quando associado ao item correspondente
4. Opcional: auto-add de issues do repositório `cadife-tour/cadife-tour-plataforma` ao Project
5. Opcional: regra futura por label `website` quando a taxonomia de labels estiver definida

## 16. Política de refinamento

Um item só deve sair de `Backlog` para `Ready` quando:

- objetivo estiver claro;
- critérios de aceite estiverem definidos;
- dependências conhecidas estiverem identificadas;
- asset/copy necessários estiverem disponíveis ou planejados;
- esforço estiver suficientemente compreendido;
- não existir bloqueio crítico conhecido.

Itens XL devem ser avaliados para quebra antes de `Ready`.

## 17. Ordem recomendada de refinamento inicial

Não mover automaticamente estas issues para Ready. A lista abaixo representa apenas a ordem sugerida para o primeiro refinamento:

1. #46 — Branch/CI
2. #29 — Arquitetura frontend
3. #32 — Design System
4. #4 — Responsividade global
5. #33 — CTA WhatsApp
6. #5 — Header desktop
7. #6 — Header mobile
8. #7 — Storyboard/copy Hero
9. #8 — POC Avião → Nuvens → Andes
10. #9 — Nuvens
11. #10 — Andes
12. #31 — QA do checkpoint técnico

Somente após validação do checkpoint da Hero, refinar em lote os demais assets e a timeline completa.

## 18. Cadência de gestão

O projeto deve usar uma cadência leve:

`Backlog → Refinamento → Ready → In Progress → In Review → Done`

Não é necessário impor dailies ou sprints rígidas. Refinamentos e alinhamentos podem acontecer conforme disponibilidade do time, mantendo clareza de responsáveis, dependências e próximos passos.

## 19. Estado inicial

Todo o conjunto inicial de issues deve permanecer em `Backlog` até a equipe realizar o primeiro refinamento e definir responsáveis/prioridades de execução.
