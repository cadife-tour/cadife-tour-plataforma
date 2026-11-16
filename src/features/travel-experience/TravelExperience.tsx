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

import { JOURNEY_SCENES, PLAYLIST_DESTINATIONS, getSceneTiming } from "./config/journeyScenes";
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
  autoAdvance?: boolean;
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
  autoAdvance = false,
  onDestinationEnd,
  onSelectDestination,
  playlist,
  playlistIndex,
}: TravelExperienceProps & {
  continuation?: boolean;
  active?: boolean;
  track?: HTMLElement;
  sharedFrame?: boolean;
  hydrated: boolean;
  staticDevice: boolean;
  onDestinationEnd?: () => void;
  onSelectDestination?: (index: number) => void;
  playlist?: readonly string[];
  playlistIndex?: number;
}) {
  const destination = getDestinationConfig(targetDestination);
  const timing = getSceneTiming(destination.id);
  const [nearby, setNearby] = useState(!continuation);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [mediaFailed, setMediaFailed] = useState(false);
  const endedTriggeredRef = useRef(false);
  const useStaticFallback = !destination.media.videoSrc || staticDevice || mediaFailed;

  useEffect(() => {
    endedTriggeredRef.current = false;
  }, [destination.id]);

  const triggerNext = () => {
    if (endedTriggeredRef.current) return;
    endedTriggeredRef.current = true;
    onDestinationEnd?.();
  };

  const handleEnded = () => {
    if (autoAdvance) {
      triggerNext();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && Number.isFinite(video.duration) && video.duration > 0) {
      const p = video.currentTime / video.duration;
      setProgress(p);
      if (p >= 0.995 && autoAdvance) {
        triggerNext();
      }
    }
  };

  useEffect(() => {
    if (!autoAdvance || !hydrated || useStaticFallback || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    setProgress(0);
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {
      // Ignore environments without play support
    }
  }, [autoAdvance, destination.id, hydrated, useStaticFallback]);

  useEffect(() => {
    if (
      !autoAdvance ||
      useStaticFallback ||
      !videoRef.current ||
      !containerRef.current ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const video = videoRef.current;
    const container = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoAdvance, useStaticFallback]);

  useEffect(() => {
    if (!autoAdvance || !playlist || playlistIndex === undefined) return;
    const nextIdx = (playlistIndex + 1) % playlist.length;
    const nextDest = getDestinationConfig(playlist[nextIdx]);
    if (nextDest.media.videoSrc) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = nextDest.media.videoSrc;
      document.head.appendChild(link);
      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }
  }, [autoAdvance, playlist, playlistIndex]);

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
    if (autoAdvance) return;
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
    autoAdvance,
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
          : autoAdvance
            ? "relative h-svh w-full overflow-hidden border-b border-border md:h-screen"
            : "relative h-[var(--scene-mobile)] w-full border-b border-border md:h-[var(--scene-desktop)]"
      }
      style={sharedFrame || autoAdvance ? undefined : sceneHeight(destination.id, false, false)}
      aria-label="Experiência de Viagem CADIFE Tour — Trilha Interativa"
      data-testid="travel-experience-hero"
    >
      <div
        className={
          sharedFrame || autoAdvance
            ? "relative h-full w-full overflow-hidden bg-[#141312]"
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
            autoPlay={autoAdvance}
            preload={nearby ? "auto" : "none"}
            aria-hidden="true"
            onError={() => setMediaFailed(true)}
            onEnded={handleEnded}
            onTimeUpdate={autoAdvance ? handleTimeUpdate : undefined}
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

        {autoAdvance && playlist && playlist.length > 1 && (
          <nav
            aria-label="Navegação da jornada de vídeos"
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md sm:px-4 sm:py-2"
          >
            <button
              type="button"
              onClick={() =>
                onSelectDestination?.((playlistIndex! - 1 + playlist.length) % playlist.length)
              }
              aria-label="Vídeo anterior"
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              ‹
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {playlist.map((destId, idx) => {
                const isActive = idx === playlistIndex;
                const destConf = getDestinationConfig(destId);
                return (
                  <button
                    key={destId}
                    type="button"
                    onClick={() => onSelectDestination?.(idx)}
                    aria-label={`Ver vídeo de ${destConf.country}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? "h-2 w-7 bg-brand-accent shadow-[0_0_8px_rgba(221,11,14,0.6)]"
                        : "h-2 w-2 bg-white/40 hover:bg-white/80"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onSelectDestination?.((playlistIndex! + 1) % playlist.length)}
              aria-label="Próximo vídeo"
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              ›
            </button>
          </nav>
        )}
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
  autoAdvance = false,
}: TravelExperienceProps = {}) {
  const [hydrated, setHydrated] = useState(false);
  const { isReducedMotion, isSaveData, isConstrainedDevice } = useGpuCapability();
  const staticDevice = hydrated && (isReducedMotion || isSaveData || isConstrainedDevice);
  const [playlistIndex, setPlaylistIndex] = useState(0);

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

  const activeDestination = autoAdvance
    ? (PLAYLIST_DESTINATIONS[playlistIndex] ?? "chile")
    : targetDestination;
  const destination = getDestinationConfig(activeDestination);

  const handleNextDestination = () => {
    setPlaylistIndex((prev) => (prev + 1) % PLAYLIST_DESTINATIONS.length);
  };

  const handleSelectDestination = (index: number) => {
    setPlaylistIndex(index);
  };

  return (
    <DestinationExperience
      key={destination.id}
      targetDestination={destination.id}
      introTitle={introTitle}
      hydrated={hydrated}
      staticDevice={staticDevice}
      autoAdvance={autoAdvance}
      continuation={autoAdvance && playlistIndex > 0}
      onDestinationEnd={handleNextDestination}
      onSelectDestination={handleSelectDestination}
      playlist={autoAdvance ? PLAYLIST_DESTINATIONS : undefined}
      playlistIndex={autoAdvance ? playlistIndex : undefined}
    />
  );
}
