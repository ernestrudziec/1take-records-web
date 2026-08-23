"use client";

import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/booking/AuthForm";
import { BookingApp } from "@/components/booking/BookingApp";
import { Spinner } from "@/components/booking/Loader";
import { PageHero } from "@/components/PageHero";
import { Modal } from "@/components/ui/Modal";
import type { Profile } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/client";

export function BookingPageClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

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

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace("#", ""));
    if (
      params.get("type") === "signup" ||
      hash.get("type") === "signup" ||
      params.get("code")
    ) {
      setEmailConfirmed(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void loadProfile();
      }
      if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!configured) {
    return (
      <PageHero
        compact
        eyebrow="Booking"
        title="Konfiguracja Supabase"
        description="Uzupełnij NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY w pliku .env.local, a następnie uruchom ponownie serwer."
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70dvh]">
        <Spinner label="Ładowanie konta..." />
      </div>
    );
  }

  if (profile) {
    return <BookingApp profile={profile} />;
  }

  return (
    <>
      <PageHero
        compact
        eyebrow="Booking"
        title="Rezerwacja studia"
        description="Zaloguj się albo załóż konto, żeby zobaczyć kalendarz i zarezerwować studio."
      />

      <div className="px-4 pb-16 sm:px-6">
        <AuthForm onAuthenticated={loadProfile} />
      </div>

      <Modal
        open={emailConfirmed}
        onClose={() => setEmailConfirmed(false)}
        title="E-mail potwierdzony"
        description="Konto jest aktywne. Zaloguj się, żeby wejść do kalendarza."
        icon={<CircleCheck className="h-5 w-5 text-white" strokeWidth={1.6} />}
      >
        <button
          type="button"
          onClick={() => setEmailConfirmed(false)}
          className="w-full rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-zinc-200"
        >
          Przejdź do logowania
        </button>
      </Modal>
    </>
  );
}
