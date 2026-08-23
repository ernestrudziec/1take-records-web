import type { Metadata } from "next";
import Link from "next/link";
import { LocationDetails, LocationMap } from "@/components/LocationMap";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { studioLocation } from "@/lib/location";
import { siteConfig } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "O nas",
  description: "Kim jesteśmy — 1take.records, studio nagraniowe we Wrocławiu.",
};

const values = [
  {
    title: "Jeden take, jeden standard",
    description:
      "Nie traktujemy nagrania jak wersji roboczej. Każda sesja, miks i master mają być gotowe do publikacji — bez kompromisów w jakości.",
  },
  {
    title: "Ekipa, nie tylko studio",
    description:
      "1take.records to artyści, inżynierowie dźwięku i beatmakerzy pracujący razem. Dzięki temu proces od pomysłu do release'u jest spójny i szybki.",
  },
  {
    title: "Wrocławskie serce muzyki",
    description:
      "Studio na Tęczowej 23 to miejsce, w którym rodzą się nowe brzmienia. Blisko centrum, z przestrzenią zaprojektowaną pod kreatywność i skupienie.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="O nas"
        description="1take.records to wrocławskie studio nagraniowe, w którym spotykają się artyści, producenci i inżynierowie dźwięku."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center text-base leading-relaxed text-zinc-400">
          <p>
            Założyliśmy 1take.records z prostą ideą: nagranie ma brzmieć
            profesjonalnie za pierwszym razem. Nie chodzi o perfekcjonizm dla
            samego perfekcjonizmu — chodzi o szacunek do muzyki i do artystów,
            którzy nam ją powierzają.
          </p>
          <p>
            W naszym rosterze są artyści reprezentujący hip-hop, trap, R&B i
            urban pop. Współpracujemy z inżynierami dźwięku i beatmakerami,
            którzy znają ten świat od podszewki. Efekt? Proces, w którym nie
            gubisz się między studiem, producentem a masteringiem — wszystko
            dzieje się w jednym miejscu.
          </p>
          <p>
            Studio na{" "}
            <span className="text-white">{studioLocation.fullAddress}</span> to
            przestrzeń zaprojektowana pod nagrania wokalne, miks, mastering i
            pełną produkcję. Niezależnie od tego, czy nagrywasz singiel, EP czy
            album — dostajesz zespół, który rozumie, dokąd zmierzasz.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4">
          {values.map((value) => (
            <article
              key={value.title}
              className="border border-white/10 bg-zinc-950 p-8 text-center"
            >
              <h2 className="text-lg font-semibold text-white">{value.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <SectionHeading
          eyebrow="Lokalizacja"
          title="Tu nas znajdziesz"
          description="Nasze studio mieści się we Wrocławiu przy Tęczowej 23."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <LocationMap />
          <LocationDetails />
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Kontakt
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 block text-2xl font-semibold tracking-wide text-white transition-opacity hover:opacity-70 md:text-3xl"
          >
            {siteConfig.email}
          </a>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-500">
            Napisz do nas w sprawie rezerwacji studia, współpracy lub nagrań.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/studio"
              className="border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
            >
              Nasze studio
            </Link>
            <Link
              href="/artysci"
              className="border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
            >
              Nasi artyści
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
