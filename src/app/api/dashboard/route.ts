import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/booking/auth";
import { computeUserStats, getCurrentPeriod } from "@/lib/booking/utils";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || getCurrentPeriod().year;
  const month = Number(searchParams.get("month")) || getCurrentPeriod().month;

  const [
    { data: bookings },
    { data: events },
    { data: payment },
    { data: payments },
    { data: billing },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", profile.id)
      .order("start_at", { ascending: false }),
    supabase
      .from("booking_events")
      .select("*, actor:profiles!booking_events_actor_id_fkey(display_name)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("user_monthly_payments")
      .select("*")
      .eq("user_id", profile.id)
      .eq("year", year)
      .eq("month", month)
      .maybeSingle(),
    supabase
      .from("user_monthly_payments")
      .select("*")
      .eq("user_id", profile.id)
      .order("year", { ascending: false })
      .order("month", { ascending: false }),
    supabase
      .from("billing_months")
      .select("*")
      .eq("year", year)
      .eq("month", month)
      .maybeSingle(),
  ]);

  let invoiceUrl: string | null = null;
  if (billing?.invoice_path) {
    const { data } = supabase.storage
      .from("invoices")
      .getPublicUrl(billing.invoice_path);
    invoiceUrl = data.publicUrl;
  }

  const stats = computeUserStats(bookings ?? []);

  return NextResponse.json({
    stats,
    bookings: bookings ?? [],
    bookingHistory: events ?? [],
    payment: payment ?? null,
    payments: payments ?? [],
    billingMonth: billing ?? null,
    invoiceUrl,
    period: { year, month },
  });
}
