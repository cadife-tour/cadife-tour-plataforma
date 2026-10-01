# Hero — decisão técnica da POC Avião → Nuvens → Andes

- **Issue:** [#8 — Validar arquitetura técnica da Hero](https://github.com/cadife-tour/cadife-tour-plataforma/issues/8)
- **Dependências:** épica #3 e storyboard #7.
- **Escopo desta decisão:** as três primeiras cenas, em percurso único. As demais paradas e os modos de jornada completa/destino único continuam definidos editorialmente no storyboard, mas não são implementados por esta POC.

## Decisão

Usar **vídeo único com composição leve em HTML/CSS** para a POC. O clipe de oito segundos fornece cabine, janela, nuvens e movimento sobre os Andes; uma camada de nuvens em CSS suaviza a passagem. Headline e CTA permanecem em HTML/React. Poster e último frame do próprio clipe são usados apenas no fallback estático. Não há ganho comprovado que justifique Three.js/GLTF nesta cena; os componentes 3D experimentais existentes não entram no caminho de produção da Hero.

As headlines, apoios e o CTA do Chile em PT/EN/ES seguem as propostas do storyboard #7. Permanecem sujeitos à validação editorial indicada naquele documento.

O progresso de scroll é a única fonte de tempo: GSAP/ScrollTrigger controla o vídeo de 0 a aproximadamente 7,96 s durante os primeiros 85% da seção; os 15% finais mantêm o último quadro com o CTA. O seek ignora diferenças inferiores a meio quadro de 24 fps. A posição visual volta ao início quando o visitante rola para trás. A experiência não exige WebGL.

Para `prefers-reduced-motion`, economia de dados, `deviceMemory <= 2 GiB`, `hardwareConcurrency <= 2` ou erro de mídia, a Hero apresenta três painéis estáticos em fluxo normal, com as mesmas informações e ações. Os dois indicadores de capacidade são heurísticas disponíveis somente em alguns navegadores; sua ausência não prova que o aparelho seja potente. A falha de mídia é tratada mesmo quando a heurística não a detecta.

O layout geral ainda contém a camada decorativa `VisualJourney` em WebGL, separada da Hero. Ela usa a mesma detecção de capacidade e não monta nem consulta o contexto WebGL em movimento reduzido, economia de dados ou aparelho limitado. Em desktop capaz, esse canvas opcional ainda pode disputar recursos com o vídeo; o teste físico deve medir o conjunto antes de ampliar a jornada.

## Comparação e melhoria do vídeo

| Abordagem                | Resultado observado                                                                                                                                                       | Custo / limite                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Vídeo único anterior     | 6 s, 5.137.793 bytes, áudio desnecessário e imagem menos satisfatória para a Hero.                                                                                        | Mais bytes e busca entre quadros distantes.                                                     |
| Composição escolhida     | MP4 H.264 de 8 s, 3.918.111 bytes, sem áudio, keyframe a cada 0,25 s; poster WebP de 49.344 bytes; still WebP de 59.762 bytes. Total: 4.027.217 bytes (redução de 21,6%). | A fonte é 720p e a composição em CSS deve acompanhar o movimento do clipe.                      |
| Three.js/GLTF em runtime | Sem necessidade funcional: o vídeo já fornece movimento e profundidade na POC.                                                                                            | Acrescentaria carga de GPU, renderizador, geometria e fallback sem um ganho visual demonstrado. |

O MP4 de oito segundos foi reencodado do clipe fornecido pelo usuário, gerado no Google Flow, em 1280×720/24 fps com GOP de seis quadros e sem trilha de áudio. O poster foi extraído em 0,10 s e o still dos Andes em 7,70 s da mesma fonte. A codificação permite busca mais próxima do quadro solicitado e reduz a transferência total. **Não recupera detalhes que já faltam na fonte 720p**: uma versão visualmente mais nítida exigirá vídeo de origem melhor nas tarefas de assets #9 e #10. A fonte original local não é versionada; os derivados estão no repositório.

## Verificação representativa

O clipe de oito segundos contém 192 quadros e 32 keyframes, um a cada 0,25 s; a decodificação integral por FFmpeg terminou sem erro. Em build de produção no navegador, a sequência foi percorrida para frente e para trás em desktop (1280×720) e viewport móvel (390×844): cabine no início, nuvens na passagem e Andes com headline/CTA ao final. O vídeo alcançou o tempo solicitado após cada salto de scroll; em saltos de página abruptos, o quadro anterior ainda ficou visível por um instante enquanto o navegador decodificava o novo. Isso não foi percebido no percurso estabilizado, mas precisa ser medido em dispositivos físicos. O teste em navegador verifica o resultado visual e a busca, **não** FPS ou energia; a duração das chamadas de automação não é uma medição confiável de decodificação.

Testes automatizados cobrem o conteúdo acessível e CTA no fallback de movimento reduzido, economia de dados, CPU limitada e erro de vídeo. Lint, formatação dos arquivos alterados, typecheck, suíte de testes e build são requisitos para preparar a PR. O `format:check` global possui arquivos preexistentes fora deste escopo; registrar o resultado exato da execução na PR.

## Trade-offs e escala

Cada destino futuro deve ter um registro de cena com intervalo de scroll, mídia otimizada, poster/still, texto localizado, CTA contextual e fallback estático. O mesmo controlador de progresso pode dirigir a mídia e as camadas; não é preciso criar um renderizador 3D por destino. A jornada completa exige validar orçamento total de bytes, lazy loading por parada e o modo de destino único antes de adicionar os demais assets. A #8 não aprova a qualidade final da fonte atual nem a expansão para dez destinos.

**Pendências para aceite final em dispositivos reais:** medir FPS/long tasks, uso de memória, tempo até o primeiro quadro e seeking em Android/iOS representativos, incluindo aparelho de entrada e conexão lenta. O navegador desktop com viewport reduzido não substitui esses testes. Se houver engasgos graves, reduzir ainda mais o número de seeks, criar uma variante de menor resolução ou priorizar o fallback estático antes de aumentar o número de destinos.
