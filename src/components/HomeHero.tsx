"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { siteConfig } from "@/lib/navigation";

export function HomeHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-logo]", {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
      })
        .from(
          "[data-hero-fade]",
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .from(
          "[data-hero-cta]",
          {
            y: 16,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-36 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center">
        <div data-hero-logo className="mb-10">
          <Image
            src="/logo.png"
            alt="1take.records"
            width={480}
            height={180}
            priority
            className="mx-auto h-auto w-full max-w-[min(90vw,28rem)]"
          />
        </div>

        <p
          data-hero-fade
          className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500"
        >
          {siteConfig.tagline}
        </p>

        <p
          data-hero-fade
          className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base"
        >
          Nagrania, miks, mastering i produkcja — jeden take, jeden standard.
          Poznaj naszych artystów, inżynierów i beatmakerów.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            data-hero-cta
            href="/studio"
            className="inline-flex items-center border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
          >
            Nasze studio
          </Link>
          <Link
            data-hero-cta
            href="/o-nas"
            className="inline-flex items-center border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50"
          >
            O nas
          </Link>
        </div>
      </div>
    </section>
  );
}

