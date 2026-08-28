# Baseline de Performance — Fase 1 (Core Semântico)

> **Data de Medição**: 2026-08-28  
> **Condição**: Core Semântico HTML-first puro (sem Three.js, sem GSAP, sem WebGL, sem assets de mídia pesados).  
> **Ambiente**: Next.js 15.1.7 (Produção / Static Export SSG)

---

## 1. Métricas de Bundle e Transferência de Build

| Métrica | Valor Medido | Limite/Budget Alvo | Status |
| :--- | :--- | :--- | :--- |
| **Página Inicial (`/`) JS** | **1.34 kB** | $< 10\text{ kB}$ | 🟢 Excelente |
| **First Load JS Total** | **101 kB** | $< 150\text{ kB}$ | 🟢 Dentro do budget |
| **Shared Chunks (React + Next)** | **99.7 kB** | $< 120\text{ kB}$ | 🟢 Excelente |
| **CSS Total Transfer** | **~3.2 kB** (Tailwind purge) | $< 20\text{ kB}$ | 🟢 Mínimo |
| **Requests Iniciais** | **4 requests** (HTML, CSS, JS chunks) | $< 10$ requests | 🟢 Ultraleve |

---

## 2. Core Web Vitals Estimados (Core Baseline)

* **LCP (Largest Contentful Paint)**: $< 0.8\text{s}$ (Renderização estática instantânea de `h1`).
* **CLS (Cumulative Layout Shift)**: **0.00** (Zero deslocamento de layout; estrutura CSS estática).
* **FCP (First Contentful Paint)**: $< 0.5\text{s}$.
* **INP / FID**: $< 50\text{ms}$ (Interatividade imediata nos botões/links sem blocking JS).
* **TTFB (Time to First Byte)**: Instantâneo via CDN Vercel (Edge).

---

## 3. Observações para Fases Futuras

Este baseline serve como **marco de referência estrito**. Ao introduzir o Three.js e as timelines do GSAP na **Fase 3 (`features/visual-journey`)**:
1. Todo o código WebGL deverá ser isolado com `next/dynamic` (`ssr: false`) para **NÃO aumentar o First Load JS de 101 kB**.
2. Os modelos 3D / Shaders deverão ser baixados sob demanda sem bloquear a renderização dos textos e botões principais.
