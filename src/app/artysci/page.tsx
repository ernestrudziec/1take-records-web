import type { Metadata } from "next";
import { ArtistGrid } from "@/components/ArtistGrid";
import { PageHero } from "@/components/PageHero";
import { artists } from "@/lib/artists";

export const metadata: Metadata = {
  title: "Nasi artyści",
  description: "Poznaj artystów współpracujących z 1take.records.",
};

export default function ArtistsPage() {
  return (
    <>
      <PageHero
        eyebrow="Roster"
        title="Nasi artyści"
        description="Artyści, z którymi nagrywamy, miksujemy i wydajemy muzykę w 1take.records."
      />
      <ArtistGrid artists={artists} />
    </>
  );
}
