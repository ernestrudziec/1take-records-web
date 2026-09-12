import type { Metadata } from "next";
import { EffectsLibrary } from "@/components/tools/EffectsLibrary";

export const metadata: Metadata = {
  title: "Production effects and ideas library",
  description:
    "Katalog efektów i pomysłów produkcyjnych od 1take records — vocals i general.",
};

export default function EffectsLibraryPage() {
  return <EffectsLibrary />;
}
