import { NextResponse } from "next/server";
import { getCurrentProfile, isAdminProfile } from "@/lib/booking/auth";
import { logPaymentEvent, roundMoney } from "@/lib/booking/utils";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    amount_due?: number;
    user_marked_paid?: boolean;
    admin_marked_paid?: boolean;
  };

  const { data: existing, error: fetchError } = await supabase
    .from("user_monthly_payments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const isAdmin = isAdminProfile(profile);
  const isOwner = existing.user_id === profile.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (isAdmin && body.amount_due !== undefined) {
    updates.amount_due = roundMoney(Number(body.amount_due));
  }

  if (isOwner && body.user_marked_paid !== undefined) {
    updates.user_marked_paid = body.user_marked_paid;
  }

  if (isAdmin && body.admin_marked_paid !== undefined) {
    updates.admin_marked_paid = body.admin_marked_paid;
  }

  const { data, error } = await supabase
    .from("user_monthly_payments")
    .update(updates)
    .eq("id", id)
    .select("*, profiles(display_name, color, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.amount_due !== undefined && isAdmin) {
    await logPaymentEvent(supabase, {
      paymentId: id,
      actorId: profile.id,
      eventType: "amount_set",
      oldValue: { amount_due: existing.amount_due },
      newValue: { amount_due: data.amount_due },
    });
  }

  if (body.user_marked_paid !== undefined && isOwner) {
    await logPaymentEvent(supabase, {
      paymentId: id,
      actorId: profile.id,
      eventType: body.user_marked_paid ? "user_marked_paid" : "user_unmarked_paid",
      oldValue: { user_marked_paid: existing.user_marked_paid },
      newValue: { user_marked_paid: data.user_marked_paid },
    });
  }

  if (body.admin_marked_paid !== undefined && isAdmin) {
    await logPaymentEvent(supabase, {
      paymentId: id,
      actorId: profile.id,
      eventType: body.admin_marked_paid ? "admin_marked_paid" : "admin_unmarked_paid",
      oldValue: { admin_marked_paid: existing.admin_marked_paid },
      newValue: { admin_marked_paid: data.admin_marked_paid },
    });
  }

  return NextResponse.json({ payment: data });
}
