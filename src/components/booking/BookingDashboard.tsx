"use client";

import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { View } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Booking, Profile } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/client";

const Calendar = dynamic(
  () => import("react-big-calendar").then((mod) => mod.Calendar),
  { ssr: false },
);

const locales = { pl };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: pl }),
  getDay,
  locales,
});

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
};

type BookingDashboardProps = {
  profile: Profile;
};

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function BookingDashboard({ profile }: BookingDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("week");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [startAt, setStartAt] = useState(toDateTimeLocalValue(new Date()));
  const [endAt, setEndAt] = useState(
    toDateTimeLocalValue(new Date(Date.now() + 2 * 60 * 60 * 1000)),
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się pobrać bookingów");
      }

      setBookings(payload.bookings ?? []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Nie udało się pobrać bookingów",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const events = useMemo<CalendarEvent[]>(
    () =>
      bookings.map((booking) => ({
        id: booking.id,
        title: booking.profiles?.display_name ?? "Booking",
        start: new Date(booking.start_at),
        end: new Date(booking.end_at),
        resource: booking,
      })),
    [bookings],
  );

  async function handleCreateBooking(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_at: new Date(startAt).toISOString(),
          end_at: new Date(endAt).toISOString(),
          notes,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się utworzyć bookingu");
      }

      setNotes("");
      await loadBookings();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Nie udało się utworzyć bookingu",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się odwołać bookingu");
      }

      setSelected(null);
      await loadBookings();
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Nie udało się odwołać bookingu",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_at: new Date(startAt).toISOString(),
          end_at: new Date(endAt).toISOString(),
          notes,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się zaktualizować bookingu");
      }

      setSelected(null);
      await loadBookings();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Nie udało się zaktualizować bookingu",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  function openBookingDetails(booking: Booking) {
    setSelected(booking);
    setStartAt(toDateTimeLocalValue(new Date(booking.start_at)));
    setEndAt(toDateTimeLocalValue(new Date(booking.end_at)));
    setNotes(booking.notes ?? "");
  }

  const canManageSelected =
    selected &&
    (profile.is_admin || selected.user_id === profile.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col items-center justify-between gap-4 border border-white/10 bg-zinc-950 p-6 text-center md:flex-row md:text-left">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Zalogowany jako
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {profile.display_name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{profile.email}</p>
          {profile.is_admin && (
            <span className="mt-3 inline-block border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-3 w-3 rounded-full"
            style={{ backgroundColor: profile.color }}
          />
          <button
            type="button"
            onClick={handleSignOut}
            className="border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
          >
            Wyloguj
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="booking-calendar border border-white/10 bg-zinc-950 p-4">
          {loading ? (
            <p className="py-20 text-center text-sm text-zinc-500">
              Ładowanie kalendarza...
            </p>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              view={view}
              onView={setView}
              defaultView="week"
              views={["month", "week", "day"]}
              culture="pl"
              step={60}
              timeslots={1}
              style={{ height: 620 }}
              onSelectEvent={(event) =>
                openBookingDetails((event as CalendarEvent).resource)
              }
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor:
                    (event as CalendarEvent).resource.profiles?.color ??
                    "#ffffff",
                  border: "none",
                  color: "#fff",
                  borderRadius: 0,
                },
              })}
            />
          )}
        </div>

        <div className="space-y-6">
          <form
            onSubmit={handleCreateBooking}
            className="border border-white/10 bg-zinc-950 p-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              Nowy booking
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Zarezerwuj termin
            </h3>

            <div className="mt-6 space-y-4">
              <label className="block text-left">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Start
                </span>
                <input
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                  className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </label>

              <label className="block text-left">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Koniec
                </span>
                <input
                  type="datetime-local"
                  required
                  value={endAt}
                  onChange={(event) => setEndAt(event.target.value)}
                  className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                />
              </label>

              <label className="block text-left">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Notatka
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  placeholder="np. nagrania wokalu, miks"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              {submitting ? "Zapisuję..." : "Bookuj studio"}
            </button>
          </form>

          {selected && canManageSelected && (
            <form
              onSubmit={handleUpdateBooking}
              className="border border-white/10 bg-black p-6"
            >
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
                Wybrany booking
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {selected.profiles?.display_name ?? "Booking"}
              </h3>

              <div className="mt-6 space-y-4">
                <label className="block text-left">
                  <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Start
                  </span>
                  <input
                    type="datetime-local"
                    required
                    value={startAt}
                    onChange={(event) => setStartAt(event.target.value)}
                    className="w-full border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </label>

                <label className="block text-left">
                  <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Koniec
                  </span>
                  <input
                    type="datetime-local"
                    required
                    value={endAt}
                    onChange={(event) => setEndAt(event.target.value)}
                    className="w-full border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </label>

                <label className="block text-left">
                  <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Notatka
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    className="w-full border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
                >
                  {profile.is_admin ? "Zapisz zmiany (admin)" : "Zapisz zmiany"}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleCancelBooking(selected.id)}
                  className="w-full border border-red-500/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-300 transition-colors hover:border-red-400"
                >
                  Odwołaj booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-6 text-center text-sm text-red-300">{error}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {Array.from(
          new Map(
            bookings.map((booking) => [
              booking.user_id,
              {
                name: booking.profiles?.display_name ?? "User",
                color: booking.profiles?.color ?? "#fff",
              },
            ]),
          ).values(),
        ).map((legend) => (
          <div key={legend.name} className="flex items-center gap-2 text-sm text-zinc-400">
            <span
              className="inline-flex h-3 w-3 rounded-full"
              style={{ backgroundColor: legend.color }}
            />
            {legend.name}
          </div>
        ))}
      </div>
    </div>
  );
}
