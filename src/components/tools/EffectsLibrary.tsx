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
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {activeCategory && category ? (
        <>
          <div className="mb-5 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={() => {
                stop();
                setActiveCategory(null);
              }}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              Kategorie
            </button>
            <h2 className="text-2xl font-semibold tracking-wide text-white">
              {category.title}
            </h2>
            <p className="max-w-xl text-sm text-zinc-500">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-0 overflow-visible sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {effects.map((effect) => (
              <EffectTile
                key={effect.slug}
                effect={effect}
                playing={playingId === effect.slug}
                onPreview={() => toggle(effect.slug, effect.previewSrc)}
                onTutorial={() => openTutorial(effect)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
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
      )}

      <p className="mt-10 text-center">
        <Link
          href="/#narzedzia"
          className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-600 transition-colors hover:text-white"
        >
          ← Wszystkie narzędzia
        </Link>
      </p>

      <TutorialModal effect={tutorial} onClose={closeTutorial} />
    </div>
  );
}
