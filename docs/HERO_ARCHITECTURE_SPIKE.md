# Hero — decisão técnica da POC Avião → Nuvens → Andes

- **Issue:** [#8 — Validar arquitetura técnica da Hero](https://github.com/cadife-tour/cadife-tour-plataforma/issues/8)
- **Dependências:** épica #3 e storyboard #7.
- **Escopo desta decisão:** as três primeiras cenas, em percurso único. As demais paradas e os modos de jornada completa/destino único continuam definidos editorialmente no storyboard, mas não são implementados por esta POC.

## Decisão

Usar **composição híbrida em HTML/CSS sobre vídeo curto**, com still dos Andes para a parada de leitura e CTA. O vídeo existente fornece a cabine, a janela e o movimento pelas nuvens; uma camada de nuvens em CSS suaviza a passagem; o still extraído da mesma fonte sustenta a chegada aos Andes com leve deslocamento de profundidade. Headline e CTA permanecem em HTML/React. Não há ganho comprovado que justifique Three.js/GLTF nesta cena; os componentes 3D experimentais existentes não entram no caminho de produção da Hero.

As headlines, apoios e o CTA do Chile em PT/EN/ES seguem as propostas do storyboard #7. Permanecem sujeitos à validação editorial indicada naquele documento.

O progresso de scroll é a única fonte de tempo: GSAP/ScrollTrigger controla o vídeo de 0 a aproximadamente 4,58 s durante os primeiros 70% da seção; os 30% finais mantêm o último quadro e o still. O seek ignora diferenças inferiores a meio quadro de 24 fps. A posição visual volta ao início quando o visitante rola para trás. A experiência não exige WebGL.

Para `prefers-reduced-motion`, economia de dados, `deviceMemory <= 2 GiB`, `hardwareConcurrency <= 2` ou erro de mídia, a Hero apresenta três painéis estáticos em fluxo normal, com as mesmas informações e ações. Os dois indicadores de capacidade são heurísticas disponíveis somente em alguns navegadores; sua ausência não prova que o aparelho seja potente. A falha de mídia é tratada mesmo quando a heurística não a detecta.

O layout geral ainda contém a camada decorativa `VisualJourney` em WebGL, separada da Hero. Ela usa a mesma detecção de capacidade e não monta nem consulta o contexto WebGL em movimento reduzido, economia de dados ou aparelho limitado. Em desktop capaz, esse canvas opcional ainda pode disputar recursos com o vídeo; o teste físico deve medir o conjunto antes de ampliar a jornada.

## Comparação e melhoria do vídeo

| Abordagem                | Resultado observado                                                                                                                                                           | Custo / limite                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Vídeo único anterior     | 6 s, 5.137.793 bytes, áudio desnecessário; a parada nos Andes dependia de buscar continuamente no vídeo e parecia escura.                                                     | Um único arquivo, mas mais bytes, texto menos legível e busca em quadros distantes.             |
| Híbrida escolhida        | MP4 H.264 de 4,6 s, 3.803.411 bytes, sem áudio, keyframe a cada 0,25 s; poster WebP de 113.424 bytes; still WebP de 220.064 bytes. Total: 4.136.899 bytes (redução de 19,5%). | Dois WebP adicionais e sincronização de opacidade entre vídeo e still.                          |
| Three.js/GLTF em runtime | Sem necessidade funcional: vídeo e still já entregam movimento e profundidade suficiente nesta POC.                                                                           | Acrescentaria carga de GPU, renderizador, geometria e fallback sem um ganho visual demonstrado. |

O novo MP4 foi recortado e reencodado da fonte local da jornada existente, em 1920×1080/24 fps com GOP de seis quadros e sem trilha de áudio. A semelhança estrutural média (SSIM) medida contra a fonte para os quadros comparáveis foi **0,9951**. O poster foi extraído em 0,10 s e o still dos Andes em 5,75 s da mesma fonte. A mudança melhora o tempo de busca, reduz transferência e dá à parada do Chile um quadro estável com contraste melhor. **Não recupera detalhes que já faltam na fonte**: nitidez cinematográfica superior exigirá master de melhor qualidade ou nova captação/produção nas tarefas de assets #9 e #10. A fonte local bruta não é versionada; os derivados estão no repositório.

## Verificação representativa

Build de produção da branch foi servido localmente. No Chromium desktop (1265×720), duas rolagens de 720 px levaram o vídeo a 1,64 s e 3,27 s; as duas rolagens reversas o devolveram a 1,64 s e 0,00 s. Em todos os pontos medidos o elemento reportou `readyState=4`, sem `seeking` pendente. Em viewport mobile emulado (390×844), a cena das nuvens apareceu em `scrollY=844` / 2,62 s; os Andes e o CTA apareceram em `scrollY=1688` / 4,58 s; o retorno a `scrollY=0` voltou ao quadro inicial sem texto residual. Foram inspecionadas capturas das três cenas em ambas as larguras. Esses números medem **sincronização**, não FPS ou energia; a duração das chamadas de automação não é uma medição confiável de decodificação.

Testes automatizados cobrem o conteúdo acessível e CTA no fallback de movimento reduzido, economia de dados, CPU limitada e erro de vídeo. Lint, formatação dos arquivos alterados, typecheck, suíte de testes e build são requisitos para preparar a PR. O `format:check` global possui arquivos preexistentes fora deste escopo; registrar o resultado exato da execução na PR.

## Trade-offs e escala

Cada destino futuro deve ter um registro de cena com intervalo de scroll, mídia otimizada, poster/still, texto localizado, CTA contextual e fallback estático. O mesmo controlador de progresso pode dirigir a opacidade de cada camada; não é preciso criar um renderizador 3D por destino. A jornada completa exige validar orçamento total de bytes, lazy loading por parada e o modo de destino único antes de adicionar os demais assets. A #8 não aprova a qualidade final da fonte atual nem a expansão para dez destinos.

**Pendências para aceite final em dispositivos reais:** medir FPS/long tasks, uso de memória, tempo até o primeiro quadro e seeking em Android/iOS representativos, incluindo aparelho de entrada e conexão lenta. O navegador desktop com viewport reduzido não substitui esses testes. Se houver engasgos graves, reduzir ainda mais o número de seeks, criar uma variante de menor resolução ou priorizar o fallback estático antes de aumentar o número de destinos.
