"use client";

import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import { pl } from "date-fns/locale";
import {
  CalendarDays,
  CircleCheck,
  Move,
  Plus,
  StickyNote,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { View } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { CalendarSkeleton } from "@/components/booking/Loader";
import { Modal } from "@/components/ui/Modal";
import type { Booking, Profile } from "@/lib/booking/types";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
};

type SlotInfo = {
  start: Date;
  end: Date;
};

type PendingMove = {
  booking: Booking;
  start: Date;
  end: Date;
};

const locales = { pl };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: pl }),
  getDay,
  locales,
});

const DnDCalendar = dynamic(
  async () => {
    const { Calendar } = await import("react-big-calendar");
    const { default: withDragAndDrop } = await import(
      "react-big-calendar/lib/addons/dragAndDrop"
    );
    return withDragAndDrop(Calendar);
  },
  { ssr: false },
);

function formatRange(start: Date, end: Date) {
  return `${format(start, "d MMM, HH:mm", { locale: pl })} – ${format(end, "HH:mm", { locale: pl })}`;
}

function BookingEvent({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-1 py-0.5 text-center leading-tight">
      <span className="text-[11px] font-semibold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </span>
      <span className="mt-0.5 text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
        {event.title}
      </span>
    </div>
  );
}

export function BookingDashboard({ profile }: { profile: Profile }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(new Date());
  const [calendarHeight, setCalendarHeight] = useState(560);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [startAt, setStartAt] = useState(new Date());
  const [endAt, setEndAt] = useState(addHours(new Date(), 2));
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canManage = useCallback(
    (booking: Booking) => profile.is_admin || booking.user_id === profile.id,
    [profile],
  );

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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (desktop) setView("week");

    function syncHeight() {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      setCalendarHeight(wide ? 680 : Math.max(460, window.innerHeight * 0.58));
    }

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

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

  function openCreate(slot?: SlotInfo) {
    const start = slot?.start ?? new Date();
    const end = slot?.end ?? addHours(start, 2);
    setStartAt(start);
    setEndAt(end);
    setNotes("");
    setSelected(null);
    setCreateOpen(true);
  }

  function openDetails(booking: Booking) {
    setSelected(booking);
    setStartAt(new Date(booking.start_at));
    setEndAt(new Date(booking.end_at));
    setNotes(booking.notes ?? "");
    setCreateOpen(false);
  }

  async function createBooking() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          notes,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się utworzyć bookingu");
      }
      setCreateOpen(false);
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

  async function updateBooking(nextStart = startAt, nextEnd = endAt, nextNotes = notes) {
    if (!selected && !pendingMove) return;
    const booking = selected ?? pendingMove?.booking;
    if (!booking) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_at: nextStart.toISOString(),
          end_at: nextEnd.toISOString(),
          notes: nextNotes,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się zapisać zmian");
      }
      setSelected(null);
      setPendingMove(null);
      await loadBookings();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Nie udało się zapisać zmian",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelBooking() {
    if (!selected) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/${selected.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się odwołać bookingu");
      }
      setCancelOpen(false);
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

  function requestMove(event: CalendarEvent, start: Date, end: Date) {
    if (!canManage(event.resource)) return;
    setPendingMove({ booking: event.resource, start, end });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs text-zinc-500">
          <Move className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Kliknij wolny slot, żeby dodać booking. Na desktopie możesz też
            przeciągnąć termin.
          </span>
        </p>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-zinc-200 sm:py-2.5"
        >
          <Plus className="h-4 w-4" />
          Nowy booking
        </button>
      </div>

      <div className="booking-calendar mt-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-2 sm:p-3 md:p-5">
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <DnDCalendar
            localizer={localizer}
            events={events}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            defaultView="day"
            views={["month", "week", "day"]}
            culture="pl"
            step={30}
            timeslots={2}
            selectable
            resizable
            components={{
              event: BookingEvent as never,
            }}
            style={{ height: calendarHeight }}
            messages={{
              today: "Dziś",
              previous: "Wstecz",
              next: "Dalej",
              month: "Miesiąc",
              week: "Tydzień",
              day: "Dzień",
              showMore: (count: number) => `+${count} więcej`,
            }}
            draggableAccessor={(event) =>
              canManage((event as CalendarEvent).resource)
            }
            resizableAccessor={(event) =>
              canManage((event as CalendarEvent).resource)
            }
            onSelectSlot={(slot) => openCreate(slot as SlotInfo)}
            onSelectEvent={(event) =>
              openDetails((event as CalendarEvent).resource)
            }
            onEventDrop={({ event, start, end }) =>
              requestMove(event as CalendarEvent, new Date(start), new Date(end))
            }
            onEventResize={({ event, start, end }) =>
              requestMove(event as CalendarEvent, new Date(start), new Date(end))
            }
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  (event as CalendarEvent).resource.profiles?.color ?? "#fff",
                border: "none",
                color: "#fff",
                borderRadius: 10,
                padding: "2px 8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              },
            })}
          />
        )}
      </div>

      {error && (
        <p className="mt-5 text-center text-sm text-red-300">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
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
          <div
            key={legend.name}
            className="flex items-center gap-2 text-sm text-zinc-400"
          >
            <span
              className="inline-flex h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: legend.color }}
            />
            {legend.name}
          </div>
        ))}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nowy booking"
        description="Wybierz dzień i godzinę z listy — bez wpisywania daty z klawiatury."
        icon={<CalendarDays className="h-5 w-5 text-white" strokeWidth={1.6} />}
      >
        <div className="space-y-4">
          <DateTimePicker label="Start" value={startAt} onChange={setStartAt} />
          <DateTimePicker label="Koniec" value={endAt} onChange={setEndAt} />
          <label className="block text-left">
            <span className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              <StickyNote className="h-3.5 w-3.5" />
              Notatka
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              placeholder="np. nagrania wokalu, miks"
            />
          </label>
          <button
            type="button"
            disabled={submitting}
            onClick={createBooking}
            className="w-full rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {submitting ? "Zapisuję..." : "Zarezerwuj studio"}
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.profiles?.display_name ?? "Booking"}
        description={
          selected
            ? formatRange(new Date(selected.start_at), new Date(selected.end_at))
            : undefined
        }
        icon={<CircleCheck className="h-5 w-5 text-white" strokeWidth={1.6} />}
      >
        {selected && canManage(selected) ? (
          <div className="space-y-4">
            <DateTimePicker label="Start" value={startAt} onChange={setStartAt} />
            <DateTimePicker label="Koniec" value={endAt} onChange={setEndAt} />
            <label className="block text-left">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                <StickyNote className="h-3.5 w-3.5" />
                Notatka
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              />
            </label>
            <button
              type="button"
              disabled={submitting}
              onClick={() => updateBooking()}
              className="w-full rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {submitting ? "Zapisuję..." : "Zapisz zmiany"}
            </button>
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-red-300 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Odwołaj booking
            </button>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            Ten termin należy do kogoś innego. Tylko admin może go edytować.
          </p>
        )}
      </Modal>

      <Modal
        open={Boolean(pendingMove)}
        onClose={() => setPendingMove(null)}
        title="Przenieść booking?"
        description={
          pendingMove
            ? `Z ${formatRange(new Date(pendingMove.booking.start_at), new Date(pendingMove.booking.end_at))} na ${formatRange(pendingMove.start, pendingMove.end)}.`
            : undefined
        }
        icon={<Move className="h-5 w-5 text-white" strokeWidth={1.6} />}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPendingMove(null)}
            className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:border-white/40"
          >
            Anuluj
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (!pendingMove) return;
              setSelected(pendingMove.booking);
              void updateBooking(
                pendingMove.start,
                pendingMove.end,
                pendingMove.booking.notes ?? "",
              );
            }}
            className="rounded-xl bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            Potwierdź
          </button>
        </div>
      </Modal>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Odwołać ten termin?"
        description="Rezerwacja zniknie z kalendarza. Możesz później dodać nową."
        icon={<Trash2 className="h-5 w-5 text-red-300" strokeWidth={1.6} />}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCancelOpen(false)}
            className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            Zostaw
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={cancelBooking}
            className="rounded-xl bg-red-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-red-400 disabled:opacity-50"
          >
            Odwołaj
          </button>
        </div>
      </Modal>
    </div>
  );
}
