import { NextResponse } from "next/server";
import { getCurrentProfile, isAdminProfile } from "@/lib/booking/auth";
import type { BookingUpdateInput } from "@/lib/booking/types";
import { logBookingEvent } from "@/lib/booking/utils";
import { createClient } from "@/lib/supabase/server";
import {
  formatBookingTelegramMessage,
  sendTelegramNotification,
} from "@/lib/telegram";

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

  const { data: existing, error: fetchError } = await supabase
    .from("bookings")
    .select("*, profiles(display_name, color, email)")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const canEdit =
    existing.user_id === profile.id || isAdminProfile(profile);

  if (!canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as BookingUpdateInput;
  const startAt = body.start_at
    ? new Date(body.start_at)
    : new Date(existing.start_at);
  const endAt = body.end_at ? new Date(body.end_at) : new Date(existing.end_at);

  if (endAt <= startAt) {
    return NextResponse.json(
      { error: "End time must be after start time" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      notes:
        body.notes !== undefined ? body.notes.trim() || null : existing.notes,
      status: body.status ?? existing.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, profiles(display_name, color, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const action = data.status === "cancelled" ? "cancelled" : "updated";
  const userName = data.profiles?.display_name ?? profile.display_name;

  await logBookingEvent(supabase, {
    booking: data,
    actorId: profile.id,
    eventType: action,
  });

  await sendTelegramNotification(
    formatBookingTelegramMessage({
      action,
      userName,
      actorName: profile.display_name,
      startAt: data.start_at,
      endAt: data.end_at,
      previousStartAt: existing.start_at,
      previousEndAt: existing.end_at,
      notes: data.notes,
    }),
  );

  return NextResponse.json({ booking: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("bookings")
    .select("*, profiles(display_name, color, email)")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const canDelete =
    existing.user_id === profile.id || isAdminProfile(profile);

  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, profiles(display_name, color, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logBookingEvent(supabase, {
    booking: data,
    actorId: profile.id,
    eventType: "cancelled",
  });

  await sendTelegramNotification(
    formatBookingTelegramMessage({
      action: "cancelled",
      userName: data.profiles?.display_name ?? profile.display_name,
      actorName: profile.display_name,
      startAt: data.start_at,
      endAt: data.end_at,
      notes: data.notes,
    }),
  );

  return NextResponse.json({ booking: data });
}
