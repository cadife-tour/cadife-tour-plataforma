"use client";

import { useId } from "react";
import { clsx } from "clsx";

export type StampTone = "red" | "blue" | "green" | "gold";

const toneColor: Record<StampTone, string> = {
  red: "var(--color-ink-red)",
  blue: "var(--color-ink-blue)",
  green: "var(--color-ink-green)",
  gold: "var(--color-ink-gold)",
};

export interface PassportStampProps {
  /** Texto curvo do topo (ex.: "CADIFE TOUR"). */
  label: string;
  /** Destaque central (ex.: "CHILE", "VISTO"). */
  title: string;
  /** Texto curvo de baixo ou linha de data (ex.: "12 NOV 2026"). */
  caption?: string;
  tone?: StampTone;
  shape?: "circle" | "rect";
  /** Inclinação em graus — carimbos reais nunca saem retos. */
  rotate?: number;
  /** Tamanho em px (lado do quadrado). */
  size?: number;
  className?: string;
}

/**
 * Carimbo de passaporte decorativo, com tinta gasta e borda dupla.
 * É sempre `aria-hidden`: o conteúdo informativo deve existir no texto da página.
 */
export function PassportStamp({
  label,
  title,
  caption,
  tone = "red",
  shape = "circle",
  rotate = -12,
  size = 112,
  className,
}: PassportStampProps) {
  const uid = useId().replace(/:/g, "");
  const inkId = `stamp-ink-${uid}`;
  const topArc = `stamp-top-${uid}`;
  const bottomArc = `stamp-bottom-${uid}`;
  const color = toneColor[tone];
  const titleSize = title.length > 7 ? 15 : title.length > 5 ? 18 : 22;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 120"
      width={size}
      height={shape === "rect" ? size * 0.72 : size}
      preserveAspectRatio="xMidYMid meet"
      className={clsx("pointer-events-none z-10 select-none", className)}
      style={{ transform: `rotate(${rotate}deg)`, color }}
    >
      <defs>
        {/* Tinta gasta: ruído fino recorta falhas e uma leve distorção irregulariza o traço. */}
        <filter id={inkId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.65"
            result="wear"
          />
          <feComposite in="SourceGraphic" in2="wear" operator="in" result="worn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="9" />
          <feDisplacementMap in="worn" scale="1.6" />
        </filter>
        <path id={topArc} d="M 18 60 A 42 42 0 0 1 102 60" />
        <path id={bottomArc} d="M 22 60 A 38 38 0 0 0 98 60" />
      </defs>

      <g filter={`url(#${inkId})`} fill="none" stroke="currentColor" opacity="1">
        {shape === "circle" ? (
          <>
            <circle cx="60" cy="60" r="56" strokeWidth="3" />
            <circle cx="60" cy="60" r="47" strokeWidth="1.2" />
            <circle cx="60" cy="60" r="29" strokeWidth="1" strokeDasharray="2 3" />
            <text
              fill="currentColor"
              stroke="none"
              fontSize="10"
              fontWeight="800"
              letterSpacing="2.4"
              fontFamily="var(--font-sans)"
            >
              <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
                {label}
              </textPath>
            </text>
            {caption && (
              <text
                fill="currentColor"
                stroke="none"
                fontSize="8.5"
                fontWeight="700"
                letterSpacing="1.8"
                fontFamily="var(--font-sans)"
              >
                <textPath href={`#${bottomArc}`} startOffset="50%" textAnchor="middle">
                  {caption}
                </textPath>
              </text>
            )}
            <text
              x="60"
              y="66"
              fill="currentColor"
              stroke="none"
              fontSize={titleSize}
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-heading)"
            >
              {title}
            </text>
            <text x="28" y="64" fill="currentColor" stroke="none" fontSize="8" textAnchor="middle">
              ★
            </text>
            <text x="92" y="64" fill="currentColor" stroke="none" fontSize="8" textAnchor="middle">
              ★
            </text>
          </>
        ) : (
          <>
            <rect x="4" y="18" width="112" height="84" rx="10" strokeWidth="3" />
            <rect x="11" y="25" width="98" height="70" rx="6" strokeWidth="1.2" />
            <text
              x="60"
              y="41"
              fill="currentColor"
              stroke="none"
              fontSize="9"
              fontWeight="800"
              letterSpacing="2.2"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
            <line x1="22" y1="47" x2="98" y2="47" strokeWidth="1" />
            <text
              x="60"
              y="70"
              fill="currentColor"
              stroke="none"
              fontSize={titleSize}
              fontWeight="800"
              textAnchor="middle"
              fontFamily="var(--font-heading)"
            >
              {title}
            </text>
            {caption && (
              <text
                x="60"
                y="86"
                fill="currentColor"
                stroke="none"
                fontSize="8"
                fontWeight="700"
                letterSpacing="1.6"
                textAnchor="middle"
                fontFamily="var(--font-sans)"
              >
                {caption}
              </text>
            )}
          </>
        )}
      </g>
    </svg>
  );
}
