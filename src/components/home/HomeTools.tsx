import Link from "next/link";
import { Download, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/navigation";

const tools = [
  {
    icon: Download,
    title: "1take beats downloader",
    description:
      "Kolejkuj beaty z YouTube jako 320 kbps MP3, z automatyczną analizą BPM i tonacji. Aplikacja na macOS (Apple Silicon) — bez Homebrew.",
    href: siteConfig.tools.beatsDownloaderReleases,
    external: true,
    cta: "Pobierz",
  },
  {
    icon: Sparkles,
    title: "Production effects and ideas library",
    description:
      "Katalog efektów i pomysłów produkcyjnych. Odsłuchaj preview i zobacz tutorial, jak to zrobić w sesji.",
    href: "/narzedzia/efekty",
    external: false,
    cta: "Otwórz",
  },
] as const;

export function HomeTools() {
  return (
    <section
      id="narzedzia"
      className="scroll-mt-8 border-t border-white/10 px-5 py-14 sm:px-6 sm:py-20"
    >
      <SectionHeading
        eyebrow="Narzędzia"
        title="Narzędzia od 1take records"
        description="Darmowe narzędzia ze studia — downloader beatów i biblioteka efektów produkcyjnych."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const content = (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
                <tool.icon className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {tool.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {tool.description}
              </p>
              <span className="mt-6 inline-flex border border-white bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors group-hover:bg-zinc-200">
                {tool.cta}
              </span>
            </>
          );

          const className =
            "group flex h-full flex-col items-center border border-white/10 bg-zinc-950 p-6 text-center transition-colors hover:border-white/25 sm:p-8";

          if (tool.external) {
            return (
              <a
                key={tool.title}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={tool.title} href={tool.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
