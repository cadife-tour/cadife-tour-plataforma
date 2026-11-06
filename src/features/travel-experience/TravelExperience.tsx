"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Locale } from "@/content/types";
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
  introTitle?: Record<Locale, string>;
}

function StaticJourney({
  mode,
  targetDestination,
  introTitle,
  continuation = false,
}: StaticJourneyProps) {
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
              introTitle={introTitle}
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
              introTitle={introTitle}
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
          introTitle={introTitle}
        />
      </div>
    </section>
  );
}

export interface TravelExperienceProps {
  mode?: TravelExperienceMode;
  targetDestination?: string;
  introTitle?: Record<Locale, string>;
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
  introTitle,
  continuation = false,
  active = true,
  track,
  sharedFrame = false,
  hydrated,
  staticDevice,
}: TravelExperienceProps & {
  continuation?: boolean;
  active?: boolean;
  track?: HTMLElement;
  sharedFrame?: boolean;
  hydrated: boolean;
  staticDevice: boolean;
}) {
  const destination = getDestinationConfig(targetDestination);
  const timing = getSceneTiming(destination.id);
  const [nearby, setNearby] = useState(!continuation);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [mediaFailed, setMediaFailed] = useState(false);
  const useStaticFallback = !destination.media.videoSrc || staticDevice || mediaFailed;

  useEffect(() => {
    const element = sharedFrame ? track : containerRef.current;
    if (nearby || !element || useStaticFallback) return;
    if (active) {
      setNearby(true);
      return;
    }
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
      { rootMargin: `${document.documentElement.clientHeight}px 0px` }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, nearby, sharedFrame, track, useStaticFallback]);

  useEffect(() => {
    const container = sharedFrame ? track : containerRef.current;
    const video = videoRef.current;
    if (!nearby || !hydrated || useStaticFallback || !container || !video) return;

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
          end: sharedFrame ? "bottom top" : "bottom bottom",
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
  }, [
    hydrated,
    useStaticFallback,
    destination.media.videoSrc,
    nearby,
    continuation,
    timing,
    track,
    sharedFrame,
  ]);

  if (useStaticFallback && !sharedFrame)
    return (
      <StaticJourney
        mode={mode}
        targetDestination={targetDestination}
        introTitle={introTitle}
        continuation={continuation}
      />
    );

  const overlayProgress = continuation
    ? timing.cloudsStart + progress * (1 - timing.cloudsStart)
    : progress;
  const cloudArrival = clamp((progress - 0.4) / 0.12);
  const cloudDeparture = clamp((0.72 - progress) / 0.12);
  const cloudOpacity = Math.min(cloudArrival, cloudDeparture) * 0.35;
  return (
    <section
      ref={containerRef}
      data-destination={destination.id}
      hidden={!active}
      className={
        sharedFrame
          ? "absolute inset-0"
          : "relative h-[var(--scene-mobile)] w-full border-b border-border md:h-[var(--scene-desktop)]"
      }
      style={sharedFrame ? undefined : sceneHeight(destination.id, false, false)}
      aria-label="Experiência de Viagem CADIFE Tour — Trilha Interativa"
      data-testid="travel-experience-hero"
    >
      <div
        className={
          sharedFrame
            ? "relative h-full"
            : "sticky top-0 h-svh w-full overflow-hidden bg-[#141312] md:h-screen"
        }
      >
        {useStaticFallback ? (
          <Image
            src={destination.media.stillImage || ASSET_MANIFEST.images.chileAndes}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={hydrated && nearby ? destination.media.videoSrc : undefined}
            poster={active || nearby ? destination.media.posterImage : undefined}
            playsInline
            muted
            preload={nearby ? "auto" : "none"}
            aria-hidden="true"
            onError={() => setMediaFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        )}

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
          progress={useStaticFallback ? 1 : overlayProgress}
          staticFallback={useStaticFallback}
          showIntro={!continuation}
          mode={mode}
          targetDestination={targetDestination}
          introTitle={introTitle}
        />
      </div>
    </section>
  );
}

function sceneHeight(destination: string, continuation: boolean, track: boolean): CSSProperties {
  const timing = getSceneTiming(destination);
  return {
    "--scene-mobile": `${timing.mobileScrollVh * (continuation ? 0.65 : 1) - (track ? 100 : 0)}svh`,
    "--scene-desktop": `${timing.desktopScrollVh * (continuation ? 0.6 : 1) - (track ? 100 : 0)}vh`,
  } as CSSProperties;
}

function FullJourney({ hydrated }: { hydrated: boolean }) {
  const journeyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tracks, setTracks] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!hydrated || !journey) return;

    const markers = Array.from(journey.querySelectorAll<HTMLElement>("[data-journey-track]"));
    setTracks(markers);
    const selectScene = () => {
      const index =
        journey.getBoundingClientRect().top >= 0
          ? 0
          : markers.findIndex((marker) => marker.getBoundingClientRect().bottom > 0);
      setActiveIndex(index === -1 ? markers.length - 1 : index);
    };

    selectScene();
    window.addEventListener("scroll", selectScene, { passive: true });
    window.addEventListener("resize", selectScene);
    return () => {
      window.removeEventListener("scroll", selectScene);
      window.removeEventListener("resize", selectScene);
    };
  }, [hydrated]);

  return (
    <div ref={journeyRef} className="grid" data-testid="full-journey">
      <div className="sticky top-0 z-10 col-start-1 row-start-1 h-svh self-start overflow-hidden bg-[#141312] md:h-screen">
        {JOURNEY_SCENES.map(({ destination }, index) => (
          <DestinationExperience
            key={destination}
            mode="full"
            targetDestination={destination}
            continuation={index > 0}
            active={index === activeIndex}
            track={tracks[index]}
            hydrated={hydrated}
            staticDevice={false}
            sharedFrame
          />
        ))}
      </div>
      <div className="col-start-1 row-start-1" aria-hidden="true">
        {JOURNEY_SCENES.map(({ destination }, index) => (
          <div
            key={destination}
            data-journey-track={destination}
            className="h-[var(--scene-mobile)] md:h-[var(--scene-desktop)]"
            style={sceneHeight(destination, index > 0, true)}
          />
        ))}
        <div className="h-svh md:h-screen" />
      </div>
    </div>
  );
}

export function TravelExperience({
  mode = "single",
  targetDestination = "chile",
  introTitle,
}: TravelExperienceProps = {}) {
  const [hydrated, setHydrated] = useState(false);
  const { isReducedMotion, isSaveData, isConstrainedDevice } = useGpuCapability();
  const staticDevice = hydrated && (isReducedMotion || isSaveData || isConstrainedDevice);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (mode === "full") {
    return staticDevice ? (
      <div data-testid="full-journey">
        {JOURNEY_SCENES.map(({ destination }, index) => (
          <StaticJourney
            key={destination}
            mode="full"
            targetDestination={destination}
            continuation={index > 0}
          />
        ))}
      </div>
    ) : (
      <FullJourney hydrated={hydrated} />
    );
  }

  const destination = getDestinationConfig(targetDestination);
  return (
    <DestinationExperience
      key={destination.id}
      targetDestination={destination.id}
      introTitle={introTitle}
      hydrated={hydrated}
      staticDevice={staticDevice}
    />
  );
}
