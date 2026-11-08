"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale } from "@/core/i18n/LocaleContext";
import { Container } from "@/shared/ui/Container/Container";
import { WhatsAppCta } from "@/shared/ui/WhatsAppCta";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import journey from "../config/continuousJourney.json";
import { continuousJourneyContent } from "../config/continuousJourneyContent";
import { getDestinationConfig } from "../config/travelExperienceConfig";
import {
  continuousJourneySegments,
  continuousJourneyScrollScale,
} from "../config/continuousJourneyTiming";

/** One pre-edited film: the cabin appears once, cloud returns are baked in. */
export function ContinuousJourneyHero() {
  const { locale } = useLocale();
  const text = continuousJourneyContent[locale];
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [staticLayout, setStaticLayout] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const device = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const constrainedDevice =
      (typeof device.deviceMemory === "number" && device.deviceMemory <= 2) ||
      (typeof device.hardwareConcurrency === "number" && device.hardwareConcurrency <= 2);
    const update = () => {
      const useStatic = motion.matches || Boolean(device.connection?.saveData) || constrainedDevice;
      setAllowVideo(!useStatic);
      setStaticLayout(useStatic);
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!allowVideo || failed || !video || !section) return;
    gsap.registerPlugin(ScrollTrigger);
    let tween: gsap.core.Timeline | undefined;
    const setup = () => {
      if (tween || !Number.isFinite(video.duration) || video.duration <= 0) return;
      video.pause();
      video.currentTime = 0;
      tween = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });
      for (const segment of continuousJourneySegments) {
        tween.fromTo(
          video,
          { currentTime: segment.from },
          {
            currentTime: Math.min(segment.to, video.duration - 1 / 24),
            duration: segment.duration,
            ease: "none",
            immediateRender: false,
          }
        );
      }
      tween.scrollTrigger?.refresh();
    };
    video.addEventListener("loadedmetadata", setup);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setup();
    return () => {
      video.removeEventListener("loadedmetadata", setup);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [allowVideo, failed]);

  const chapter = journey.chapters.find((item) => time >= item.reveal && time < item.returnStart);
  const destination = chapter ? getDestinationConfig(chapter.destination) : undefined;
  const destinationText = destination?.content[locale];

  return (
    <section
      ref={sectionRef}
      aria-label={text.label}
      className={
        !staticLayout && !failed
          ? "relative h-[var(--journey-mobile)] [overflow-anchor:none] motion-reduce:!h-auto md:h-[var(--journey-desktop)]"
          : "relative"
      }
      style={
        !staticLayout && !failed
          ? ({
              "--journey-mobile": `${100 + 1500 * continuousJourneyScrollScale}svh`,
              "--journey-desktop": `${100 + 2100 * continuousJourneyScrollScale}vh`,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="sticky top-0 isolate flex min-h-svh items-center overflow-hidden bg-black py-28 md:min-h-screen">
        <Image
          src={journey.poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {allowVideo && !failed && (
          <video
            ref={videoRef}
            src={journey.src}
            poster={journey.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            onError={() => setFailed(true)}
            onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
        <Container>
          <div className="max-w-3xl space-y-6 text-white">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest">
              CADIFE Tour
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {text.title}
            </h1>
            <p className="max-w-xl text-lg text-white/90 sm:text-xl">{text.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              <WhatsAppCta source="hero_continuous_journey" size="lg">
                {text.cta}
              </WhatsAppCta>
              <a
                href="#destinos"
                className="inline-flex min-h-11 items-center rounded-lg border border-white/70 px-6 py-3 font-heading font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {text.explore}
              </a>
            </div>
            <div className="min-h-20 border-l-2 border-brand-accent pl-4">
              {destinationText && destination && allowVideo && !failed && (
                <>
                  <h2 className="font-heading text-xl font-semibold">{destinationText.title}</h2>
                  <WhatsAppCta
                    source="hero_continuous_destination"
                    destination={destination.whatsappContext}
                    variant="link"
                    className="mt-2 px-0 text-white"
                  >
                    {destinationText.primaryCta}
                  </WhatsAppCta>
                </>
              )}
            </div>
          </div>
        </Container>
        {allowVideo && !failed && (
          <p className="absolute bottom-24 left-5 right-5 text-xs text-white/90 sm:bottom-5 sm:left-auto sm:max-w-64 sm:text-right">
            {text.scrollHint}
          </p>
        )}
      </div>
    </section>
  );
}
