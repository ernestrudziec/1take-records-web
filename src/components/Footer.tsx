import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg tracking-[0.2em] text-white">
            {siteConfig.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-4">
        <p className="mx-auto max-w-6xl text-xs text-zinc-600">
          © {new Date().getFullYear()} {siteConfig.name}. Wszelkie prawa
          zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
