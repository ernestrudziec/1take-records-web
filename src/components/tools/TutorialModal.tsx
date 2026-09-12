"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductionEffect } from "@/lib/effects";

type TutorialModalProps = {
  effect: ProductionEffect | null;
  onClose: () => void;
};

export function TutorialModal({ effect, onClose }: TutorialModalProps) {
  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const videoFailed = Boolean(effect && failedSlug === effect.slug);

  useEffect(() => {
    if (!effect) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [effect, onClose]);

  return (
    <AnimatePresence>
      {effect && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center px-0 sm:items-center sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Zamknij"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-w-3xl sm:rounded-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
              aria-label="Zamknij"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              Tutorial
            </p>
            <h3 className="mt-2 pr-8 text-xl font-semibold text-white">
              {effect.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {effect.description}
            </p>
            <div className="mt-5 overflow-hidden border border-white/10 bg-black">
              {videoFailed ? (
                <div className="flex aspect-video flex-col items-center justify-center px-6 text-center">
                  <p className="text-sm text-zinc-400">
                    Film tutorial jeszcze nie jest wrzucony.
                  </p>
                  <p className="mt-2 max-w-md font-mono text-[11px] leading-relaxed text-zinc-600">
                    public/tools/effects/{effect.category}/{effect.slug}/tutorial.mp4
                  </p>
                </div>
              ) : (
                <video
                  key={effect.tutorialSrc}
                  src={effect.tutorialSrc}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full bg-black"
                  onError={() => setFailedSlug(effect.slug)}
                >
                  <track
                    kind="captions"
                    src="/tools/effects/captions-empty.vtt"
                    srcLang="pl"
                    label="Napisy"
                  />
                </video>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
