# SPEC — Issue #1: Design system global e biblioteca visual

**Issue:** [#1 — Global — Design System, arquitetura e padrões da experiência](https://github.com/cadife-tour/cadife-tour-plataforma/issues/1)
**Tipo e estado:** EPIC, aberto, Backlog
**Escopo desta spec:** primeira fatia verificável do épico: consolidar a base de tokens/primitives compartilhadas e entregar uma biblioteca React navegável para inspecioná-las. Esta spec não declara o épico inteiro concluído.

## Problema e resultado esperado

O projeto já tem tokens CSS e componentes compartilhados, mas não oferece uma página de referência para inspecionar os objetos visuais, suas variantes e estados, nem uma convenção que mantenha exemplos dos novos componentes reutilizáveis visíveis. A equipe precisa de uma referência executável junto ao código, para consultar nomes, uso e comportamento real sem depender de imagens desatualizadas.

Ao concluir esta fatia, a rota `/design-system` apresentará os tokens globais e os componentes reutilizáveis catalogados com seu nome, propósito, arquivo de origem e exemplos interativos das variantes/estados relevantes. A implementação manterá os exemplos ligados aos componentes React reais; adicionar um novo componente compartilhado exigirá registrá-lo no catálogo e documentar seus estados aplicáveis.

## Descoberta atual

- `src/core/theme/tokens.css` já define cores semânticas, tipografia parcial, raios, sombras e durações de motion.
- `src/core/theme/globals.css` aplica tokens globais e foco visível. O baseline de movimento reduzido está em `tokens.css`.
- `src/shared/ui/` contém `Button`, `Container`, `LanguageSelector` e `SkipToContent`; o teste compartilhado cobre Button, Container e SkipToContent.
- Não existe rota ou registro de catálogo para os componentes.
- O `README.md` documenta a stack e as rotas existentes, mas não os padrões de contribuição para componentes compartilhados.
- A issue é um épico amplo. Header, Hero, depoimentos, contato, Sobre Nós, Footer e integração completa de motion continuam fora desta primeira fatia, exceto quando consumirem primitives já existentes.

## Requisitos e regras

### Confirmados pela issue e pelo pedido

1. Tokens e padrões globais devem ser compartilhados e reutilizáveis, sem depender de uma seção específica.
2. O layout da biblioteca e os componentes devem se adaptar a desktop, tablet e mobile.
3. Navegação por teclado, foco visível e `prefers-reduced-motion` devem ser considerados.
4. A biblioteca deve mostrar os componentes/objetos visuais reutilizáveis com nome e referência para sua implementação.
5. Os exemplos devem permitir experimentar estados que existam no componente, incluindo hover/focus, animação e loading quando aplicáveis.
6. Novos componentes reutilizáveis adicionados a `src/shared/ui/` devem aparecer na biblioteca na mesma mudança que os introduz.

### Proposta técnica reversível

- Usar uma rota de referência `/design-system`, sem link no menu público, com metadata `noindex, nofollow`. O acesso direto não requer autenticação, pois o projeto ainda não tem uma área autenticada.
- Manter um registro tipado e explícito da biblioteca próximo a `src/shared/ui/`. Cada entrada associa título, descrição curta, caminho de origem, categorias e uma demonstração React. O catálogo é atualizado pelo autor do componente, evitando convenções frágeis de varredura de arquivos.
- Mostrar tokens de cor, tipografia, espaçamento/breakpoints disponíveis e motion que existam no código. Antes de criar um token, reutilizar ou completar os tokens atuais quando isso preservar a intenção visual existente.
- A demonstração usa o componente de produção real quando houver; estados inexistentes não serão simulados como se fossem suportados.
- Começar pelos componentes compartilhados existentes. Seções e cenas específicas de marketing/3D não entram automaticamente como primitives; sua documentação será decidida ao fatiar o restante do épico.

## Comportamentos e estados

- A rota identifica cada componente pelo nome público de código, descreve sua finalidade e apresenta um link ou caminho legível para o arquivo de origem.
- Variantes e propriedades relevantes são exibidas em exemplos separados ou controles simples de demonstração. A interação na página não altera a aplicação principal.
- O Button permite inspecionar variantes, tamanhos, foco de teclado e estado desabilitado; um estado loading só será documentado/demonstrado se fizer parte do contrato do componente.
- O LanguageSelector permite abrir/fechar e escolher idioma; SkipToContent demonstra seu destino; Container apresenta tamanhos documentados. A biblioteca não executa tracking real nem navegação comercial como efeito colateral.
- Componentes com animação oferecem uma representação compreensível quando o usuário ativa movimento reduzido; conteúdo e controles permanecem funcionais.
- A navegação por seções da biblioteca funciona por teclado, tem hierarquia semântica, foco visível e nomes acessíveis.
- Se um item do catálogo perder seu componente ou demonstração, a validação automatizada falha ou o item é corrigido antes da entrega; não há fallback silencioso para uma amostra genérica.

## Fora de escopo desta fatia

- Redesenhar ou substituir as experiências existentes de Hero, WebGL, vídeo, destinos, Header, FAQ, conteúdo institucional ou Footer.
- Reescrever todas as classes Tailwind existentes para tokens, se isso exigir alterações em componentes de feature fora dos primitives cobertos.
- Criar novas animações de marketing, novos assets, conteúdo institucional ou regras comerciais.
- Transformar a biblioteca num editor visual, playground de código, Storybook ou documentação pública de API completa.
- Considerar o épico #1 inteiro aceito. O restante deve ser refinado em fatias próprias, por exemplo: escala tipográfica/spacing/breakpoints, contratos de CTA e integração progressiva nos fluxos, padrão global de motion/scroll e estados de loading/fallback das experiências.

## Critérios de aceite rastreáveis

| ID    | Critério                                                                                                                                                                                                       | Caminho de validação                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-01 | Tokens semânticos existentes estão centralizados e a biblioteca mostra os tokens de cor, tipografia, raio, sombra, spacing/breakpoints e motion realmente disponíveis; não há cópia divergente dos tokens CSS. | Teste da página/registro e inspeção visual da rota; revisar `tokens.css`.                                                                                                     |
| AC-02 | A rota `/design-system` renderiza os componentes compartilhados do catálogo com nome, propósito e referência de arquivo, além de variantes/estados suportados por cada componente.                             | Teste de integração com as entradas do registro e navegação manual na rota.                                                                                                   |
| AC-03 | A demonstração usa os componentes React reais, e interações locais permitem verificar os estados relevantes sem disparar conversão, analytics externo ou ação de negócio.                                      | Testes de interação e inspeção manual dos controles de cada exemplo.                                                                                                          |
| AC-04 | Um novo componente de `src/shared/ui/` só é considerado documentado quando acompanhado de entrada no catálogo e demonstrações/descrição dos estados aplicáveis.                                                | Teste garantindo cobertura entre exports/contrato de componentes compartilhados e registro, ou validação equivalente documentada se os componentes não tiverem barrel export. |
| AC-05 | Rota e exemplos são utilizáveis em larguras representativas de desktop, tablet e mobile, sem overflow horizontal da biblioteca.                                                                                | Validação visual em 1440px, 768px e 390px; teste de layout quando possível.                                                                                                   |
| AC-06 | Todo controle é alcançável e utilizável por teclado, estados de foco são visíveis e estrutura/nomes acessíveis são expostos semanticamente.                                                                    | Testes de acessibilidade focados e revisão manual por teclado.                                                                                                                |
| AC-07 | Com `prefers-reduced-motion: reduce`, a biblioteca respeita o baseline existente e evita motion não essencial sem retirar conteúdo ou comportamento.                                                           | Teste com media query simulada e revisão visual com movimento reduzido.                                                                                                       |
| AC-08 | `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` passam.                                                                                                                                  | Executar comandos do projeto e anexar seus resultados ao PR.                                                                                                                  |

## Casos de erro e limites

- Com catálogo vazio ou incompleto, a implementação/teste deve apontar o item ausente, em vez de ocultá-lo.
- Se uma demonstração depender de estado ou browser API indisponível, mostrar fallback acessível dentro do exemplo e registrar a limitação; a rota não pode falhar inteira.
- A biblioteca não valida por si só desempenho ou aceitação visual das experiências 3D/vídeo existentes.
- O caminho de origem é referência para desenvolvedores e não deve sugerir que documentação textual substitui o contrato TypeScript.

## Dependências, riscos e decisões abertas

- **Dependências:** nenhuma nova dependência é proposta. Reutilizar React/Next, tokens CSS, Tailwind e Testing Library já instalados.
- **Risco técnico:** o catálogo pode divergir do conjunto de componentes se não houver um ponto verificável de registro. AC-04 exige cobertura automatizada ou mecanismo equivalente explícito.
- **Decisão aprovada:** `/design-system` fica diretamente acessível, fora da navegação comercial e `noindex`; não é área privada nem contém segredo.
- **Decisão de conteúdo:** esta fatia começa com `src/shared/ui/`; a inclusão de seções e cenas específicas no catálogo será uma decisão de fatiamento posterior, sem impedir documentar um primitive quando seu arquivo surgir.

## Estado

Spec aprovada pelo usuário e implementada como primeira fatia do épico. A conclusão global da issue #1 ainda depende de fatias posteriores.

### Evidências locais desta fatia

- AC-01 a AC-04: atendidos para os tokens e componentes de `src/shared/ui/`; os testes validam a lista de cores e o inventário explícito do catálogo.
- AC-05: atendido na rota da biblioteca, verificado em 1440px/768px/390px; o menu aberto do seletor também fica dentro da viewport mobile.
- AC-06: parcial; landmarks, botões e links são semânticos, o primeiro Tab chega ao link para pular conteúdo e o Tab alcança uma opção do seletor. A ativação por teclado e a navegação completa precisam de revisão manual adicional.
- AC-07: atendido para a biblioteca; `prefers-reduced-motion` reduz as transições não essenciais para 0,01 ms.
- AC-08: atendido localmente; lint, typecheck, suíte e build passaram. O lint padrão foi executado ignorando `.superpowers/**`, artefatos temporários da validação que não pertencem ao produto.
- Escopo restante da issue: critérios globais do site e demais componentes/seções do épico ainda não foram entregues por esta fatia.
- Limite residual do AC-04: a validação compara o inventário `sharedUiComponents` com o catálogo. Não descobre automaticamente um novo arquivo ou export esquecido em ambos; o README orienta atualizar inventário e catálogo na mesma mudança.
