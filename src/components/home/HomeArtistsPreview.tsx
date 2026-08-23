"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { artists } from "@/lib/artists";

export function HomeArtistsPreview() {
  const preview = artists.slice(0, 4);

  return (
    <section className="border-t border-white/10 px-6 py-20">
      <SectionHeading
        eyebrow="Roster"
        title="Nasi artyści"
        description="Twórcy, z którymi nagrywamy i wydajemy muzykę. Poznaj resztę rosteru na dedykowanej podstronie."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {preview.map((artist, index) => (
          <motion.article
            key={artist.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="overflow-hidden border border-white/10 bg-zinc-950 text-center"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                  {artist.genre}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {artist.name}
                </h3>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/artysci"
          className="inline-flex border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50"
        >
          Zobacz wszystkich artystów
        </Link>
      </div>
    </section>
  );
}
