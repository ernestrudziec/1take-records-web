"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    step: "01",
    title: "Pomysł & pre-produkcja",
    description:
      "Omawiamy wizję utworu, referencje i plan sesji. Ustalamy brzmienie, zanim włączymy pierwszy mikrofon.",
  },
  {
    step: "02",
    title: "Nagranie",
    description:
      "Sesja w studio na Tęczowej 23 — wokal, instrumenty, ad-liby. Jeden take, jeden standard jakości.",
  },
  {
    step: "03",
    title: "Miks & mastering",
    description:
      "Obróbka, balans i finalny master. Dźwięk gotowy na Spotify, Apple Music i inne platformy.",
  },
  {
    step: "04",
    title: "Release",
    description:
      "Gotowy plik, spójna wizja i wsparcie przy wydaniu. Od studia prosto do słuchaczy.",
  },
];

const stats = [
  { value: "7+", label: "Artystów w rosterze" },
  { value: "1", label: "Studio we Wrocławiu" },
  { value: "360°", label: "Produkcja end-to-end" },
];

export function HomeProcess() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <SectionHeading
        eyebrow="Proces"
        title="Od pomysłu do gotowego utworu"
        description="Przejrzysty workflow, w którym każdy etap ma swoje miejsce — bez chaosu, bez kompromisów."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-4">
        {steps.map((item, index) => (
          <motion.article
            key={item.step}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="flex flex-col items-center gap-4 border border-white/10 bg-zinc-950 p-6 text-center sm:flex-row sm:text-left"
          >
            <span className="text-2xl font-semibold text-zinc-600">
              {item.step}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {item.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-white/10 bg-black px-6 py-8 text-center"
          >
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
