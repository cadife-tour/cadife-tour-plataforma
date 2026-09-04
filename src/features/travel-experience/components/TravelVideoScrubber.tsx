"use client";

import React, { useEffect, useRef } from "react";

interface TravelVideoScrubberProps {
  progress: number;
  src: string;
}

/**
 * TravelVideoScrubber:
 * Elemento de vídeo fixo em tela cheia que reproduz a jornada frame a frame
 * estritamente atrelada à posição do scroll do usuário (desce -> avança, sobe -> volta).
 */
export const TravelVideoScrubber: React.FC<TravelVideoScrubberProps> = ({
  progress,
  src,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Garante que o vídeo seja pausado e carregado em memória
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    const handleLoadedMetadata = () => {
      video.pause();
      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = progress * video.duration;
        video.currentTime = targetTimeRef.current;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [progress]);

  // Atualiza targetTime conforme o scroll progride de 0 a 1
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;

    targetTimeRef.current = Math.max(0, Math.min(progress * video.duration, video.duration - 0.05));
  }, [progress]);

  // Sincronização direta e responsiva do currentTime com o scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncVideoToScroll = () => {
      if (video.duration && !isNaN(video.duration)) {
        const diff = targetTimeRef.current - video.currentTime;
        // Interpolação suave e rápida para acompanhar o scroll perfeitamente sem saltos
        if (Math.abs(diff) > 0.005) {
          video.currentTime += diff * 0.25;
        }
      }
      rafRef.current = requestAnimationFrame(syncVideoToScroll);
    };

    rafRef.current = requestAnimationFrame(syncVideoToScroll);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden bg-background">
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted
        autoPlay={false}
        preload="auto"
        className="h-full w-full object-cover object-center transition-opacity duration-500"
      />
      {/* Vinhetas escuras e gradientes cinematográficos para garantir legibilidade perfeita do texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
    </div>
  );
};
