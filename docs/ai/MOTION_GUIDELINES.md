# Motion & Microinteractions

## Objetivo

Motion aumenta:

- orientação;
- continuidade;
- percepção de qualidade;
- narrativa.

Não deve:

- atrasar ação;
- esconder conteúdo;
- sequestrar scroll;
- existir só para parecer tecnológico.

## Duração

- micro: 120–220ms
- componente: 240–480ms
- editorial: 500–900ms
- cinematográfico: timeline/scroll

## Easing

Preferir:

- `power2.out`
- `power3.out`

Evitar bounce/elastic em navegação e CTA.

## Menu

- opacity;
- barra/underline;
- deslocamento máximo 1px.

## Botão

- `translateY(-1px)`
- luminância/sombra discreta
- sem pulso infinito
- scale máximo ~1.02

## Reveals

- opacity 0→1
- translateY 16–28px→0
- stagger 40–100ms

## Ferramentas

CSS:

- hover/focus/micro.

GSAP:

- timeline;
- ScrollTrigger;
- vídeo;
- scrollytelling.

Three.js:

- runtime 3D necessário.

## Reduced motion

Obrigatório.
Preservar conteúdo e CTA.
Sem scrub agressivo, parallax ou scroll preso.

## Smooth Scroll vs. Scroll Nativo

- **Scroll nativo (`scroll-behavior: smooth` + `scroll-mt-24`):** padrão para âncoras de seção (`#destinos`, `#como-funciona`, `#agencia`, `#depoimentos`, `#faq`, `#contato`). Garante previsibilidade, suporte a teclado/leitor de tela e evita compensação manual com header fixo.
- **`scrollToSection(targetId)` (`src/shared/motion`):** usar apenas quando um fluxo programático em JS precisar rolar para uma seção respeitando `prefers-reduced-motion` (`auto` quando reduzido, `smooth` caso contrário).
- **Proibido:** scroll hijacking ou `pin` fora da Hero.

## Não concorrência com a Hero

- A Hero detém o protagonismo cinematográfico (vídeo/scrubbing).
- As demais seções usam apenas microinterações CSS (`duration-micro` / `duration-reveal` + `ease-standard`) e reveals discretos de entrada única ao entrar no viewport (`Reveal`), sem loops infinitos nem animações contínuas competindo por atenção ou CPU/GPU.

## Tokens padrão (Fonte única)

- `duration-micro` (`180ms` / `--duration-fast`): botões, links, hover, foco, dropdowns, accordion.
- `duration-reveal` (`360ms` / `--duration-normal`): entrada de cards/seções, menu mobile, zoom sutil de imagem.
- `duration-editorial` (`680ms` / `--duration-slow`): headlines editoriais, fades de mídia da Hero.
- Sempre incluir `motion-reduce:transition-none` / `motion-reduce:animate-none` em animações/transições explícitas.

## Performance

Motion bonito que trava mobile é bug.
