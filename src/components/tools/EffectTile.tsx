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
  const cardRef = useRef<HTMLDivElement>(null);
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

  const glow = effect.glow;
  const hoverGlow = `${-tilt.ry}px ${tilt.rx + 10}px 22px rgba(0,0,0,0.45)`;
  const playGlow = `inset 0 0 0 1px ${glow}, 0 0 18px ${glow}3d`;

  return (
    <div
      className="relative aspect-square h-full w-full perspective-[900px]"
      style={{ zIndex: hovering || playing ? 20 : 1 }}
    >
      <div
        ref={cardRef}
        onPointerEnter={() => setHovering(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group relative flex h-full w-full cursor-pointer flex-col bg-zinc-950 will-change-transform"
        style={{
          boxShadow: playing ? playGlow : hovering ? hoverGlow : undefined,
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovering ? 12 : 0}px)`,
          transformStyle: "preserve-3d",
          transition: hovering
            ? "transform 80ms linear, box-shadow 160ms ease"
            : "transform 280ms ease, box-shadow 280ms ease",
        }}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${playing ? "animate-preview-glow" : ""}`}
          style={{
            background: playing
              ? `radial-gradient(circle at 50% 38%, ${glow}26, transparent 62%)`
              : hovering
                ? `radial-gradient(320px circle at ${tilt.px}% ${tilt.py}%, ${glow}21, transparent 48%)`
                : `radial-gradient(280px circle at 50% 38%, ${glow}1c, transparent 52%)`,
            boxShadow: playing
              ? `inset 0 0 0 1px ${glow}, inset 0 0 28px ${glow}30, 0 0 20px ${glow}40`
              : undefined,
          }}
          aria-hidden
        />

        <div
          className={`relative flex h-full min-h-0 flex-1 flex-col ${playing ? "animate-preview-scale" : ""}`}
        >
          <button
            type="button"
            onClick={onPreview}
            aria-pressed={playing}
            aria-label={`${effect.name}, ${playing ? "stop preview" : "preview"}`}
            className="relative flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center px-2 text-center"
            style={{ transform: "translateZ(20px)" }}
          >
            <div
              className="relative isolate h-9 w-9 sm:h-12 sm:w-12"
              style={{
                filter: playing
                  ? `drop-shadow(0 0 16px ${glow}99)`
                  : hovering
                    ? `drop-shadow(0 0 17px ${glow}8c)`
                    : `drop-shadow(0 0 14px ${glow}75)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${effect.gradient}`}
                aria-hidden
              />
              <Icon
                className="relative h-full w-full text-black mix-blend-destination-in"
                strokeWidth={1.75}
              />
            </div>
            <h3
              className={`mt-1.5 bg-linear-to-br ${effect.gradient} bg-clip-text text-[11px] font-semibold leading-tight text-transparent sm:mt-2 sm:text-sm`}
              style={{
                filter: playing
                  ? `drop-shadow(0 0 8px ${glow}bb)`
                  : hovering
                    ? `drop-shadow(0 0 8px ${glow}bb)`
                    : `drop-shadow(0 0 7px ${glow}9c)`,
              }}
            >
              {effect.name}
            </h3>
          </button>

          <div
            className="relative grid grid-cols-2 border-t border-white/10"
            style={{ transform: "translateZ(16px)" }}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPreview();
              }}
              aria-pressed={playing}
              aria-label={playing ? "Stop preview" : "Preview"}
              className={`inline-flex cursor-pointer items-center justify-center border-r border-white/10 bg-transparent py-2 transition-colors hover:bg-transparent active:bg-transparent sm:py-2.5 ${
                playing ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Play className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onTutorial();
              }}
              aria-label="Tutorial"
              className="inline-flex cursor-pointer items-center justify-center bg-transparent py-2 text-zinc-300 transition-colors hover:bg-transparent hover:text-white active:bg-transparent sm:py-2.5"
            >
              <Video className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
