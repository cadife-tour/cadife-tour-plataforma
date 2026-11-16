# Hero por destino — uso e revisão da Issue #51

## Executar

Requer Node.js 22 e npm. Após clonar a branch:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para conferir produção:

```sh
npm run build
npm run start
```

A porta pode mudar se a padrão estiver ocupada. Use a URL informada pelo terminal.

## Páginas disponíveis

A landing do Rio (issue #62) usa a rota `/destinos/rio-de-janeiro`, com o vídeo do Rio e as mesmas seções da homepage.

A homepage (`/`, Página 1) começa no Chile e reproduz automaticamente a playlist dos dez destinos, com seleção manual pelos indicadores. Ela usa `TravelExperience` com `autoAdvance`; cada clipe ainda contém sua própria abertura de avião/janela. Nas continuações, o texto do destino permanece visível e o texto das nuvens é suprimido para não sobrepor as duas camadas.

A alternativa `/home-2` (Página 2) usa um vídeo único controlado pela rolagem, com abertura da França uma vez e intervalos reais de nuvens entre os destinos. Tem `noindex`, canonical da homepage e serve à comparação da experiência. A montagem de 89,33 segundos e aproximadamente 24,7 MB é reproduzível por `tools/build-continuous-journey.py`. Ela não substitui a arquitetura modular proposta para a próxima etapa.

A Página 2 também mantém poster e conteúdo em HTML sem carregar o vídeo quando há movimento reduzido, economia de dados ou indicadores disponíveis de aparelho limitado (até 2 GB de memória ou até dois processadores lógicos, seguindo a política da hero principal).

O seletor Página 1 / Página 2 permite comparar as duas versões. Cada destino também tem sua própria Hero na página pública abaixo.

| Destino | Página individual |
| --- | --- |
| Chile / Andes | /destinos/chile |
| Argentina / Buenos Aires | /destinos/argentina |
| Peru / Machu Picchu | /destinos/peru |
| Cruzeiros | /destinos/cruzeiros |
| Portugal / Lisboa | /destinos/portugal |
| Espanha | /destinos/espanha |
| França / Paris | /destinos/franca |
| Itália / Roma | /destinos/italia |
| Brasil / Rio de Janeiro | /destinos/rio-de-janeiro |
| Resorts / Praia | /destinos/resorts |

As dez páginas individuais estão no sitemap.

## Usar em uma página

```tsx
<TravelExperience mode="single" targetDestination="portugal" />
<TravelExperience mode="full" />
<TravelExperience mode="single" targetDestination="chile" autoAdvance />
```

Componente: src/features/travel-experience/TravelExperience.tsx. Sem `autoAdvance`, o modo single monta somente o vídeo do destino. O modo full usa a ordem de journeyScenes.ts, carrega os seguintes por proximidade e mantém uma única abertura/h1; esse modo continua disponível no componente, mas não é o modo da homepage atual. Com `autoAdvance`, a Página 1 percorre a playlist e antecipa a próxima mídia. Slug desconhecido no componente retorna Chile; uma URL de destino desconhecida retorna 404.

## Configuração e mídias versionadas

- config/travelExperienceConfig.ts: conteúdo PT/EN/ES, CTA e associação do destino à mídia.
- assets/assetManifest.ts: caminhos dos vídeos, posters e stills.
- config/journeyScenes.ts: duração de scroll mobile/desktop, início do trecho em continuidade, revelação, retenção e saída por cena. Valores de progresso são normalizados; os segundos vêm da duração real do MP4.
- components/TravelOverlay.tsx: títulos e CTAs em HTML, fora do vídeo.

Os nove novos MP4, nove posters e nove stills estão em public/assets/hero/destinations/. O conjunto do Chile está em public/assets/hero/. Esses derivados devem acompanhar o commit e funcionar após um clone limpo; a pasta videos/ contém somente fontes locais e é ignorada. paris.mp4 corresponde a franca; resort.mp4 corresponde a resorts. Os vídeos usados são H.264 720p/24fps, sem áudio, com fast start e keyframes próximos para seeking.

## Conferência dos critérios da #51

| Critério | Implementação |
| --- | --- |
| Manifesto por destino | Dez destinos com mídia e conteúdo próprios |
| Full e single | Homepage em playlist automática, dez páginas individuais em single e modo full por scroll disponível no componente |
| Abertura compartilhada | Mesmo componente, abertura única no full |
| Carregar somente o necessário | Single isolado; full carrega cenas próximas |
| Headline/CTA/duração/saída | Conteúdo localizado e manifesto de tempos |
| Mobile/reduced motion | Alturas próprias e sequência estática com CTAs |
| Reuso da engine | Full e single compartilham controlador; a alternativa /home-2 tem controlador experimental separado |
| Scroll reverso | Timeline GSAP bidirecional e cleanup ao desmontar |

## Como testar

1. Abrir a homepage; confirmar a abertura com o vídeo do Chile, avanço automático pelos dez destinos e seleção manual. Em todos os clipes, nuvens e título do destino não devem aparecer simultaneamente.
2. Abrir `/home-2`; rolar lentamente e rapidamente, inverter o scroll e retornar ao topo. Confirmar a abertura única da França e as nove passagens exclusivas pelas nuvens. Recarregar no meio da jornada e verificar que a posição não salta para o rodapé.
3. Abrir cada página individual: somente seu vídeo deve ser solicitado, com título e WhatsApp corretos.
4. Trocar PT/EN/ES e confirmar rótulos e mensagens de WhatsApp.
5. Ativar prefers-reduced-motion no navegador e recarregar: painéis estáticos preservam conteúdo e CTAs sem vídeo. Save-data, aparelho limitado ou erro de mídia também usam fallback.
6. Conferir mobile/portrait/landscape, foco por teclado e a passagem da Hero para o conteúdo da página.
7. Na aba Network, conferir somente o vídeo selecionado nas páginas individuais; na Página 1, vídeo atual e antecipação do próximo; na Página 2, o único arquivo montado. Verificar ausência de arquivos 404.

## Validações e limites

Checks obrigatórios: npm run lint, npm run format:check, npm run typecheck, npm run test e npm run build. A suíte inclui regressões de full/single, isolamento da mídia por destino, montagem da Página 2, restauração de altura antes da hidratação e exclusividade dos textos nos dez destinos em PT/EN/ES. O número de testes e seus resultados devem ser registrados na entrega da versão efetivamente revisada.

A avaliação visual em viewport desktop não substitui profiling em Android/iOS físicos nem aceite editorial de cada transição. A fonte dos vídeos pode exigir ajustes visuais posteriores; não há afirmação de FPS ou orçamento de memória medido. As issues de QA/performance e as landings SEO mantêm seus próprios critérios. Esta PR não faz deploy nem encerra outras issues automaticamente.

## Evolução proposta após estabilizar a baseline

O estudo técnico da Hero de 06/11/2026 propõe evoluir a mídia depois de estabilizar a PR #70, em uma issue própria. Preservar a engine existente e avaliar Intro compartilhada, CloudTransition reutilizável e destinos sem abertura/transição embutida, com composição CURRENT/NEXT determinística por scroll.

Essa evolução também deve avaliar manifesto com variantes e focal point, seleção por resolução/orientação/capacidade, mídia vertical quando o crop perder o assunto, preload/unload limitado às cenas próximas e Skip Intro por fase/âncora. Hoje os assets são H.264 720p/24fps; ainda não há entrega adaptativa ou master vertical dedicado. A Página 2 concatena o filme inteiro e permanece uma alternativa experimental, não a implementação desse pipeline modular.

Não adicionar geração 4K, CDN, novas dependências, contratação de IA ou escopo B2B à PR atual por antecipação. Esses itens precisam de decisão conjunta e escopo próprio. O arquivo de estudo registra referências comerciais de uma data específica; preço, recursos, direitos de uso e capacidade devem ser confirmados antes de qualquer contratação.

Antes da integração, atualizar a branch com os ajustes aprovados da `developer` (incluindo a PR #72), resolver o conflito de header com a PR #71 quando ela estiver pronta e repetir o gate de qualidade na versão combinada. A descrição da PR #70 também deve acompanhar as rotas e o comportamento realmente entregues; `/hero-preview/*` não descreve as rotas atuais.
