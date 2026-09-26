"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";
import { TravelOverlay } from "./components/TravelOverlay";
import { ASSET_MANIFEST } from "./assets/assetManifest";
import { clamp } from "./timeline/timelineUtils";

const VIDEO_END_PROGRESS = 0.7;
const FRAME_INTERVAL = 1 / 24;

function StaticJourney() {
  return (
    <section
      className="w-full border-b border-border"
      aria-label="Experiência de Viagem CADIFE Tour"
      data-testid="travel-experience-fallback"
    >
      <div className="relative min-h-screen overflow-hidden bg-[#141312]">
        <Image
          src={ASSET_MANIFEST.images.airplanePoster}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <TravelOverlay progress={0} staticFallback />
      </div>
      <div className="relative min-h-screen overflow-hidden bg-slate-300">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 25% 45%, #fff 0%, #e4edf1 45%, transparent 80%), radial-gradient(ellipse at 75% 65%, #fff 0%, #cbd5de 58%, #a6b8c4 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <TravelOverlay progress={0.4} staticFallback />
      </div>
      <div className="relative min-h-screen overflow-hidden bg-[#141312]">
        <Image
          src={ASSET_MANIFEST.images.chileAndes}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <TravelOverlay progress={1} staticFallback />
      </div>
    </section>
  );
}

/**
 * POC híbrida: o vídeo cobre a cabine e a passagem pelas nuvens; um frame
 * estável sustenta os Andes e o CTA. Todo o conteúdo permanece em HTML.
 */
export function TravelExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const { isReducedMotion, isSaveData, isConstrainedDevice } = useGpuCapability();
  const useStaticFallback =
    isHydrated && (isReducedMotion || isSaveData || isConstrainedDevice || mediaFailed);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!isHydrated || useStaticFallback || !container || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    let timeline: gsap.core.Timeline | undefined;
    const setupTimeline = () => {
      if (timeline || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const lastSeekableFrame = Math.max(0, video.duration - FRAME_INTERVAL);
      const proxy = { time: 0 };
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
          onUpdate: (trigger) => setProgress(trigger.progress),
        },
      });
      timeline.to(proxy, {
        time: lastSeekableFrame,
        duration: VIDEO_END_PROGRESS,
        ease: "none",
        onUpdate: () => {
          const desired = clamp(proxy.time, 0, lastSeekableFrame);
          if (Math.abs(video.currentTime - desired) >= FRAME_INTERVAL / 2) {
            video.currentTime = desired;
          }
        },
      });
      timeline.to({}, { duration: 1 - VIDEO_END_PROGRESS });
      timeline.scrollTrigger?.refresh();
      setProgress(timeline.scrollTrigger?.progress ?? 0);
    };

    video.addEventListener("loadedmetadata", setupTimeline);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setupTimeline();

    return () => {
      video.removeEventListener("loadedmetadata", setupTimeline);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    };
  }, [isHydrated, useStaticFallback]);

  if (useStaticFallback) return <StaticJourney />;

  const andesOpacity = clamp((progress - 0.54) / 0.18);
  const cloudArrival = clamp((progress - 0.34) / 0.16);
  const cloudDeparture = clamp((0.76 - progress) / 0.2);
  const cloudOpacity = Math.min(cloudArrival, cloudDeparture) * 0.45;
  const mountainDepth = clamp((progress - 0.7) / 0.3);

  return (
    <section
      ref={containerRef}
      className="relative h-[350svh] w-full border-b border-border md:h-[500vh]"
      aria-label="Experiência de Viagem CADIFE Tour — Trilha Interativa"
      data-testid="travel-experience-hero"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#141312] md:h-screen">
        <video
          ref={videoRef}
          src={isHydrated ? ASSET_MANIFEST.videos.heroJourney : undefined}
          poster={ASSET_MANIFEST.images.airplanePoster}
          playsInline
          muted
          preload="auto"
          aria-hidden="true"
          onError={() => setMediaFailed(true)}
          className="h-full w-full object-cover object-center"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${ASSET_MANIFEST.images.chileAndes}")`,
            opacity: andesOpacity,
            transform: `scale(${1.04 + mountainDepth * 0.04}) translateY(${mountainDepth * -1.5}%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            opacity: cloudOpacity,
            backgroundImage:
              "radial-gradient(ellipse at 30% 55%, rgba(255,255,255,.95), transparent 65%), radial-gradient(ellipse at 80% 40%, rgba(237,245,248,.9), transparent 60%)",
            transform: `translate3d(${(progress - 0.5) * 4}%, 0, 0)`,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <TravelOverlay progress={progress} />
      </div>
    </section>
  );
}
