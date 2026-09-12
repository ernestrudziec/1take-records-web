import type { Metadata } from "next";
import { TimestampAlignerApp } from "@/components/editors/timestamp-aligner/TimestampAlignerApp";

export const metadata: Metadata = {
  title: "Timestamp aligner",
  description: "Roboczy aligner timestampów preview/explanation do show cuts.",
  robots: { index: false, follow: false },
};

export default function TimestampAlignerPage() {
  return <TimestampAlignerApp />;
}
