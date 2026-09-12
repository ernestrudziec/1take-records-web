"use client";

import { Pause, Play, Video } from "lucide-react";
import type { ProductionEffect } from "@/lib/effects";

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
  return (
    <article
      className={`flex aspect-square flex-col border bg-zinc-950 transition-colors ${
        playing ? "border-white/40" : "border-white/10"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 text-center">
        <Waveform playing={playing} />
        <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">
          {effect.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
          {effect.description}
        </p>
      </div>

      <div className="grid grid-cols-2 border-t border-white/10">
        <button
          type="button"
          onClick={onPreview}
          aria-pressed={playing}
          className={`inline-flex items-center justify-center gap-1.5 border-r border-white/10 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-xs ${
            playing
              ? "bg-white text-black"
              : "text-zinc-300 hover:bg-white hover:text-black"
          }`}
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          {playing ? "Stop" : "Preview"}
        </button>
        <button
          type="button"
          onClick={onTutorial}
          className="inline-flex items-center justify-center gap-1.5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300 transition-colors hover:bg-white hover:text-black sm:text-xs"
        >
          <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
          Tutorial
        </button>
      </div>
    </article>
  );
}

function Waveform({ playing }: { playing: boolean }) {
  const bars = [18, 32, 22, 40, 16, 28, 36, 20];

  return (
    <div
      className="flex h-10 items-end gap-0.5"
      aria-hidden
    >
      {bars.map((height, index) => (
        <span
          key={height}
          className={`w-1 bg-white/70 ${playing ? "animate-pulse" : "opacity-40"}`}
          style={{
            height: `${height}px`,
            animationDelay: playing ? `${index * 70}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}
