"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Artist } from "@/lib/artists";

type ArtistGridProps = {
  artists: Artist[];
};

export function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-6 py-16">
      {artists.map((artist, index) => (
        <motion.article
          key={artist.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
          className="overflow-hidden border border-white/10 bg-zinc-950 text-center transition-colors hover:border-white/25"
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="px-6 pb-8 pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              {artist.genre}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-wide text-white">
              {artist.name}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              {artist.bio}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
