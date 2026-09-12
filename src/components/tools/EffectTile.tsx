"use client";

import {
  Activity,
  AlignHorizontalSpaceAround,
  Aperture,
  ArrowRightLeft,
  AudioLines,
  Bot,
  Bug,
  CircleDot,
  Cloud,
  CloudMoon,
  Crown,
  Disc3,
  DoorOpen,
  Drum,
  Eye,
  Flame,
  FlipHorizontal2,
  Flower2,
  Gamepad2,
  Ghost,
  Grid3x3,
  Hash,
  Heart,
  Hourglass,
  Keyboard,
  Layers,
  Library,
  Megaphone,
  MessagesSquare,
  Mic,
  Moon,
  Mountain,
  Move,
  Music,
  Orbit,
  Pause,
  Phone,
  Piano,
  Play,
  Radio,
  RefreshCw,
  Repeat2,
  Rewind,
  Rocket,
  Scan,
  Scissors,
  Send,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Speaker,
  Split,
  Square,
  StretchHorizontal,
  Target,
  Timer,
  TrendingUp,
  Undo2,
  Video,
  Volume2,
  Waves,
  Wind,
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
  timer: Timer,
  layers: Layers,
  volume: Volume2,
  "circle-dot": CircleDot,
  speaker: Speaker,
  scissors: Scissors,
  hash: Hash,
  rocket: Rocket,
  repeat: Repeat2,
  wind: Wind,
  undo: Undo2,
  drum: Drum,
  hourglass: Hourglass,
  aperture: Aperture,
  split: Split,
  gamepad: Gamepad2,
  radio: Radio,
  eye: Eye,
  bot: Bot,
  refresh: RefreshCw,
  mic: Mic,
  grid: Grid3x3,
  keyboard: Keyboard,
  target: Target,
  crown: Crown,
};

type EffectTileProps = {
  effect: ProductionEffect;
  playing: boolean;
  onPreview: () => void;
  onTutorial: () => void;
};

const MAX_TILT = 11;

function GradientIcon({
  icon: Icon,
  gradientId,
  stops,
}: {
  icon: LucideIcon;
  gradientId: string;
  stops: [string, string, string];
}) {
  const [from, via, to] = stops;

  return (
    <Icon
      aria-hidden
      className="h-full w-full"
      strokeWidth={1.75}
      color={`url(#${gradientId})`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop offset="0%" stopColor={from} />
          <stop offset="50%" stopColor={via} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
    </Icon>
  );
}

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
    if (event.pointerType === "touch") return;
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
      className="relative aspect-square w-full perspective-[900px] lg:h-full"
      style={{ zIndex: hovering || playing ? 20 : 1 }}
    >
      <div
        ref={cardRef}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          setHovering(true);
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden bg-zinc-950 will-change-transform"
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
                : `radial-gradient(280px circle at 50% 38%, ${glow}1a, transparent 52%)`,
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
            className="relative z-0 flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center px-2 text-center"
          >
            <div
              className="relative h-9 w-9 sm:h-12 sm:w-12"
              style={{
                filter: playing
                  ? `drop-shadow(0 0 16px ${glow}99)`
                  : hovering
                    ? `drop-shadow(0 0 17px ${glow}8c)`
                    : `drop-shadow(0 0 13px ${glow}6f)`,
              }}
            >
              <GradientIcon
                icon={Icon}
                gradientId={`effect-icon-${effect.category}-${effect.slug}`}
                stops={effect.stops}
              />
            </div>
            <h3
              className="mt-1.5 line-clamp-2 max-w-full px-1 text-[11px] font-semibold leading-tight text-transparent sm:mt-2 sm:text-sm"
              style={{
                backgroundImage: `linear-gradient(135deg, ${effect.stops[0]}, ${effect.stops[1]}, ${effect.stops[2]})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                filter: playing
                  ? `drop-shadow(0 0 8px ${glow}bb)`
                  : hovering
                    ? `drop-shadow(0 0 8px ${glow}bb)`
                    : `drop-shadow(0 0 7px ${glow}94)`,
              }}
            >
              {effect.name}
            </h3>
          </button>

          <div className="relative z-20 grid shrink-0 grid-cols-2 border-t border-white/10">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPreview();
              }}
              aria-pressed={playing}
              aria-label={playing ? "Stop preview" : "Preview"}
              className={`flex h-8 w-full cursor-pointer items-center justify-center border-r border-white/10 bg-transparent transition-colors hover:bg-white/5 sm:h-11 ${
                playing ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
            >
              {playing ? (
                <Pause className="pointer-events-none h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Play className="pointer-events-none h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onTutorial();
              }}
              aria-label="Tutorial"
              className="flex h-8 w-full cursor-pointer items-center justify-center bg-transparent text-zinc-300 transition-colors hover:bg-white/5 hover:text-white sm:h-11"
            >
              <Video className="pointer-events-none h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
