# CADIFE Tour — Website | GitHub Project

Este documento define a organização recomendada para o GitHub Project responsável pelo novo site da CADIFE Tour.

## Objetivo do Project

Centralizar o planejamento e a execução do novo website institucional da CADIFE Tour, incluindo experiência imersiva da Hero, conteúdo, design, motion/3D, integrações, performance, acessibilidade, QA e publicação.

## Status

- `Backlog` — item registrado, ainda não refinado ou priorizado para execução imediata.
- `Ready` — item refinado, com escopo e dependências suficientes para começar.
- `In Progress` — item em execução.
- `In Review` — aguardando revisão de código, design, conteúdo ou asset.
- `Blocked` — impedido por dependência, decisão ou recurso externo.
- `Done` — concluído e validado.

## Campos recomendados

### Type
- Epic
- Feature
- Task
- Research / Spike
- Asset
- Bug

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

### Workstream
- Product
- UX/UI
- Content
- Frontend
- 3D / Motion
- Assets
- Integration
- QA

### Priority
- P0 — Critical
- P1 — High
- P2 — Medium
- P3 — Low

### Effort
- XS
- S
- M
- L
- XL

### Risk
- Low
- Medium
- High

### Outros campos
- Owner
- Start date
- Target date

## Views recomendadas

### 01 — Backlog
Layout: Table  
Filtro: `Status = Backlog OR Ready`  
Colunas: Title, Status, Priority, Area, Workstream, Effort, Owner.

### 02 — Execution
Layout: Board  
Colunas: Ready → In Progress → In Review → Blocked → Done.

### 03 — Hero & Assets
Filtro: `Area = Hero / Viagens`  
Agrupar por: Workstream.

### 04 — Design & Content
Filtro: `Workstream = UX/UI OR Content`.

### 05 — Assets / 3D / Motion
Filtro: `Workstream = Assets OR 3D / Motion`.

### 06 — Roadmap
Layout: Roadmap  
Agrupar por: Area  
Período: Start date → Target date.

### 07 — QA / Launch
Filtro: `Workstream = QA OR Type = Bug`.

## Automações recomendadas

- Item novo no Project → `Backlog`.
- Issue fechada → `Done`.
- PR mergeado → `Done` quando vinculado ao item correspondente.
- Itens identificados como website podem ser adicionados automaticamente ao Project conforme a estratégia de labels/auto-add adotada pela organização.

## Cadência

O projeto não depende de sprints rígidas. A recomendação é trabalhar com fluxo contínuo:

`Backlog → Refinamento → Ready → In Progress → In Review → Done`

Itens de alto risco devem ser validados por POC/Spike antes de liberar produção em massa de assets ou implementação dependente.

## Regra principal da Hero

A sequência `Avião → Nuvens → Cordilheira dos Andes` é o checkpoint técnico da experiência imersiva. Os demais destinos devem seguir o padrão validado nesse checkpoint, principalmente em relação a performance, carregamento, motion, acessibilidade e fallback mobile.

## Estrutura macro

- EPIC — Global / Design System
- EPIC — Header & Navigation
- EPIC — Hero / Jornada Imersiva
- EPIC — Sua Viagem em Movimento
- EPIC — Depoimentos & Confiança
- EPIC — Contato
- EPIC — Sobre a CADIFE Tour
- EPIC — Footer / SEO / Performance / Launch

## Definition of Ready

Um item pode ir para `Ready` quando:

- objetivo está claro;
- escopo está definido;
- critérios de aceite estão registrados;
- dependências conhecidas estão indicadas;
- assets/referências necessários estão disponíveis ou identificados;
- não existe decisão crítica pendente que impeça o início.

## Definition of Done

Um item pode ir para `Done` quando:

- entrega principal foi concluída;
- critérios de aceite foram atendidos;
- responsividade foi verificada quando aplicável;
- acessibilidade foi considerada quando aplicável;
- não há erro conhecido impeditivo;
- lint, typecheck, testes e build passam quando aplicável;
- revisão necessária foi concluída;
- documentação relevante foi atualizada.
