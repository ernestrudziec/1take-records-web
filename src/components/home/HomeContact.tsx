import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/lib/navigation";

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
] as const;

export function HomeContact() {
  return (
    <section id="kontakt" className="border-t border-white/10 px-6 py-20 scroll-mt-8">
      <SectionHeading
        eyebrow="Kontakt"
        title="Porozmawiajmy"
        description="Napisz, zadzwoń lub umów sesję — odpowiemy najszybciej jak to możliwe."
      />

      <div className="mx-auto mt-12 max-w-2xl border border-white/10 bg-zinc-950 px-8 py-12 text-center">
        <div className="space-y-6">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Mail className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-white md:text-xl">
              {siteConfig.email}
            </span>
          </a>

          <div className="flex flex-col items-center gap-2">
            <Phone className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="text-lg font-semibold text-white transition-opacity hover:opacity-80 md:text-xl"
            >
              {siteConfig.phone}
            </a>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] text-zinc-500">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="transition-colors hover:text-white"
              >
                Telefon
              </a>
              <span className="text-zinc-700">·</span>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp
              </a>
              <span className="text-zinc-700">·</span>
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:border-white/50 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-600">@1take.pl</p>

        <Link
          href="/booking"
          className="mt-10 inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
        >
          Booking
        </Link>
      </div>
    </section>
  );
}
