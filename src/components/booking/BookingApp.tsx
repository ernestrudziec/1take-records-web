"use client";

import {
  ArrowLeft,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Receipt,
  Shield,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookingDashboard } from "@/components/booking/BookingDashboard";
import { UserDashboard } from "@/components/booking/UserDashboard";
import type { Profile } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/client";

type Tab = "overview" | "calendar" | "bookings" | "payments";

const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Kalendarz", icon: CalendarDays },
  { id: "bookings", label: "Moje bookingi", icon: Receipt },
  { id: "payments", label: "Opłaty", icon: Wallet },
];

export function BookingApp({ profile }: { profile: Profile }) {
  const [tab, setTab] = useState<Tab>("calendar");

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/booking");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:mb-6 sm:border sm:border-white/10 sm:bg-zinc-950/80 sm:px-5 sm:py-4 sm:backdrop-blur-none rounded-none sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Strona
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Wyloguj
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-black"
            style={{ backgroundColor: profile.color }}
          >
            {profile.display_name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                {profile.display_name}
              </h1>
              {profile.is_admin && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
            <p className="truncate text-xs text-zinc-500 sm:text-sm">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "calendar" ? (
        <BookingDashboard profile={profile} />
      ) : (
        <UserDashboard section={tab} />
      )}
    </div>
  );
}
