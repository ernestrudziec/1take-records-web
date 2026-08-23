"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/navigation";

const socialLinks = [
  { label: "IG", href: siteConfig.social.instagram },
  { label: "FB", href: siteConfig.social.facebook },
  { label: "IN", href: siteConfig.social.linkedin },
] as const;

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/booking")) return null;

  return (
    <footer className="border-t border-white/10 bg-black text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-10">
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-600 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} {siteConfig.name}. Wszelkie prawa
          zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
