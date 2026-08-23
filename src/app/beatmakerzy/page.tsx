import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PlaceholderGrid } from "@/components/PlaceholderGrid";

export const metadata: Metadata = {
  title: "Nasi beatmakerzy",
  description: "Beatmakerzy i producenci w 1take.records.",
};

const beatmakers = ["Beatmaker 01", "Beatmaker 02", "Beatmaker 03"];

export default function BeatmakersPage() {
  return (
    <>
      <PageHero
        eyebrow="Production"
        title="Nasi beatmakerzy"
        description="Produkcja, aranżacje i bity — od hip-hopu po elektronikę. Wkrótce więcej profili."
      />
      <PlaceholderGrid items={beatmakers} />
    </>
  );
}
