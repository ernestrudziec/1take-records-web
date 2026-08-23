import { SectionHeading } from "@/components/SectionHeading";
import { studioLocation } from "@/lib/location";

const values = [
  {
    title: "Jeden take, jeden standard",
    description:
      "Nie traktujemy nagrania jak wersji roboczej. Każda sesja, miks i master mają być gotowe do publikacji — bez kompromisów w jakości.",
  },
  {
    title: "Pełen proces w jednym miejscu",
    description:
      "Od nagrania przez miks po mastering — wszystko pod jednym dachem. Bez gubienia się między studiami i osobami.",
  },
  {
    title: "Wrocławskie serce muzyki",
    description:
      "Studio na Tęczowej 23 to miejsce, w którym rodzą się nowe brzmienia. Blisko centrum, z przestrzenią zaprojektowaną pod kreatywność i skupienie.",
  },
];

export function HomeAbout() {
  return (
    <section id="o-nas" className="border-t border-white/10 px-6 py-20 scroll-mt-8">
      <SectionHeading
        eyebrow="O nas"
        title="Kim jesteśmy"
        description="1take.records to wrocławskie studio nagraniowe — nagrania, miks, mastering i produkcja."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-center text-base leading-relaxed text-zinc-400">
        <p>
          Założyliśmy 1take.records z prostą ideą: nagranie ma brzmieć
          profesjonalnie za pierwszym razem. Nie chodzi o perfekcjonizm dla
          samego perfekcjonizmu — chodzi o szacunek do muzyki i do artystów,
          którzy nam ją powierzają.
        </p>
        <p>
          Studio na{" "}
          <span className="text-white">{studioLocation.fullAddress}</span> to
          przestrzeń zaprojektowana pod nagrania wokalne, miks, mastering i
          pełną produkcję. Niezależnie od tego, czy nagrywasz singiel, EP czy
          album — dostajesz zespół, który rozumie, dokąd zmierzasz.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4">
        {values.map((value) => (
          <article
            key={value.title}
            className="border border-white/10 bg-zinc-950 p-8 text-center"
          >
            <h3 className="text-lg font-semibold text-white">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              {value.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
