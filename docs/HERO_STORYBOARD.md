# Hero — storyboard editorial da jornada completa

- **Issue:** [#7 — Consolidar storyboard e copy da Hero imersiva](https://github.com/cadife-tour/cadife-tour-plataforma/issues/7)
- **Estado:** proposta editorial pronta para validação; nenhuma headline de destino é apresentada como aprovada pela CADIFE Tour.
- **Fonte da issue:** descrição e critérios de aceite da issue #7, consultados no GitHub em 26/09/2026.
- **Dependência declarada na issue:** épica #3 — Hero / Jornada imersiva.
- **Próxima validação:** spike #8 — viabilidade técnica de Avião → Nuvens → Andes.

## 1. Intenção e limites

A Hero começa na cabine de um avião, atravessa a janela e as nuvens, revela dez opções de viagem, repousa em um resort e entrega o visitante à seção **Sua viagem em movimento**. A progressão deve despertar curiosidade, mostrar variedade e oferecer atendimento humano via WhatsApp em cada parada. O visitante pode sair da jornada a qualquer momento.

Este é o roteiro de conteúdo e produção da homepage (`full journey`). A landing de destino reutiliza a mesma estrutura em percurso curto (`single destination`: abertura → nuvens → destino → CTA/conteúdo). A #8 deve validar se a estratégia de mídia e a duração de scroll propostas são viáveis; os percentuais abaixo são uma especificação editorial inicial, não uma medição de performance.

**Decisões de marca:** Bai Jamjuree em títulos e CTA, Roboto nos textos, cores oficiais e logo oficial sem alteração. Reservar área de leitura sobre a mídia e conferir contraste cena a cena. Headline, apoio e CTA são HTML/React, jamais texto embutido em vídeo ou canvas.

## 2. Contrato comum de cena

Cada linha da sequência e cada cartão de cena abaixo entregam a motion, assets e frontend:

1. identificador estável, intervalo de progresso normalizado e destino/ponte seguinte;
2. objetivo narrativo, enquadramento e elemento que liga uma cena à próxima;
3. headline e apoio em PT/EN/ES, com status editorial **proposta**;
4. ação e destino do CTA, além do tipo de mídia e fallback;
5. área segura para texto, composição mobile e representação sem movimento.

Os intervalos usam o progresso da **Hero completa**, de 0 a 100, e são contíguos. Em cada parada de destino: a entrada ocupa aproximadamente os primeiros 20% do seu intervalo; a composição permanece estável nos 60% centrais para leitura e acionamento do CTA; a saída ocupa os 20% finais. A duração efetiva em pixels e os fades serão ajustados na #8 depois de teste em dispositivo real. Não prender a rolagem nem fazer uma cena depender da conclusão da animação anterior.

| Ordem | ID          | Progresso | Cena / função                          | Ponte de saída                              | Asset relacionado                                 |
| ----- | ----------- | --------: | -------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| 01    | `airplane`  |      0–9% | Cabine; convite inicial                | A janela se torna o foco                    | Vídeo POC existente; versão final a validar na #8 |
| 02    | `window`    |     9–15% | Passagem do interior ao horizonte      | Nuvens cobrem o quadro                      | Mesmo plano de abertura; #8                       |
| 03    | `clouds`    |    15–22% | Suspensão e expectativa                | Silhueta dos Andes emerge                   | Sistema de nuvens #9                              |
| 04    | `chile`     |    22–29% | Primeira revelação e prova do conceito | Nuvens/horizonte levam à cidade             | Cordilheira #10                                   |
| 05    | `argentina` |    29–36% | Energia urbana                         | Movimento da rua conduz a outro horizonte   | Buenos Aires #16                                  |
| 06    | `peru`      |    36–43% | Descoberta e altitude                  | Névoa recobre a paisagem                    | Machu Picchu #17                                  |
| 07    | `cruzeiros` |    43–50% | Mudança de ritmo: mar                  | Linha do horizonte vira costa               | Navio #18                                         |
| 08    | `portugal`  |    50–57% | Encontro com patrimônio e costa        | Textura arquitetônica abre a próxima cidade | Torre de Belém #20                                |
| 09    | `espanha`   |    57–64% | Vida urbana e encontro                 | Movimento de praça/rua conduz à torre       | Símbolo visual #21                                |
| 10    | `franca`    |    64–71% | Reconhecimento e descoberta            | Linhas da torre viram nova arquitetura      | Torre Eiffel #22                                  |
| 11    | `italia`    |    71–78% | História em escala humana              | Arcos e luz conduzem à paisagem brasileira  | Coliseu #23                                       |
| 12    | `brasil`    |    78–85% | Retorno afetivo e amplitude            | Céu/litoral abrem a cena de descanso        | Cristo Redentor #25                               |
| 13    | `resort`    |    85–94% | Pausa e convite à escolha              | Cena abre espaço para conteúdo da página    | Resort / praia #26                                |
| 14    | `exit`      |   94–100% | Encerrar a viagem visual               | **Sua viagem em movimento**                 | Composição HTML/CSS; #19                          |

O foco na **janela** é um beat interno da transição **Avião → Nuvens** pedida na issue. Ele mantém a continuidade espacial da narrativa e não exige uma cena de destino adicional.

## 3. Abertura e passagem para as nuvens

### `airplane` — dentro do avião, 0–9%

- **Objetivo visual/narrativo:** aproximar o visitante da sensação de partida. Mostrar interior de cabine com a janela legível, sem pessoa ou marca de companhia aérea inventada. O enquadramento mantém uma área de leitura livre do lado oposto à janela.
- **Copy PT:** headline **“Uma nova experiência. Uma nova memória.”**; apoio **“O mundo começa do outro lado da janela.”**
- **Copy EN:** headline **“A new experience. A new memory.”**; apoio **“The world begins on the other side of the window.”**
- **Copy ES:** headline **“Una nueva experiencia. Un nuevo recuerdo.”**; apoio **“El mundo comienza al otro lado de la ventana.”**
- **Ação:** indicador **“Role para começar sua viagem”** / **“Scroll to begin your journey”** / **“Desliza para comenzar tu viaje”**. É orientação de rolagem, não botão. Manter acesso direto à navegação e ao atendimento mesmo antes de rolar.
- **Mídia proposta:** vídeo de abertura com texto HTML. A POC #8 usa um clipe de 8 s, 1280×720, ~3,9 MB, gerado no Google Flow e otimizado para busca por quadros. Poster e frame estático dos Andes servem ao fallback. Não tratar o clipe atual como cobertura das dez paradas.

### `window` — passagem, 9–15%

- **Objetivo visual/narrativo:** levar a atenção até a janela, mantendo a continuidade espacial da cabine. A frase de apoio da abertura pode permanecer durante o começo deste beat e sair antes das nuvens; não duplicar a headline.
- **Copy PT:** **“A viagem ganha outro horizonte.”** Apoio: “A janela aproxima o que antes parecia distante.”
- **Copy EN:** **“A new horizon comes into view.”** Support: “The window brings distant places closer.”
- **Copy ES:** **“El viaje encuentra otro horizonte.”** Apoyo: “La ventana acerca lo que antes parecía lejano.”
- **Exibição:** a nova headline entra após a saída da headline inicial; a frase de apoio da abertura pode permanecer no início do beat, mas não deve disputar espaço com o novo texto.
- **Mídia proposta:** continuação do plano de abertura e composição HTML/CSS; poster/corte estático no fallback.
- **Transição:** aproximação progressiva da janela → nuvens preenchem o quadro. O scroll reverso retorna ao mesmo enquadramento, sem salto de estado.

### `clouds` — suspensão, 15–22%

- **Objetivo visual/narrativo:** criar uma breve pausa antes da primeira revelação. Camadas de nuvens deixam um espaço de leitura; a cena não vira uma espera vazia.
- **Copy PT:** **“Além das nuvens, novos caminhos.”** Apoio: “Uma jornada de possibilidades começa a ganhar forma.”
- **Copy EN:** **“Beyond the clouds, new paths.”** Support: “A journey of possibilities begins to take shape.”
- **Copy ES:** **“Más allá de las nubes, nuevos caminos.”** Apoyo: “Un viaje de posibilidades comienza a tomar forma.”
- **Mídia proposta:** composição híbrida leve de nuvens #9 (camadas de imagem e/ou trecho de vídeo, conforme #8). Nenhum 3D é obrigatório nesta proposta. Fallback: imagem estática com texto legível.
- **Transição:** abrir a massa de nuvens para a silhueta da Cordilheira dos Andes, preservando direção e horizonte.

## 4. Paradas de destino

Para todas as paradas abaixo, o CTA visível é **“Quero conhecer esta opção”** / **“Explore this option”** / **“Quiero conocer esta opción”**. A ação abre o WhatsApp em nova aba com mensagem contextual no idioma ativo e identificador da parada, usando o componente compartilhado e a configuração de contato aprovada. Se o contato não estiver configurado/validado, a implementação deve usar o caminho seguro de contato já previsto no projeto; o storyboard não estabelece número. Fonte analítica proposta: `hero_<id>`. O CTA é um link focável, com foco visível, nome acessível que inclui o destino e área de toque de aproximadamente 44 px. Somente a cena ativa entra na ordem de tabulação; uma navegação de destinos fora da experiência animada mantém as opções acessíveis.

### `chile` — Cordilheira dos Andes, 22–29%

- **Objetivo visual/narrativo:** primeira grande revelação; escala da paisagem após a pausa nas nuvens. Área de leitura sobre céu ou scrim, nunca sobre o relevo mais importante.
- **PT:** **“Chile: diante da imensidão dos Andes.”** Apoio: “Montanhas e horizontes que convidam a ir mais longe.”
- **EN:** **“Chile: before the vast Andes.”** Support: “Mountains and horizons that invite you to go further.”
- **ES:** **“Chile: ante la inmensidad de los Andes.”** Apoyo: “Montañas y horizontes que invitan a ir más lejos.”
- **Mídia:** imagem da Cordilheira #10 com composição/entrada pelas nuvens; 3D opcional apenas se a #8 comprovar ganho e custo aceitável. Fallback: imagem estática. **CTA:** contexto `chile`.

### `argentina` — Buenos Aires, 29–36%

- **Objetivo visual/narrativo:** trocar a escala natural pela energia de cidade. Composição de rua/arquitetura de Buenos Aires com espaço para tipografia.
- **PT:** **“Argentina: a cidade chama para viver.”** Apoio: “Buenos Aires abre caminho para encontros e descobertas.”
- **EN:** **“Argentina: a city that invites you in.”** Support: “Buenos Aires makes room for encounters and discoveries.”
- **ES:** **“Argentina: una ciudad que invita a vivir.”** Apoyo: “Buenos Aires abre camino a encuentros y descubrimientos.”
- **Mídia:** imagem #16 com leve composição de camadas; fallback imagem estática. **CTA:** contexto `argentina`.

### `peru` — Machu Picchu, 36–43%

- **Objetivo visual/narrativo:** desacelerar para uma paisagem histórica e elevada. Revelar o sítio com névoa suave sem ocultar sua forma reconhecível.
- **PT:** **“Peru: caminhos que atravessam o tempo.”** Apoio: “Machu Picchu convida a olhar a paisagem e a história de outro lugar.”
- **EN:** **“Peru: paths through time.”** Support: “Machu Picchu invites a new view of landscape and history.”
- **ES:** **“Perú: caminos que atraviesan el tiempo.”** Apoyo: “Machu Picchu invita a mirar el paisaje y la historia desde otro lugar.”
- **Mídia:** imagem #17 com névoa em composição leve; fallback imagem estática. **CTA:** contexto `peru`.

### `cruzeiros` — mar e navio, 43–50%

- **Objetivo visual/narrativo:** trocar altitude por amplitude do oceano e dar um respiro de ritmo. Navio identificável, horizonte limpo e texto sobre área contrastante.
- **PT:** **“Cruzeiros: a viagem também é o destino.”** Apoio: “O horizonte muda enquanto novos lugares se aproximam.”
- **EN:** **“Cruises: the journey is part of the destination.”** Support: “The horizon shifts as new places draw near.”
- **ES:** **“Cruceros: el viaje también es el destino.”** Apoyo: “El horizonte cambia mientras se acercan nuevos lugares.”
- **Mídia:** imagem #18; movimento discreto de horizonte apenas se aprovado na #8. Fallback imagem estática. **CTA:** contexto `cruzeiros`.

### `portugal` — Torre de Belém, 50–57%

- **Objetivo visual/narrativo:** introduzir patrimônio, luz e costa europeia. A torre ancora a leitura da cena.
- **PT:** **“Portugal: histórias à beira do Atlântico.”** Apoio: “Lisboa convida a caminhar entre memória e novos caminhos.”
- **EN:** **“Portugal: stories by the Atlantic.”** Support: “Lisbon invites you to walk between memory and new paths.”
- **ES:** **“Portugal: historias junto al Atlántico.”** Apoyo: “Lisboa invita a caminar entre la memoria y nuevos caminos.”
- **Mídia:** imagem #20 e composição leve; fallback imagem estática. **CTA:** contexto `portugal`.

### `espanha` — símbolo visual a definir, 57–64%

- **Objetivo visual/narrativo:** manter energia humana após a cena arquitetônica de Portugal. Brief para #21: espaço público/rua com leitura imediata de Espanha, sem usar símbolo não aprovado ou confundir a cidade representada.
- **PT:** **“Espanha: cada encontro abre um caminho.”** Apoio: “Ruas, cultura e novos olhares convidam a seguir.”
- **EN:** **“Spain: every encounter opens a path.”** Support: “Streets, culture, and new perspectives invite you onward.”
- **ES:** **“España: cada encuentro abre un camino.”** Apoyo: “Calles, cultura y nuevas miradas invitan a continuar.”
- **Mídia:** imagem #21, composição leve; fallback imagem estática. **CTA:** contexto `espanha`.

### `franca` — Torre Eiffel, 64–71%

- **Objetivo visual/narrativo:** criar reconhecimento rápido sem transformar a imagem em cartão postal genérico. Torre legível, pessoa não necessária.
- **PT:** **“França: novos olhares sobre o inesquecível.”** Apoio: “Paris revela detalhes a cada passo.”
- **EN:** **“France: a fresh view of the unforgettable.”** Support: “Paris reveals details at every turn.”
- **ES:** **“Francia: nuevas miradas a lo inolvidable.”** Apoyo: “París revela detalles a cada paso.”
- **Mídia:** imagem #22; fallback imagem estática. **CTA:** contexto `franca`.

### `italia` — Coliseu, 71–78%

- **Objetivo visual/narrativo:** trazer a escala monumental para uma percepção próxima e humana. Arcos do Coliseu orientam a transição.
- **PT:** **“Itália: histórias que continuam vivas.”** Apoio: “Roma oferece novas perspectivas a cada encontro.”
- **EN:** **“Italy: stories that remain alive.”** Support: “Rome offers a new perspective with every encounter.”
- **ES:** **“Italia: historias que siguen vivas.”** Apoyo: “Roma ofrece nuevas perspectivas en cada encuentro.”
- **Mídia:** imagem #23; fallback imagem estática. **CTA:** contexto `italia`.

### `brasil` — Cristo Redentor, 78–85%

- **Objetivo visual/narrativo:** aproximar a jornada de casa e abrir o horizonte antes do descanso final. Monumento e paisagem do Rio reconhecíveis.
- **PT:** **“Brasil: a beleza de descobrir de perto.”** Apoio: “Novos caminhos também começam por aqui.”
- **EN:** **“Brazil: the beauty of discovering nearby.”** Support: “New paths can begin here, too.”
- **ES:** **“Brasil: la belleza de descubrir de cerca.”** Apoyo: “Los nuevos caminos también pueden comenzar aquí.”
- **Mídia:** imagem #25; fallback imagem estática. **CTA:** contexto `brasil`.

### `resort` — praia e pausa final, 85–94%

- **Objetivo visual/narrativo:** encerrar com descanso e espaço aberto, sem sugerir hotel, pacote ou condição comercial específica. A composição deve abrir visualmente para a seção seguinte.
- **PT:** **“Seu próximo momento começa aqui.”** Apoio: “Encontre uma viagem que combine com a sua maneira de viver.”
- **EN:** **“Your next moment begins here.”** Support: “Find a journey that fits the way you want to travel.”
- **ES:** **“Tu próximo momento comienza aquí.”** Apoyo: “Encuentra un viaje que combine con tu forma de viajar.”
- **Mídia:** imagem #26 com movimento ambiental discreto se aprovado; fallback imagem estática. **CTA:** contexto `resort`.

## 5. Saída para “Sua viagem em movimento”, 94–100%

### `exit` — ponte para o conteúdo, 94–100%

- **Objetivo visual/narrativo:** encerrar a sequência sem corte brusco ou tela vazia. A imagem do Resort perde protagonismo e o primeiro bloco de conteúdo entra na leitura natural da página. A seção seguinte preserva seu próprio título HTML e aparece sem depender de WebGL ou vídeo.
- **Copy PT:** chamada de passagem **“Sua viagem em movimento”**; apoio **“Veja como uma ideia de viagem se transforma em experiência.”**
- **Copy EN:** **“Your journey in motion”**; support **“See how a travel idea becomes an experience.”**
- **Copy ES:** **“Tu viaje en movimiento”**; apoyo **“Descubre cómo una idea de viaje se convierte en experiencia.”**
- **Ação:** o CTA do Resort continua utilizável até a transição de foco. Depois, a navegação segue para os links/CTAs da seção #19. Não criar um segundo botão de WhatsApp sem função distinta.
- **Mídia:** HTML/CSS da próxima seção; imagem anterior pode desaparecer. Fallback: fluxo de documento normal.

## 6. Comportamento por capacidade e tamanho de tela

| Contexto                                              | Percurso e mídia                                                                                                                                                                                                                                                   | Conteúdo e interação                                                                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop com movimento                                 | 14 beats na ordem da tabela; GSAP/ScrollTrigger somente se #8 validar scrubbing e scroll reverso. Abertura primeiro, cena seguinte em prefetch, cenas distantes progressivamente.                                                                                  | Uma headline e um CTA de destino por vez. Conteúdo HTML com contraste e área segura; sem scroll preso.                                                   |
| Mobile com movimento                                  | Abertura curta + passagem pelas nuvens; as dez paradas seguem em painéis verticais no fluxo normal, com imagem responsiva e transição curta. Preservar a ordem da tabela sem impor 14 pausas de scroll sticky. A #8 valida a composição e eventuais efeitos leves. | Texto em blocos curtos, CTA na área alcançável e alvo de toque ~44 px. Nada depende de hover. Não ocultar conteúdo abaixo da Hero.                       |
| `prefers-reduced-motion`, sem WebGL ou falha de mídia | Composição estática em fluxo normal: abertura + grade/lista simples dos dez destinos + ponte para **Sua viagem em movimento**. Um `single destination` mostra abertura + destino escolhido + CTA.                                                                  | Todas as headlines, apoios e CTAs permanecem acessíveis em HTML. Sem scrub, parallax ou animação contínua. Links funcionam por teclado e leitor de tela. |

**Carga de mídia:** nenhuma parada distante deve baixar antes de ser necessária. O modo `single destination` carrega apenas abertura e destino escolhido. Cada mídia visual precisa de imagem fallback/poster, dimensões adequadas e tratamento de falha. A #8 mede LCP, CLS, INP, tarefas longas, memória e fluidez real em mobile/cache frio antes de fixar formato ou altura em `vh`.

## 7. Handoff e validação

### Motion / #8

- Validar Avião → Janela → Nuvens → Andes com ida e volta, scroll lento e rápido, resize e cache frio.
- Confirmar se vídeo de abertura + imagens/composição de destinos funciona melhor que um vídeo único da jornada; registrar custo, limites e fallback. A proposta editorial não exige Three.js.
- Ajustar percentuais e tempo de leitura em desktop e mobile a partir de testes reais, mantendo ordem e contrato de copy.

### Assets / #9, #10, #16–#18, #20–#23, #25–#26

- Produzir a cena para o enquadramento descrito; entregar versão apropriada a desktop, mobile, poster/fallback e área segura para texto. Usar os assets oficiais da marca e verificar direitos de uso de toda fotografia/ilustração.
- Nenhuma headline ou CTA deve ser renderizada dentro do asset.

### Frontend / #24 e #19

- Modelar as cenas por dados/manifest com `id`, intervalo, copy localizada, chave de asset, `destinationContext`, fallback e transição. A engine suporta `full` e `single` sem cópia por destino.
- Conectar CTA por destino ao helper compartilhado; confirmar número oficial/configuração antes da publicação. Manter seção seguinte no fluxo HTML.

### Revisão editorial e aceite da #7

| Critério da issue                                       | Evidência neste storyboard                                                               | Estado                          |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------- |
| Todas as cenas com objetivo visual e narrativo          | Seções 3–5, inclusive abertura, dez destinos e saída                                     | Pronto para revisão             |
| Headlines aprovadas ou prontas para validação           | PT/EN/ES em cada cena; todas marcadas como proposta                                      | Pronto para validação editorial |
| CTAs com intenção e comportamento                       | Indicador de scroll na abertura, CTA contextual comum nos dez destinos, saída na seção 5 | Pronto para revisão funcional   |
| Começo, desenvolvimento e encerramento coerentes        | Ordem e pontes da seção 2; abertura, variedade, descanso e seção seguinte                | Pronto para revisão editorial   |
| Uso direto por motion/assets/frontend                   | Percentuais, IDs, composição, tipo de mídia, tickets e handoff nas seções 2–7            | Pronto para revisão das equipes |
| Dependência de vídeo, imagem, 3D ou híbrido documentada | Tipo de mídia por beat e decisão a confirmar na #8                                       | Proposta técnica pendente da #8 |

**Pendências para aprovação:** CADIFE Tour/PO devem validar as headlines e os apoios propostos, a representação visual da Espanha, a cadência de dez destinos e o contato oficial usado pelos CTAs. A #8 deve confirmar a viabilidade da mídia e do scroll. Estes itens não impedem que a #7 seja apresentada como _versão pronta para validação_, conforme o critério da issue; impedem afirmar aprovação final ou performance comprovada.

**Diferença conhecida para o código atual:** `TravelOverlay.tsx` narra abertura, nuvens e Chile; `TravelExperience` usa um vídeo de seis segundos e ainda não implementa o percurso completo nem os modos `single`/`full`. Portanto, este storyboard especifica trabalho futuro e não descreve a Hero completa como já implementada.
