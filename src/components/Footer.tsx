import Link from "next/link";
import { Logo } from "@/components/Logo";
import { navLinks, siteConfig } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-12">
        <Logo className="h-8 w-auto opacity-90" />

        <p className="max-w-md text-sm leading-relaxed text-zinc-500">
          {siteConfig.description}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-white"
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

      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} {siteConfig.name}. Wszelkie prawa
          zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
