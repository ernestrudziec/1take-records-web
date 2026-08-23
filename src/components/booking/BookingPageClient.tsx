"use client";

import { useEffect, useState } from "react";
import { AuthForm } from "@/components/booking/AuthForm";
import { BookingDashboard } from "@/components/booking/BookingDashboard";
import { PageHero } from "@/components/PageHero";
import type { Profile } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/client";

export function BookingPageClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  async function loadProfile() {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setConfigured(false);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile((data as Profile | null) ?? null);
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (!configured) {
    return (
      <>
        <PageHero
          eyebrow="Booking"
          title="Konfiguracja Supabase"
          description="Uzupełnij NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY w pliku .env.local, a następnie uruchom ponownie serwer dev."
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-32 text-center text-sm text-zinc-500">
        Ładowanie...
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <PageHero
          eyebrow="Booking"
          title="Rezerwacja studia"
          description="Zaloguj się lub załóż konto, żeby zobaczyć kalendarz i zarezerwować termin w 1take.records."
        />
        <div className="px-6 pb-20">
          <AuthForm onAuthenticated={loadProfile} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Kalendarz studia"
        description="Widzisz wszystkie rezerwacje. Każda osoba ma swój kolor. Admin może edytować dowolny termin."
      />
      <BookingDashboard profile={profile} />
    </>
  );
}
