"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGpuCapability } from "@/features/visual-journey/hooks/useGpuCapability";
import { TravelOverlay } from "./components/TravelOverlay";
import { ASSET_MANIFEST } from "./assets/assetManifest";
import { clamp } from "./timeline/timelineUtils";
import { type TravelExperienceMode, getDestinationConfig } from "./config/travelExperienceConfig";

import { JOURNEY_SCENES, getSceneTiming } from "./config/journeyScenes";
const FRAME_INTERVAL = 1 / 24;

interface StaticJourneyProps {
  continuation?: boolean;
  mode?: TravelExperienceMode;
  targetDestination?: string;
}

function StaticJourney({ mode, targetDestination, continuation = false }: StaticJourneyProps) {
  const destination = getDestinationConfig(targetDestination);
  const destinationStill = destination.media.stillImage || ASSET_MANIFEST.images.chileAndes;

  return (
    <section
      className="w-full border-b border-border"
      aria-label="Experiência de Viagem CADIFE Tour"
      data-testid="travel-experience-fallback"
    >
      {!continuation && (
        <>
          <div className="relative min-h-screen overflow-hidden bg-[#141312]">
            <Image
              src={destination.media.posterImage || ASSET_MANIFEST.images.airplanePoster}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
            <TravelOverlay
              progress={0}
              staticFallback
              mode={mode}
              targetDestination={targetDestination}
            />
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
            <TravelOverlay
              progress={0.57}
              staticFallback
              mode={mode}
              targetDestination={targetDestination}
            />
          </div>
        </>
      )}
      <div className="relative min-h-screen overflow-hidden bg-[#141312]">
        <Image src={destinationStill} alt="" fill sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <TravelOverlay
          progress={1}
          showIntro={!continuation}
          staticFallback
          mode={mode}
          targetDestination={targetDestination}
        />
      </div>
    </section>
  );
}

export interface TravelExperienceProps {
  mode?: TravelExperienceMode;
  targetDestination?: string;
}

/**
 * TravelExperience:
 * POC híbrida: vídeo para a jornada inteira e nuvens em CSS para a transição.
 * Um frame do mesmo vídeo serve apenas como fallback estático. Conteúdo em HTML.
 * A mesma cena atende a jornada completa e o recorte por destino.
 * Destinos sem vídeo próprio usam somente o fallback estático.
 */
function DestinationExperience({
  mode = "single",
  targetDestination = "chile",
  continuation = false,
}: TravelExperienceProps & { continuation?: boolean } = {}) {
  const destination = getDestinationConfig(targetDestination);
  const timing = getSceneTiming(destination.id);
  const [nearby, setNearby] = useState(!continuation);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const { isReducedMotion, isSaveData, isConstrainedDevice } = useGpuCapability();
  const useStaticFallback =
    !destination.media.videoSrc ||
    (isHydrated && (isReducedMotion || isSaveData || isConstrainedDevice || mediaFailed));

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (nearby || !element || useStaticFallback) return;
    if (typeof IntersectionObserver === "undefined") {
      setMediaFailed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [nearby, useStaticFallback]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!nearby || !isHydrated || useStaticFallback || !container || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    let timeline: gsap.core.Timeline | undefined;
    const setupTimeline = () => {
      if (timeline || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const lastSeekableFrame = Math.max(0, video.duration - FRAME_INTERVAL);
      const initialTime = continuation ? video.duration * timing.continuationStart : 0;
      const proxy = { time: initialTime };
      video.currentTime = initialTime;
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
        duration: timing.videoEnd,
        ease: "none",
        onUpdate: () => {
          const desired = clamp(proxy.time, initialTime, lastSeekableFrame);
          if (Math.abs(video.currentTime - desired) >= FRAME_INTERVAL / 2) {
            video.currentTime = desired;
          }
        },
      });
      timeline.to({}, { duration: 1 - timing.videoEnd });
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
  }, [isHydrated, useStaticFallback, destination.media.videoSrc, nearby, continuation, timing]);

  if (useStaticFallback)
    return (
      <StaticJourney
        mode={mode}
        targetDestination={targetDestination}
        continuation={continuation}
      />
    );

  const overlayProgress = continuation
    ? timing.cloudsStart + progress * (1 - timing.cloudsStart)
    : progress;
  const cloudArrival = clamp((progress - 0.4) / 0.12);
  const cloudDeparture = clamp((0.72 - progress) / 0.12);
  const cloudOpacity = Math.min(cloudArrival, cloudDeparture) * 0.35;
  const heightClass = "h-[var(--scene-mobile)] md:h-[var(--scene-desktop)]";

  return (
    <section
      ref={containerRef}
      data-destination={destination.id}
      style={
        {
          "--scene-mobile": `${continuation ? timing.mobileScrollVh * 0.65 : timing.mobileScrollVh}svh`,
          "--scene-desktop": `${continuation ? timing.desktopScrollVh * 0.6 : timing.desktopScrollVh}vh`,
        } as React.CSSProperties
      }
      className={`relative ${heightClass} w-full border-b border-border`}
      aria-label="Experiência de Viagem CADIFE Tour — Trilha Interativa"
      data-testid="travel-experience-hero"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#141312] md:h-screen">
        <video
          ref={videoRef}
          src={isHydrated && nearby ? destination.media.videoSrc : undefined}
          poster={nearby ? destination.media.posterImage : undefined}
          playsInline
          muted
          preload={nearby ? "auto" : "none"}
          aria-hidden="true"
          onError={() => setMediaFailed(true)}
          className="h-full w-full object-cover object-center"
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
        <TravelOverlay
          progress={overlayProgress}
          showIntro={!continuation}
          mode={mode}
          targetDestination={targetDestination}
        />
        {mode === "full" && timing.exitStart < 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white"
            style={{ opacity: clamp((progress - timing.exitStart) / (1 - timing.exitStart)) }}
          />
        )}
      </div>
    </section>
  );
}

/** Uma engine, uma abertura e a sequência editorial completa. */
export function TravelExperience({
  mode = "single",
  targetDestination = "chile",
}: TravelExperienceProps = {}) {
  if (mode === "full")
    return (
      <div data-testid="full-journey">
        {JOURNEY_SCENES.map((scene, index) => (
          <DestinationExperience
            key={scene.destination}
            mode="full"
            targetDestination={scene.destination}
            continuation={index > 0}
          />
        ))}
      </div>
    );
  const destination = getDestinationConfig(targetDestination);
  return <DestinationExperience key={destination.id} targetDestination={destination.id} />;
}
