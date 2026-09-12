"use client";

import {
  Activity,
  AlignHorizontalSpaceAround,
  ArrowRightLeft,
  AudioLines,
  Bug,
  Cloud,
  CloudMoon,
  Disc3,
  DoorOpen,
  Flame,
  FlipHorizontal2,
  Flower2,
  Ghost,
  Heart,
  Library,
  Megaphone,
  MessagesSquare,
  Moon,
  Mountain,
  Move,
  Music,
  Orbit,
  Pause,
  Phone,
  Piano,
  Play,
  Rewind,
  Scan,
  Send,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Square,
  StretchHorizontal,
  TrendingUp,
  Video,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useRef, useState, type PointerEvent } from "react";
import type { EffectIcon, ProductionEffect } from "@/lib/effects";

const effectIcons: Record<EffectIcon, LucideIcon> = {
  rewind: Rewind,
  sliders: SlidersHorizontal,
  messages: MessagesSquare,
  ghost: Ghost,
  flame: Flame,
  flip: FlipHorizontal2,
  sparkles: Sparkles,
  swap: ArrowRightLeft,
  piano: Piano,
  heart: Heart,
  zap: Zap,
  gap: AlignHorizontalSpaceAround,
  flower: Flower2,
  waves: Waves,
  stretch: StretchHorizontal,
  square: Square,
  cloud: Cloud,
  phone: Phone,
  orbit: Orbit,
  move: Move,
  bug: Bug,
  riser: TrendingUp,
  music: Music,
  scan: Scan,
  shuffle: Shuffle,
  distortion: AudioLines,
  moon: Moon,
  ambience: CloudMoon,
  disc: Disc3,
  megaphone: Megaphone,
  mountain: Mountain,
  send: Send,
  library: Library,
  door: DoorOpen,
  stutter: Activity,
};

type EffectTileProps = {
  effect: ProductionEffect;
  playing: boolean;
  onPreview: () => void;
  onTutorial: () => void;
};

const MAX_TILT = 11;

export function EffectTile({
  effect,
  playing,
  onPreview,
  onTutorial,
}: EffectTileProps) {
  const Icon = effectIcons[effect.icon];
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 40 });
  const [hovering, setHovering] = useState(false);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * MAX_TILT,
      ry: (px - 0.5) * MAX_TILT,
      px: px * 100,
      py: py * 100,
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovering(false);
    setTilt({ rx: 0, ry: 0, px: 50, py: 40 });
  }, []);

  return (
    <div className="[perspective:900px]">
      <article
        ref={cardRef}
        onPointerEnter={() => setHovering(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group relative flex aspect-square flex-col border bg-zinc-950 will-change-transform"
        style={{
          borderColor: playing ? `${effect.glow}99` : "rgba(255,255,255,0.1)",
          boxShadow: hovering
            ? `${-tilt.ry * 1.4}px ${tilt.rx * 1.6 + 14}px 32px rgba(0,0,0,0.55), 0 0 0 1px ${effect.glow}33, 0 18px 40px ${effect.glow}18`
            : playing
              ? `0 0 0 1px ${effect.glow}55, 0 10px 28px ${effect.glow}22`
              : undefined,
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovering ? 18 : 0}px)`,
          transformStyle: "preserve-3d",
          transition: hovering
            ? "transform 80ms linear, box-shadow 160ms ease"
            : "transform 280ms ease, box-shadow 280ms ease",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${tilt.px}% ${tilt.py}%, ${effect.glow}28, transparent 46%)`,
          }}
          aria-hidden
        />

        <div
          className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2.5 text-center"
          style={{ transform: "translateZ(28px)" }}
        >
          <div
            className={`flex h-11 w-11 items-center justify-center bg-linear-to-br ${effect.gradient} sm:h-12 sm:w-12`}
            style={{
              boxShadow: hovering || playing ? `0 10px 22px ${effect.glow}40` : undefined,
            }}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
          </div>
          <h3
            className={`mt-2.5 bg-linear-to-br ${effect.gradient} bg-clip-text text-[13px] font-semibold leading-tight text-transparent sm:text-sm`}
          >
            {effect.name}
          </h3>
        </div>

        <div
          className="relative grid grid-cols-2 border-t border-white/10"
          style={{ transform: "translateZ(16px)" }}
        >
          <button
            type="button"
            onClick={onPreview}
            aria-pressed={playing}
            className={`inline-flex items-center justify-center gap-1 border-r border-white/10 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors sm:text-[11px] ${
              playing
                ? "bg-white text-black"
                : "text-zinc-300 hover:bg-white hover:text-black"
            }`}
          >
            {playing ? (
              <Pause className="h-3 w-3" strokeWidth={2} />
            ) : (
              <Play className="h-3 w-3" strokeWidth={2} />
            )}
            {playing ? "Stop" : "Preview"}
          </button>
          <button
            type="button"
            onClick={onTutorial}
            className="inline-flex items-center justify-center gap-1 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:bg-white hover:text-black sm:text-[11px]"
          >
            <Video className="h-3 w-3" strokeWidth={2} />
            Tutorial
          </button>
        </div>
      </article>
    </div>
  );
}
