import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking/BookingPageClient";

export const metadata: Metadata = {
  title: "Booking",
  description: "Zarezerwuj termin w studiu 1take.records.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
