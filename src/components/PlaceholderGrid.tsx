"use client";

import { motion } from "framer-motion";

type PlaceholderGridProps = {
  items: string[];
};

export function PlaceholderGrid({ items }: PlaceholderGridProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-6 py-16">
      {items.map((item, index) => (
        <motion.article
          key={item}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="group overflow-hidden border border-white/10 bg-zinc-950 p-6 text-center transition-colors hover:border-white/25"
        >
          <div className="mx-auto mb-8 aspect-[4/3] max-w-sm bg-gradient-to-br from-zinc-900 to-black" />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
            Wkrótce
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-wide text-white">
            {item}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            Profil w przygotowaniu. Wróć wkrótce po więcej informacji.
          </p>
        </motion.article>
      ))}
    </div>
  );
}
