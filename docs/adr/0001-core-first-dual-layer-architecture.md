# ADR 0001: Adoção da Arquitetura Dual-Layer e Core First

- **Status**: Aceito
- **Data**: 2026-08-28
- **Decisores**: Equipe de Engenharia CADIFE Tour

## Contexto

A CADIFE Tour precisa de um novo site institucional de alto impacto visual, com potencial para incluir narrativa de scroll 3D e motion na Etapa 1, evoluindo futuramente para o ecossistema *Cadife Smart Travel*.
Sites com 3D intenso correm riscos crônicos de Core Web Vitals ruins (LCP alto), baixa acessibilidade (leitores de tela cegos a conteúdo dentro de Canvas WebGL) e quebra funcional em dispositivos de baixa capacidade ou conexões lentas.

## Decisão

Adotamos a **Arquitetura Dual-Layer com Progressive Enhancement (Core First)**:

1. **Camada DOM (Core Semântico)**:
   - Todo o conteúdo (headings, parágrafos, destinos, prova social, CTAs de conversão) reside em HTML semântico puro.
   - O site é plenamente navegável via teclado e leitores de tela sem dependência de JavaScript ou WebGL.
2. **Camada Visual (`features/visual-journey`)**:
   - Canvas Three.js / WebGL atua como background passivo/complementar acoplado apenas aos eventos de scroll do DOM.
   - Se a pasta `visual-journey` for removida ou falhar em runtime, o site continua 100% funcional.
3. **Matriz de Fallback de 4 Níveis**:
   - `prefers-reduced-motion`: Desativa Canvas 3D e scrolljacking.
   - Falha de GPU / Context Loss: Neutraliza o Canvas e exibe fallback CSS elegante.
   - `Save-Data` / Conexão Lenta: Ignora download de modelos 3D/vídeos.
   - No-JS: Renderização estática com links diretos de WhatsApp.

## Consequências

- **Positivas**:
  - SEO orgânico máximo com dados legíveis pelo Googlebot.
  - Acessibilidade WCAG e usabilidade em qualquer dispositivo.
  - Facilidade de teste e manutenção por desenvolvedores voluntários.
  - Segurança contra regressões visuais bloquearem a conversão da agência.
- **Negativas / Desafios**:
  - Exige manter a sincronização de estado entre a timeline do GSAP/ScrollTrigger e a posição dos elementos no DOM.
