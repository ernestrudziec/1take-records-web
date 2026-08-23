import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PlaceholderGrid } from "@/components/PlaceholderGrid";

export const metadata: Metadata = {
  title: "Nasi inżynierowie",
  description: "Inżynierowie dźwięku w 1take.records.",
};

const engineers = ["Inżynier 01", "Inżynier 02", "Inżynier 03"];

export default function EngineersPage() {
  return (
    <>
      <PageHero
        eyebrow="Sound"
        title="Nasi inżynierowie"
        description="Miks, mastering i nagrania na najwyższym poziomie. Poznaj zespół za konsoletą."
      />
      <PlaceholderGrid items={engineers} />
    </>
  );
}
