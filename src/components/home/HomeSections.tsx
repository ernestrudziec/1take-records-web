import Link from "next/link";
import { LocationDetails, LocationMap } from "@/components/LocationMap";
import { SectionHeading } from "@/components/SectionHeading";
import { navLinks } from "@/lib/navigation";

export function HomeLocation() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <SectionHeading
        eyebrow="Lokalizacja"
        title="Znajdź nas we Wrocławiu"
        description="Studio mieści się przy Tęczowej 23 — dogodna lokalizacja z szybkim dojazdem z centrum miasta."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-8">
        <LocationMap />
        <LocationDetails />
      </div>
    </section>
  );
}

export function HomeExplore() {
  return (
    <section className="border-t border-white/10 px-6 py-20 text-center">
      <SectionHeading
        eyebrow="Odkryj"
        title="Więcej o 1take.records"
        description="Przejdź do sekcji, które Cię interesują."
      />

      <div className="mx-auto mt-12 grid max-w-3xl gap-4">
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="group border border-white/10 bg-zinc-950 px-8 py-7 transition-all hover:border-white/30 hover:bg-zinc-900"
          >
            <span className="text-xs text-zinc-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold tracking-wide text-white">
              {link.label}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">Przejdź do sekcji →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-2xl border border-white/10 bg-zinc-950 px-8 py-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          Gotowy na sesję?
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
          Zarezerwuj studio lub napisz do nas
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
          Nagrania, miks, mastering, produkcja — umów się na sesję w 1take.records
          na Tęczowej 23 we Wrocławiu.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:kontakt@1take.records"
            className="inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
          >
            Napisz do nas
          </a>
          <Link
            href="/studio"
            className="inline-flex border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50"
          >
            Nasze studio
          </Link>
        </div>
      </div>
    </section>
  );
}
