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

export function EffectTile({
  effect,
  playing,
  onPreview,
  onTutorial,
}: EffectTileProps) {
  const Icon = effectIcons[effect.icon];

  return (
    <article
      className="group relative flex aspect-square flex-col overflow-hidden rounded-xl border bg-zinc-950 transition-[border-color,box-shadow,transform] duration-200"
      style={{
        borderColor: playing ? `${effect.glow}99` : "rgba(255,255,255,0.1)",
        boxShadow: playing
          ? `0 0 0 1px ${effect.glow}55, 0 10px 28px ${effect.glow}22`
          : undefined,
      }}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${effect.gradient}`}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_42%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2.5 text-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-sm sm:h-11 sm:w-11"
          style={{
            boxShadow: playing
              ? `0 0 18px ${effect.glow}66, inset 0 1px 0 rgba(255,255,255,0.2)`
              : undefined,
          }}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
        </div>
        <h3 className="mt-2.5 text-[13px] font-semibold leading-tight text-white sm:text-sm">
          {effect.name}
        </h3>
      </div>

      <div className="relative grid grid-cols-2 gap-px bg-white/10 p-px">
        <button
          type="button"
          onClick={onPreview}
          aria-pressed={playing}
          className={`inline-flex items-center justify-center gap-1 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors sm:text-[11px] ${
            playing
              ? "bg-white text-black"
              : "bg-black/55 text-white/90 hover:bg-white hover:text-black"
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
          className="inline-flex items-center justify-center gap-1 bg-black/55 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white hover:text-black sm:text-[11px]"
        >
          <Video className="h-3 w-3" strokeWidth={2} />
          Tutorial
        </button>
      </div>
    </article>
  );
}
