"use client";

import {
  Headphones,
  Mic2,
  Music2,
  Radio,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";

const services = [
  {
    icon: Mic2,
    title: "Nagrania wokalne",
    description:
      "Izolowany booth, studyjne mikrofony i monitoring na żywo — wokale nagrywane tak, jak mają brzmieć na streamingu.",
  },
  {
    icon: SlidersHorizontal,
    title: "Miks & mastering",
    description:
      "Balans, przestrzeń i głośność dopasowane do współczesnych standardów. Od surowych ścieżek do gotowego masteru.",
  },
  {
    icon: Music2,
    title: "Produkcja muzyczna",
    description:
      "Beaty, aranżacje i pełna produkcja utworów — od pierwszego pomysłu po finalny plik gotowy do dystrybucji.",
  },
  {
    icon: Radio,
    title: "Współpraca z artystami",
    description:
      "Roster artystów, inżynierów i beatmakerów w jednym miejscu. Spójny proces od sesji nagraniowej po release.",
  },
  {
    icon: Headphones,
    title: "Mix & reference",
    description:
      "Korekcja, edycja i porównanie z referencjami branżowymi — żeby każdy utwór brzmiał profesjonalnie.",
  },
  {
    icon: Sparkles,
    title: "Kreatywna przestrzeń",
    description:
      "Studio zaprojektowane pod skupienie i flow. Tu rodzą się projekty, które trafiają na platformy streamingowe.",
  },
];

export function HomeServices() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <SectionHeading
        eyebrow="Usługi"
        title="Co robimy w studio"
        description="Pełen proces produkcji muzycznej — od pierwszego nagrania po master gotowy do publikacji."
      />

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="border border-white/10 bg-zinc-950 p-6 text-center transition-colors hover:border-white/25"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
              <service.icon className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              {service.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
