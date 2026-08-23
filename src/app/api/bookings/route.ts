import { NextResponse } from "next/server";
import { getCurrentProfile, isAdminProfile } from "@/lib/booking/auth";
import type { BookingInput } from "@/lib/booking/types";
import { createClient } from "@/lib/supabase/server";
import {
  formatBookingTelegramMessage,
  sendTelegramNotification,
} from "@/lib/telegram";

export async function GET() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles(display_name, color, email)")
    .neq("status", "cancelled")
    .order("start_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as BookingInput;
  const startAt = new Date(body.start_at);
  const endAt = new Date(body.end_at);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  if (endAt <= startAt) {
    return NextResponse.json(
      { error: "End time must be after start time" },
      { status: 400 },
    );
  }

  const { data: overlaps } = await supabase
    .from("bookings")
    .select("id")
    .eq("status", "confirmed")
    .lt("start_at", endAt.toISOString())
    .gt("end_at", startAt.toISOString());

  if (overlaps && overlaps.length > 0) {
    return NextResponse.json(
      { error: "Ten termin koliduje z innym bookingiem" },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: profile.id,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      notes: body.notes?.trim() || null,
      status: "confirmed",
    })
    .select("*, profiles(display_name, color, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendTelegramNotification(
    formatBookingTelegramMessage({
      action: "created",
      userName: profile.display_name,
      startAt: data.start_at,
      endAt: data.end_at,
      notes: data.notes,
    }),
  );

  return NextResponse.json({ booking: data }, { status: 201 });
}
