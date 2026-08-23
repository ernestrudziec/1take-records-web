import type { SupabaseClient } from "@supabase/supabase-js";
import type { Booking, BookingEvent, UserDashboardStats } from "@/lib/booking/types";

export function bookingHours(startAt: string, endAt: string) {
  return (new Date(endAt).getTime() - new Date(startAt).getTime()) / 3_600_000;
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function suggestedSplit(totalAmount: number, userCount: number) {
  if (userCount <= 0) return 0;
  return roundMoney(totalAmount / userCount);
}

export async function logBookingEvent(
  supabase: SupabaseClient,
  params: {
    booking: Booking;
    actorId: string;
    eventType: BookingEvent["event_type"];
    payload?: Record<string, unknown>;
  },
) {
  await supabase.from("booking_events").insert({
    booking_id: params.booking.id,
    user_id: params.booking.user_id,
    actor_id: params.actorId,
    event_type: params.eventType,
    start_at: params.booking.start_at,
    end_at: params.booking.end_at,
    notes: params.booking.notes,
    payload: params.payload ?? {},
  });
}

export async function logPaymentEvent(
  supabase: SupabaseClient,
  params: {
    paymentId: string;
    actorId: string;
    eventType: string;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    note?: string;
  },
) {
  await supabase.from("payment_events").insert({
    payment_id: params.paymentId,
    actor_id: params.actorId,
    event_type: params.eventType,
    old_value: params.oldValue ?? null,
    new_value: params.newValue ?? null,
    note: params.note ?? null,
  });
}

export function computeUserStats(
  bookings: Pick<Booking, "start_at" | "end_at" | "status">[],
): UserDashboardStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let totalHours = 0;
  let hoursThisMonth = 0;
  let hoursThisYear = 0;
  let upcomingBookings = 0;
  let confirmedBookings = 0;
  let cancelledBookings = 0;

  for (const booking of bookings) {
    const hours = bookingHours(booking.start_at, booking.end_at);
    if (booking.status === "cancelled") {
      cancelledBookings += 1;
      continue;
    }

    confirmedBookings += 1;
    totalHours += hours;

    const start = new Date(booking.start_at);
    if (start >= monthStart && start < monthEnd) {
      hoursThisMonth += hours;
    }
    if (start >= yearStart) {
      hoursThisYear += hours;
    }
    if (start >= now) {
      upcomingBookings += 1;
    }
  }

  return {
    totalBookings: bookings.length,
    confirmedBookings,
    cancelledBookings,
    totalHours: roundMoney(totalHours),
    hoursThisMonth: roundMoney(hoursThisMonth),
    hoursThisYear: roundMoney(hoursThisYear),
    upcomingBookings,
  };
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });
}

export function getCurrentPeriod() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
