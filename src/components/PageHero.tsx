"use client";

import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`border-b border-white/10 text-center ${
        compact
          ? "px-5 pb-8 pt-10 md:pb-14 md:pt-16"
          : "px-6 pb-16 pt-16 md:pb-20 md:pt-20"
      }`}
    >
      <div className="mx-auto max-w-2xl">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-semibold tracking-wide text-white ${
            compact ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"
          }`}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mx-auto max-w-xl leading-relaxed text-zinc-400 ${
            compact
              ? "mt-3 text-sm md:mt-5 md:text-base"
              : "mt-6 text-base md:text-lg"
          }`}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
