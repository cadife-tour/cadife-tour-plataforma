# ADR 0003: WebGL Procedural Atmosférico com Carregamento Assíncrono e Matriz de Fallback de 4 Níveis

- **Status**: Aceito
- **Data**: 2026-08-28
- **Decisores**: Equipe de Engenharia CADIFE Tour

## Contexto

A Fase 1 e a Fase 2 estabeleceram o Core Semântico da CADIFE Tour com HTML semântico puro, i18n e deep links de WhatsApp, atingindo um First Load JS de 104 kB. A Fase 3 introduz a narrativa visual de scroll inspirada na decolagem e jornada do viajante. 

O desafio arquitetural é adicionar Three.js, shaders procedurais e animações sem inflacionar o bundle inicial, sem causar regressions de Core Web Vitals (LCP/CLS/INP) e sem prejudicar usuários em conexões lentas, dispositivos móveis ou com preferências de acessibilidade (`prefers-reduced-motion`).

## Decisão

1. **Atmosfera Procedural em Background (`features/visual-journey`)**:
   - O WebGL não renderizará modelos 3D pesados (.glb) nem conterá textos, botões ou dados comerciais.
   - O Canvas atua como background com `pointer-events: none`, gerando partículas de nuvens, iluminação e profundidade conforme a estação de viagem ativa (Europa, Natureza, Litoral).
2. **Isolamento e Code Splitting Estrito**:
   - Three.js / React Three Fiber e GSAP são carregados **exclusivamente via dynamic import assíncrono** com `ssr: false`.
   - O Core First Load JS permanece no teto de $\le 105\text{ kB}$.
3. **Soberania do Scroll Nativo**:
   - Zero scrolljacking ou `preventDefault()`. O progresso é lido passivamente do DOM e normalizado via `requestAnimationFrame`.
4. **Matriz de Fallback de 4 Níveis**:
   - **Nível 0 (No-JS)**: HTML semântico com CSS puro.
   - **Nível 1 (Reduced Motion / Save-Data)**: `StaticAtmosphere` em CSS nativo (zero Three.js baixado).
   - **Nível 2 (No-WebGL / GPU Fraca / Context Loss)**: Fallback 2D sem quebra de página.
   - **Nível 3 (Dispositivo Moderno)**: Experiência completa com WebGL procedural e DPR controlado (`Math.min(DPR, 1.5)` no mobile).

## Consequências

- **Positivas**:
  - Zero impacto no First Load do Core e no LCP.
  - Acessibilidade WCAG AA e integridade do HTML preservadas.
  - Proteção total contra quebras em celulares e navegadores restritos.
- **Negativas / Desafios**:
  - Requer testes específicos simulando perda de contexto WebGL e listeners de redimensionamento.
