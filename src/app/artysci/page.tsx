import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PlaceholderGrid } from "@/components/PlaceholderGrid";

export const metadata: Metadata = {
  title: "Nasi artyści",
  description: "Poznaj artystów współpracujących z 1take.records.",
};

const artists = ["Artysta 01", "Artysta 02", "Artysta 03"];

export default function ArtistsPage() {
  return (
    <>
      <PageHero
        eyebrow="Roster"
        title="Nasi artyści"
        description="Artyści, z którymi nagrywamy, miksujemy i wydajemy muzykę. Profile w przygotowaniu."
      />
      <PlaceholderGrid items={artists} />
    </>
  );
}
