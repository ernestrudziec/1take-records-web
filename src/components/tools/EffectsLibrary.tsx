"use client";

import { ArrowLeft, Lock, Mic2, Music2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EffectTile } from "@/components/tools/EffectTile";
import { TutorialModal } from "@/components/tools/TutorialModal";
import { usePreviewPlayer } from "@/components/tools/usePreviewPlayer";
import {
  effectCategories,
  effectsByCategory,
  type EffectCategory,
  type ProductionEffect,
} from "@/lib/effects";

const categoryIcons = {
  vocals: Mic2,
  general: Music2,
} as const;

export function EffectsLibrary() {
  const [activeCategory, setActiveCategory] = useState<EffectCategory | null>(
    null,
  );
  const [tutorial, setTutorial] = useState<ProductionEffect | null>(null);
  const { playingId, toggle, stop } = usePreviewPlayer();

  const effects = useMemo(
    () => (activeCategory ? effectsByCategory(activeCategory) : []),
    [activeCategory],
  );

  const category = effectCategories.find((item) => item.id === activeCategory);

  function openTutorial(effect: ProductionEffect) {
    stop();
    setTutorial(effect);
  }

  function closeTutorial() {
    setTutorial(null);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black">
      {activeCategory && category ? (
        <>
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 px-3">
            <button
              type="button"
              onClick={() => {
                stop();
                setActiveCategory(null);
              }}
              className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" strokeWidth={1.75} />
              Kategorie
            </button>
            <h1 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              {category.title}
            </h1>
            <Link
              href="/#narzedzia"
              className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600 transition-colors hover:text-white"
            >
              Narzędzia
            </Link>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-visible">
            <div
              className={
                activeCategory === "general"
                  ? "grid w-[min(100vw,calc((100dvh-2.5rem-95px)*5/20+20px))] grid-cols-5 grid-rows-20 gap-[5px] lg:w-[min(100vw,calc(100dvh-2.5rem))] lg:grid-cols-10 lg:grid-rows-10"
                  : "grid w-[min(100vw,calc((100dvh-2.5rem-30px)*5/7+20px))] grid-cols-5 grid-rows-7 gap-[5px] lg:w-[min(100vw,calc((100dvh-2.5rem-20px)*7/5+30px))] lg:grid-cols-7 lg:grid-rows-5"
              }
            >
              {effects.map((effect) => {
                const playId = `${effect.category}:${effect.slug}`;
                return (
                  <EffectTile
                    key={playId}
                    effect={effect}
                    playing={playingId === playId}
                    onPreview={() => toggle(playId, effect.previewSrc)}
                    onTutorial={() => openTutorial(effect)}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-10 shrink-0 items-center justify-center px-3">
            <h1 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Effects
            </h1>
          </div>
          <div className="mx-auto grid min-h-0 w-full max-w-3xl flex-1 content-center gap-0 px-0 sm:grid-cols-2">
            {effectCategories.map((item) => {
              const Icon = categoryIcons[item.id];

              if (!item.available) {
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center border border-white/5 bg-zinc-950/60 p-8 text-center opacity-40"
                    aria-disabled
                  >
                    <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
                      <Lock className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                      {item.description}
                    </p>
                    <span className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      Wkrótce
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCategory(item.id)}
                  className="group flex flex-col items-center border border-white/10 bg-zinc-950 p-8 text-center transition-colors hover:border-white/25"
                >
                  <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
                    <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex border border-white bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors group-hover:bg-zinc-200">
                    Otwórz
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <TutorialModal effect={tutorial} onClose={closeTutorial} />
    </div>
  );
}
