import { NextResponse } from "next/server";
import { getCurrentProfile, isAdminProfile } from "@/lib/booking/auth";
import {
  getCurrentPeriod,
  logPaymentEvent,
  roundMoney,
  suggestedSplit,
} from "@/lib/booking/utils";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ year: string; month: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { year: yearParam, month: monthParam } = await context.params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile || !isAdminProfile(profile)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: billing }, { data: payments }, { data: profiles }, { data: monthBookings }] =
    await Promise.all([
      supabase
        .from("billing_months")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .maybeSingle(),
      supabase
        .from("user_monthly_payments")
        .select("*, profiles(display_name, color, email)")
        .eq("year", year)
        .eq("month", month)
        .order("amount_due", { ascending: false }),
      supabase.from("profiles").select("id"),
      supabase
        .from("bookings")
        .select("user_id")
        .eq("status", "confirmed")
        .gte("start_at", new Date(year, month - 1, 1).toISOString())
        .lt("start_at", new Date(year, month, 1).toISOString()),
    ]);

  const usersWithBookingsCount = new Set(
    (monthBookings ?? []).map((booking) => booking.user_id),
  ).size;
  const activeUsersCount = profiles?.length ?? 0;
  const splitBase = usersWithBookingsCount > 0 ? usersWithBookingsCount : activeUsersCount;
  const suggestedAmountPerUser = suggestedSplit(
    Number(billing?.total_amount ?? 0),
    splitBase,
  );

  let invoiceUrl: string | null = null;
  if (billing?.invoice_path) {
    const { data } = supabase.storage
      .from("invoices")
      .getPublicUrl(billing.invoice_path);
    invoiceUrl = data.publicUrl;
  }

  const paymentIds = (payments ?? []).map((payment) => payment.id);
  let paymentHistory: unknown[] = [];

  if (paymentIds.length > 0) {
    const { data } = await supabase
      .from("payment_events")
      .select("*, actor:profiles!payment_events_actor_id_fkey(display_name)")
      .in("payment_id", paymentIds)
      .order("created_at", { ascending: false })
      .limit(50);
    paymentHistory = data ?? [];
  }

  return NextResponse.json({
    billingMonth: billing ?? null,
    invoiceUrl,
    suggestedAmountPerUser,
    activeUsersCount,
    usersWithBookingsCount,
    payments: payments ?? [],
    paymentHistory,
    period: { year, month },
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const { year: yearParam, month: monthParam } = await context.params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile || !isAdminProfile(profile)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    total_amount?: number;
    notes?: string;
    generate_payments?: boolean;
  };

  const totalAmount = roundMoney(Number(body.total_amount ?? 0));

  const { data: billing, error } = await supabase
    .from("billing_months")
    .upsert(
      {
        year,
        month,
        total_amount: totalAmount,
        notes: body.notes?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "year,month" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.generate_payments) {
    const [{ data: profiles }, { data: monthBookings }] = await Promise.all([
      supabase.from("profiles").select("id"),
      supabase
        .from("bookings")
        .select("user_id")
        .eq("status", "confirmed")
        .gte("start_at", new Date(year, month - 1, 1).toISOString())
        .lt("start_at", new Date(year, month, 1).toISOString()),
    ]);

    const bookingUserIds = new Set((monthBookings ?? []).map((b) => b.user_id));
    const targetUsers =
      bookingUserIds.size > 0
        ? (profiles ?? []).filter((item) => bookingUserIds.has(item.id))
        : profiles ?? [];

    const amount = suggestedSplit(totalAmount, targetUsers.length || 1);

    for (const user of targetUsers) {
      const { data: payment } = await supabase
        .from("user_monthly_payments")
        .upsert(
          {
            user_id: user.id,
            year,
            month,
            amount_due: amount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,year,month" },
        )
        .select("*")
        .single();

      if (payment) {
        await logPaymentEvent(supabase, {
          paymentId: payment.id,
          actorId: profile.id,
          eventType: "amount_set",
          newValue: { amount_due: amount, auto_split: true },
          note: "Automatyczny podział kosztów miesiąca",
        });
      }
    }
  }

  return NextResponse.json({ billingMonth: billing });
}

export async function POST(request: Request, context: RouteContext) {
  const { year: yearParam, month: monthParam } = await context.params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile || !isAdminProfile(profile)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${year}-${String(month).padStart(2, "0")}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: billing, error } = await supabase
    .from("billing_months")
    .upsert(
      {
        year,
        month,
        invoice_path: path,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "year,month" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from("invoices").getPublicUrl(path);

  return NextResponse.json({
    billingMonth: billing,
    invoiceUrl: publicUrl.publicUrl,
  });
}
