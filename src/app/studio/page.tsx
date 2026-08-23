import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Nasze studio",
  description: "Poznaj studio nagraniowe 1take.records.",
};

const features = [
  {
    title: "Nagrania wokalne",
    description: "Izolowane booth'e, mikrofony studyjne i monitoring na żywo.",
  },
  {
    title: "Miks & mastering",
    description: "Profesjonalna obróbka dźwięku w akustycznie przygotowanym pomieszczeniu.",
  },
  {
    title: "Produkcja",
    description: "Pełne spektrum — od beatów po finalny master gotowy do dystrybucji.",
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
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border border-white/10 bg-zinc-950 p-8"
            >
              <h2 className="font-display text-2xl tracking-wide text-white">
                {feature.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-6xl border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Lokalizacja
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-wide text-white md:text-4xl">
            Wkrótce więcej szczegółów
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Galeria studia, sprzęt i informacje o rezerwacji pojawią się w
            kolejnej iteracji strony.
          </p>
        </div>
      </section>
    </>
  );
}
