import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/api/bookings/:path*",
    "/api/dashboard/:path*",
    "/api/payments/:path*",
    "/api/admin/:path*",
  ],
};
