"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarDays, Clock, Receipt, Wallet } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { DashboardSkeleton } from "@/components/booking/Loader";
import type {
  Booking,
  UserDashboardStats,
  UserMonthlyPayment,
} from "@/lib/booking/types";
import { monthLabel } from "@/lib/booking/utils";

type DashboardPayload = {
  stats: UserDashboardStats;
  bookings: Booking[];
  payment: UserMonthlyPayment | null;
  payments: UserMonthlyPayment[];
  invoiceUrl: string | null;
  period: { year: number; month: number };
};

type UserDashboardProps = {
  section: "overview" | "bookings" | "payments";
};

function formatHours(value: number) {
  return `${value.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} h`;
}

export function UserDashboard({ section }: UserDashboardProps) {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się pobrać dashboardu");
      }
      setData(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Nie udało się pobrać dashboardu",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function togglePaid() {
    if (!data?.payment) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/payments/${data.payment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_marked_paid: !data.payment.user_marked_paid,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Nie udało się zapisać płatności");
      }
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Nie udało się zapisać płatności",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <DashboardSkeleton />;
  if (error || !data) {
    return <p className="py-10 text-center text-sm text-red-300">{error}</p>;
  }

  const { stats, bookings, payment, payments, invoiceUrl, period } = data;
  const upcoming = bookings.filter(
    (booking) =>
      booking.status === "confirmed" && new Date(booking.start_at) >= new Date(),
  );

  if (section === "overview") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Godziny w tym miesiącu"
            value={formatHours(stats.hoursThisMonth)}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Godziny w tym roku"
            value={formatHours(stats.hoursThisYear)}
          />
          <StatCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="Nadchodzące"
            value={String(stats.upcomingBookings)}
          />
          <StatCard
            icon={<Wallet className="h-4 w-4" />}
            label="Opłata w tym miesiącu"
            value={
              payment
                ? `${Number(payment.amount_due).toLocaleString("pl-PL")} zł`
                : "—"
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Łącznie na studiu
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {formatHours(stats.totalHours)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {stats.confirmedBookings} potwierdzonych · {stats.cancelledBookings}{" "}
            odwołanych
          </p>
        </div>
      </div>
    );
  }

  if (section === "bookings") {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Moje bookingi</h3>
        {upcoming.length === 0 && bookings.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-sm text-zinc-500">
            Nie masz jeszcze żadnych rezerwacji.
          </p>
        ) : (
          bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {format(new Date(booking.start_at), "d MMMM yyyy", {
                      locale: pl,
                    })}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {format(new Date(booking.start_at), "HH:mm")} –{" "}
                    {format(new Date(booking.end_at), "HH:mm")}
                  </p>
                  {booking.notes && (
                    <p className="mt-2 text-sm text-zinc-500">{booking.notes}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    booking.status === "cancelled"
                      ? "bg-red-500/10 text-red-300"
                      : new Date(booking.start_at) >= new Date()
                        ? "bg-white/10 text-white"
                        : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {booking.status === "cancelled"
                    ? "Odwołany"
                    : new Date(booking.start_at) >= new Date()
                      ? "Nadchodzący"
                      : "Zakończony"}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Opłaty</h3>
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
          {monthLabel(period.year, period.month)}
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">
          {payment
            ? `${Number(payment.amount_due).toLocaleString("pl-PL")} zł`
            : "Brak naliczenia"}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {payment?.admin_marked_paid
            ? "Admin potwierdził wpłatę"
            : payment?.user_marked_paid
              ? "Oznaczyłeś jako zapłacone — czeka na admina"
              : "Nieoznaczone"}
        </p>
        {payment && (
          <button
            type="button"
            disabled={saving}
            onClick={togglePaid}
            className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {payment.user_marked_paid
              ? "Cofnij oznaczenie"
              : "Oznacz jako zapłacone"}
          </button>
        )}
        {invoiceUrl && (
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            <Receipt className="h-4 w-4" />
            Zobacz fakturę
          </a>
        )}
      </div>

      <div className="space-y-2">
        {payments.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm text-zinc-500">
            Historia opłat pojawi się, gdy admin ustawi kwoty.
          </p>
        ) : (
          payments.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">
                  {monthLabel(item.year, item.month)}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.admin_marked_paid
                    ? "Opłacone"
                    : item.user_marked_paid
                      ? "Oznaczone"
                      : "Do zapłaty"}
                </p>
              </div>
              <p className="text-sm font-semibold text-white">
                {Number(item.amount_due).toLocaleString("pl-PL")} zł
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <div className="text-zinc-500">{icon}</div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </article>
  );
}
