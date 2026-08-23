import {
  Headphones,
  Mic2,
  Music2,
  SlidersHorizontal,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    icon: Mic2,
    title: "Nagrania wokalne",
    description:
      "Izolowany booth, studyjne mikrofony i monitoring na żywo. Wokale nagrywane z pełną kontrolą nad dynamiką i charakterem.",
  },
  {
    icon: SlidersHorizontal,
    title: "Miks & mastering",
    description:
      "Profesjonalna obróbka w akustycznie przygotowanym pomieszczeniu. Balans, przestrzeń i loudness na poziomie streamingowym.",
  },
  {
    icon: Music2,
    title: "Produkcja",
    description:
      "Pełne spektrum — od beatów i aranżacji po finalny master gotowy do dystrybucji na platformach cyfrowych.",
  },
  {
    icon: Headphones,
    title: "Monitoring & reference",
    description:
      "Porównanie z referencjami branżowymi i dopracowanie detali — żeby każdy utwór brzmiał spójnie na różnych systemach.",
  },
];

export function HomeStudio() {
  return (
    <section id="studio" className="border-t border-white/10 px-6 py-20 scroll-mt-8">
      <SectionHeading
        eyebrow="Studio"
        title="Nasze studio"
        description="Przestrzeń zaprojektowana pod jeden cel: czysty, profesjonalny dźwięk za pierwszym razem."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="border border-white/10 bg-zinc-950 p-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
              <feature.icon className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
