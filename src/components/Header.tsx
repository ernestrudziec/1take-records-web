"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="relative mx-auto max-w-4xl px-6 py-5 text-center">
        <div className="flex justify-center" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-auto md:h-10" priority />
        </div>

        <nav className="mt-4 hidden items-center justify-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  active ? "text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          className="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black md:hidden"
          >
            <div className="flex flex-col items-center gap-1 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
