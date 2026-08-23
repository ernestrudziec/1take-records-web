"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";
import { navLinks, siteConfig } from "@/lib/navigation";

export function HomeHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-line]", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
      })
        .from(
          "[data-hero-fade]",
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.4",
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
      className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-20 pt-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl">
        <p
          data-hero-fade
          className="mb-6 text-xs uppercase tracking-[0.35em] text-zinc-500"
        >
          {siteConfig.tagline}
        </p>

        <h1 className="overflow-hidden font-display text-[clamp(3rem,12vw,8rem)] leading-[0.9] tracking-[0.08em] text-white">
          <span data-hero-line className="block">
            1TAKE
          </span>
          <span data-hero-line className="block text-zinc-500">
            .RECORDS
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
        >
          Nagrania, miks, mastering i produkcja — jeden take, jeden standard.
          Poznaj naszych artystów, inżynierów i beatmakerów.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            data-hero-cta
            href="/studio"
            className="inline-flex items-center border border-white bg-white px-6 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
          >
            Nasze studio
          </Link>
          <Link
            data-hero-cta
            href="/o-nas"
            className="inline-flex items-center border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50"
          >
            O nas
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeSections() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Odkryj
        </p>
        <h2 className="mt-4 font-display text-3xl tracking-wide text-white md:text-5xl">
          Wszystko w jednym miejscu
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-white/10 bg-zinc-950 p-8 transition-all hover:border-white/30 hover:bg-zinc-900"
            >
              <span className="text-xs text-zinc-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl tracking-wide text-white transition-transform group-hover:translate-x-1">
                {link.label}
              </h3>
              <p className="mt-3 text-sm text-zinc-500">
                Przejdź do sekcji →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
