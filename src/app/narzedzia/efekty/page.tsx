import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { EffectsLibrary } from "@/components/tools/EffectsLibrary";

export const metadata: Metadata = {
  title: "Production effects and ideas library",
  description:
    "Katalog efektów i pomysłów produkcyjnych od 1take records — vocals i general.",
};

export default function EffectsLibraryPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Narzędzia"
        title="Production effects and ideas library"
        description="Vocals albo general. Odsłuchaj preview i otwórz tutorial, jak zrobić dany efekt."
      />
      <EffectsLibrary />
    </>
  );
}
