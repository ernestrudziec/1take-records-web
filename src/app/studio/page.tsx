import type { Metadata } from "next";
import {
  Headphones,
  Mic2,
  Music2,
  SlidersHorizontal,
} from "lucide-react";
import { LocationDetails, LocationMap } from "@/components/LocationMap";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Nasze studio",
  description: "Poznaj studio nagraniowe 1take.records we Wrocławiu.",
};

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

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Space"
        title="Nasze studio"
        description="Przestrzeń zaprojektowana pod jeden cel: czysty, profesjonalny dźwięk za pierwszym razem."
      />

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border border-white/10 bg-zinc-950 p-8 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
                <feature.icon
                  className="h-5 w-5 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <SectionHeading
          eyebrow="Lokalizacja"
          title="Tęczowa 23, Wrocław"
          description="Tu mieści się 1take.records — studio nagraniowe z dogodnym dojazdem z centrum miasta."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <LocationMap />
          <LocationDetails />
        </div>
      </section>
    </>
  );
}
