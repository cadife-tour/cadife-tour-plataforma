"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandoStyleHeroPage() {
  // Coordenadas do cursor relativas ao container central
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollSection, setScrollSection] = useState<"hero" | "marquee">("hero");

  // Raio da lente de revelação dinâmica sob o cursor (igual ao site do Lando Norris)
  const [lensRadius, setLensRadius] = useState(140);
  const [revealMode, setRevealMode] = useState<"lens" | "horizontal" | "click">("lens");

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Monitorar scroll para trocar para o modo ticker / assinatura como no Lando
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 250) {
        setScrollSection("marquee");
      } else {
        setScrollSection("hero");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`min-h-[220vh] w-full select-none transition-colors duration-700 ${
        scrollSection === "marquee" ? "bg-[#282c20] text-[#f4f4ed]" : "bg-[#f4f4ed] text-[#111112]"
      }`}
      style={{
        fontFamily:
          'Mona Sans Variable, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR EXATA DO SITE DO LANDO NORRIS */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
        {/* Brand Link no canto superior esquerdo */}
        <Link href="/" className="flex flex-col tracking-tighter leading-none group">
          <span className="font-black text-2xl tracking-tight text-[#111112] transition-colors group-hover:text-[#b2c73a]">
            CADIFE
          </span>
          <span className="font-black text-2xl tracking-tight text-[#535450] -mt-1 transition-colors group-hover:text-[#111112]">
            TOUR
          </span>
        </Link>

        {/* Emblema Central (estilo LN4 Monogram) */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center font-black tracking-widest text-lg border border-black/10 rounded-xl bg-black/5">
            CD
          </div>
          <span className="text-[9px] font-mono tracking-widest text-black/50 uppercase mt-0.5">
            ESCAPE EXPERIENCE
          </span>
        </div>

        {/* Botão Direito Neon Lime (#d2ff00) e Menu Hamburguer */}
        <div className="flex items-center gap-2">
          {/* Seletor de tamanho da lente */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-3 py-1 font-mono text-[10px] uppercase shadow-sm">
            <span className="text-black/50">LENTE:</span>
            <button
              onClick={() => setLensRadius(100)}
              className={`px-2 py-0.5 rounded-full ${
                lensRadius === 100 ? "bg-black text-[#d2ff00] font-bold" : "text-black/70"
              }`}
            >
              100px
            </button>
            <button
              onClick={() => setLensRadius(160)}
              className={`px-2 py-0.5 rounded-full ${
                lensRadius === 160 ? "bg-black text-[#d2ff00] font-bold" : "text-black/70"
              }`}
            >
              160px
            </button>
            <button
              onClick={() => setLensRadius(240)}
              className={`px-2 py-0.5 rounded-full ${
                lensRadius === 240 ? "bg-black text-[#d2ff00] font-bold" : "text-black/70"
              }`}
            >
              240px
            </button>
          </div>

          <Link
            href="https://wa.me/5511999999999"
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-[#d2ff00] px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-[#111112] shadow-sm hover:scale-105 active:scale-95 transition"
          >
            <svg width="14" height="14" viewBox="0 0 17 18" fill="none">
              <path
                d="m10.931 5.783-.759.812c-1.132 1.212-2.89 1.212-4.022 0l-.76-.812C4.313 4.637 2.568 5.29 2.275 6.928l-1.238 7.18c-.227 1.318.652 2.543 1.838 2.543h10.588c1.185 0 2.064-1.225 1.838-2.544l-1.239-7.179c-.28-1.638-2.037-2.29-3.116-1.145h-.014ZM10.839 3.048 9.84 1.849C8.894.717 7.43.717 6.484 1.85l-1 1.199"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span>CONSULTORIA</span>
          </Link>

          <button
            aria-label="Abrir Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/15 bg-black/5 hover:bg-black/10 transition"
          >
            <div className="space-y-1">
              <div className="h-0.5 w-4 bg-black" />
              <div className="h-0.5 w-4 bg-black" />
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO PRINCIPAL: O EFEITO EXATO DE REVELAÇÃO DO LANDO NORRIS */}
      {/* ========================================================================= */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-16">
        {/* Curvas topográficas sutis de fundo (idênticas ao background do site original) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1200 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-100 200 C 300 100, 600 350, 1300 150 M -100 450 C 400 300, 700 650, 1300 400 M -100 700 C 300 600, 800 800, 1300 650' stroke='%23b4b8a5' stroke-width='1.5' stroke-dasharray='3 3'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />

        {/* WIDGET LATERAL ESQUERDO: CONTORNO VETORIAL OFICIAL DO REPOSITÓRIO (NEXT RACE) */}
        <div className="absolute left-6 bottom-10 z-30 hidden lg:block">
          <div className="relative w-[120px] h-[245px] text-[#535450] hover:text-black transition-colors duration-300">
            {/* SVG original de outline retirado do index.html do repositório */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 119 244"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M118.5 6v232a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 238V25A5.5 5.5 0 0 1 6 19.5h46.346c4.695 0 9.167-2 12.297-5.498l7.46-8.337A15.5 15.5 0 0 1 83.653.5H113a5.5 5.5 0 0 1 5.5 5.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center h-full p-3 justify-between text-center">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#282c20] uppercase bg-[#d2ff00] px-1.5 py-0.5 rounded">
                  NEXT ESCAPE
                </span>
                <p className="text-xs font-black uppercase text-[#111112] mt-2 leading-tight">
                  PUNTA CANA
                </p>
                <p className="text-[9px] font-mono text-[#535450]">CARIBE 2026</p>
              </div>

              {/* Traço divisor interno */}
              <div className="h-[1px] w-12 bg-black/20" />

              {/* Ícone tropical */}
              <div className="my-auto flex flex-col items-center gap-1">
                <span className="text-2xl">🍹</span>
                <span className="text-[8px] font-mono text-black/60 uppercase">
                  REWARD MODE
                </span>
              </div>

              <div className="text-[8px] font-mono uppercase text-[#535450] tracking-tight border-t border-black/10 pt-1 w-full">
                CADIFE TOUR
                <br />
                SINCE 2019
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER DO ELEMENTO CENTRAL: FOTO BASE COM MÁSCARA DINÂMICA REVELADORA */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Domo wireframe decorativo acima da cabeça (idêntico ao wireframe do Lando) */}
          <div className="relative -mb-10 z-30 flex flex-col items-center opacity-70 pointer-events-none">
            <div className="h-6 w-6 rounded-full border border-black/40 flex items-center justify-center font-mono font-black text-[10px] bg-white/80 backdrop-blur">
              CD
            </div>
            <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
              <path
                d="M10 65 C 10 10, 170 10, 170 65 M 35 65 C 35 25, 145 25, 145 65 M 65 65 C 65 40, 115 40, 115 65"
                stroke="black"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* O RETRATO CENTRAL COM O EFEITO DE REVELAÇÃO SOB O MOUSE */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[520px] w-[340px] sm:h-[620px] sm:w-[480px] md:h-[700px] md:w-[560px] cursor-crosshair overflow-hidden rounded-[2rem] shadow-2xl bg-[#ebeee0]"
          >
            {/* 1. CAMADA BASE: A FOTO DO ESCRITÓRIO (ROUTINE / WORK) */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src="/demo-ln4/office.png"
                alt="Rotina de Escritório (Base)"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* 2. CAMADA REVELADA: A FOTO DA PRAIA PARADISÍACA (PARADISE / FREEDOM) */}
            {/* É exibida exatamente onde o cursor do mouse está, usando clip-path circle ou máscara */}
            <div
              className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                clipPath: isHovered
                  ? `circle(${lensRadius}px at ${mousePos.x}px ${mousePos.y}px)`
                  : `circle(0px at 50% 50%)`,
                WebkitClipPath: isHovered
                  ? `circle(${lensRadius}px at ${mousePos.x}px ${mousePos.y}px)`
                  : `circle(0px at 50% 50%)`,
              }}
            >
              <Image
                src="/demo-ln4/paradise.png"
                alt="Paraíso e Liberdade (Revelado pelo Cursor)"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Borda neon com lente no ponto de corte */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Anel de mirante / lente que segue o cursor (Feedback visual de precisão F1) */}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d2ff00] shadow-[0_0_20px_rgba(210,255,0,0.8)] transition-opacity duration-150"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                width: `${lensRadius * 2}px`,
                height: `${lensRadius * 2}px`,
                opacity: isHovered ? 1 : 0,
              }}
            >
              {/* Cruz de mira técnica */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d2ff00] px-1 font-mono text-[8px] font-black text-black uppercase">
                REVEAL: PARADISE
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black px-1.5 py-0.5 rounded text-[7px] font-mono text-[#d2ff00] uppercase">
                CADIFE ESCAPE
              </div>
            </div>

            {/* Indicador inferior dentro do card */}
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl bg-black/40 px-4 py-2 backdrop-blur-md text-white">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#d2ff00]">
                {isHovered ? "● REVELANDO PARAÍSO SOB O CURSOR" : "● PASSE O MOUSE SOBRE O ROSTO"}
              </span>
              <span className="text-[10px] font-mono text-white/70">
                [X: {Math.round(mousePos.x)} | Y: {Math.round(mousePos.y)}]
              </span>
            </div>
          </div>

          {/* Dica de interação abaixo do sujeito */}
          <div className="mt-4 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b2c73a] animate-ping" />
            <p className="font-mono text-xs uppercase tracking-widest text-[#535450]">
              Passe o cursor sobre a pessoa para revelar a vida na praia no mesmo ponto
            </p>
          </div>
        </div>

        {/* Botão de alternância / switch rápido no canto inferior direito */}
        <div className="absolute right-6 bottom-10 z-30 hidden lg:flex flex-col items-end gap-2">
          <button
            onClick={() => setLensRadius((prev) => (prev >= 240 ? 100 : prev + 60))}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/15 bg-white/80 shadow-md hover:border-black transition"
            title="Aumentar raio da lente"
          >
            <span className="font-mono text-xs font-bold text-black">{lensRadius}px</span>
          </button>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#535450]">
            LENS SIZE
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEÇÃO DO SCROLL (TRANSIÇÃO PARA FUNDO ESCURO COM ASSINATURA EM VERDE NEON) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 overflow-hidden">
        {/* Letreiro Marquee Ticker em Movimento Contínuo (HOME WE DID IT... estilo Lando) */}
        <div className="w-full overflow-hidden whitespace-nowrap border-y border-white/10 py-6 mb-12">
          <div className="inline-block animate-marquee font-black uppercase text-4xl sm:text-6xl md:text-8xl tracking-tighter text-[#b2c73a]/40">
            OFF TRACK ESCAPE • FROM THE DESK TO THE OCEAN • CADIFE TOUR • PUNTA CANA 2026 • REWARD YOURSELF •{" "}
          </div>
        </div>

        {/* Bloco Central com Foto PB e a Assinatura Neon por Cima (como no screenshot 3) */}
        <div className="relative flex flex-col items-center justify-center max-w-xl text-center">
          <div className="relative w-[320px] sm:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <Image
              src="/demo-ln4/paradise.png"
              alt="Lando Style Paradise Celebration"
              fill
              className="object-cover filter contrast-125 saturate-50 brightness-90"
            />
            {/* SVG da Assinatura Gigante em Verde Neon (#d2ff00) cruzando a foto */}
            <svg
              className="absolute inset-0 w-full h-full text-[#d2ff00] p-4 drop-shadow-[0_0_15px_rgba(210,255,0,0.8)]"
              viewBox="0 0 300 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 30 150 C 90 20, 180 30, 240 70 C 270 90, 120 180, 70 160 C 20 140, 160 80, 260 130 M 130 50 L 150 180 M 170 70 L 140 160"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-8 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#d2ff00]">
              CADIFE TOUR // MANIFESTO
            </span>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#f4f4ed]">
              REDEFINING <span className="text-[#d2ff00]">YOUR BREAK</span>.
            </h3>
            <p className="text-sm sm:text-base text-[#b4b8a5] max-w-lg leading-relaxed">
              O trabalho intenso constrói os seus resultados. A CADIFE Tour entrega a recompensa que você merece.
            </p>
            <div className="pt-4">
              <Link
                href="https://wa.me/5511999999999"
                target="_blank"
                className="inline-flex items-center gap-3 rounded-xl bg-[#d2ff00] px-8 py-3.5 font-mono text-xs font-black uppercase tracking-widest text-[#282c20] hover:scale-105 transition shadow-[0_0_30px_rgba(210,255,0,0.5)]"
              >
                <span>Falar com o Consultor</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animação CSS inline do Ticker Marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
