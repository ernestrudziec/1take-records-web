import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { siteConfig } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "O nas",
  description: "Kim jesteśmy — 1take.records.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="O nas"
        description="1take.records to studio nagraniowe łączące artystów, inżynierów i producentów w jednej ekipie."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-zinc-400">
          <p>
            Wierzymy w jakość bez kompromisów. Każde nagranie, miks i master
            traktujemy jak finalny produkt — nie demo, nie wersję roboczą.
          </p>
          <p>
            Nasz zespół to artyści, inżynierowie dźwięku i beatmakerzy, którzy
            współpracują na co dzień. Dzięki temu proces od pomysłu do
            gotowego utworu jest spójny i szybki.
          </p>
          <p>
            Strona jest w budowie — wkrótce dodamy pełne profile, portfolio i
            formularz kontaktowy.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl border border-white/10 bg-zinc-950 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Kontakt
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 block font-display text-3xl tracking-wide text-white transition-opacity hover:opacity-70"
          >
            {siteConfig.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="border border-white/20 px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
            >
              Nasze studio
            </Link>
            <Link
              href="/artysci"
              className="border border-white/20 px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
            >
              Nasi artyści
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
