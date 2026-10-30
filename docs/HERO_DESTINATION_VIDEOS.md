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

Homepage /: jornada completa, na ordem Chile → Argentina → Peru → Cruzeiros → Portugal → Espanha → França → Itália → Brasil → Resorts. Uma única abertura de avião; os demais clipes entram pela travessia de nuvens. Role para avançar e volte para retornar.

| Destino | Página individual |
| --- | --- |
| Chile / Andes | /hero-preview/chile |
| Argentina / Buenos Aires | /hero-preview/argentina |
| Peru / Machu Picchu | /hero-preview/peru |
| Cruzeiros | /hero-preview/cruzeiros |
| Portugal / Lisboa | /hero-preview/portugal |
| Espanha | /hero-preview/espanha |
| França / Paris | /hero-preview/franca |
| Itália / Roma | /hero-preview/italia |
| Brasil / Rio de Janeiro | /hero-preview/brasil |
| Resorts / Praia | /hero-preview/resorts |

As páginas individuais são prévias sem indexação (noindex, nofollow), fora do sitemap. Não substituem o conteúdo editorial e SEO das landings finais, previsto nas issues #50 e #52–#64.

## Usar em uma página

```tsx
<TravelExperience mode="single" targetDestination="portugal" />
<TravelExperience mode="full" />
```

Componente: src/features/travel-experience/TravelExperience.tsx. O modo single monta somente o vídeo do destino. O modo full usa a ordem de journeyScenes.ts, carrega os seguintes por proximidade e mantém uma única abertura/h1. Slug desconhecido no componente retorna Chile; uma URL de prévia desconhecida retorna 404.

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
| Full e single | Homepage completa e dez prévias isoladas |
| Abertura compartilhada | Mesmo componente, abertura única no full |
| Carregar somente o necessário | Single isolado; full carrega cenas próximas |
| Headline/CTA/duração/saída | Conteúdo localizado e manifesto de tempos |
| Mobile/reduced motion | Alturas próprias e sequência estática com CTAs |
| Sem duplicação de engine | Mesmo controlador de cena nos dois modos |
| Scroll reverso | Timeline GSAP bidirecional e cleanup ao desmontar |

## Como testar

1. Abrir a homepage; confirmar avião, nuvens e os dez destinos na ordem acima.
2. Rolar lentamente e rapidamente, inverter o scroll e retornar ao topo.
3. Abrir cada página individual: somente seu vídeo deve ser solicitado, com título e WhatsApp corretos.
4. Trocar PT/EN/ES e confirmar rótulos e mensagens de WhatsApp.
5. Ativar prefers-reduced-motion no navegador e recarregar: painéis estáticos preservam conteúdo e CTAs sem vídeo. Save-data, aparelho limitado ou erro de mídia também usam fallback.
6. Conferir mobile/portrait/landscape, foco por teclado e a saída do Resort para o conteúdo da homepage.
7. Na aba Network, conferir carregamento por proximidade e ausência de arquivos 404.

## Validações e limites

Checks obrigatórios: npm run lint, npm run format:check, npm run typecheck, npm run test e npm run build. A revisão anterior validou 118 testes (116 existentes e dois novos), build, uma mídia inicial na homepage, h1 único, ordem das dez cenas, avanço Argentina/Peru e retorno ao início; Resorts individual carregou somente seu próprio vídeo. Esta publicação repete os checks na base atual.

A avaliação visual em viewport desktop não substitui profiling em Android/iOS físicos nem aceite editorial de cada transição. A fonte dos vídeos pode exigir ajustes visuais posteriores; não há afirmação de FPS ou orçamento de memória medido. As issues de QA/performance e as landings SEO mantêm seus próprios critérios. Esta PR não faz deploy nem encerra outras issues automaticamente.
