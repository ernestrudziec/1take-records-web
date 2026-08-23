import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "1take.records — Studio nagraniowe",
    template: "%s | 1take.records",
  },
  description:
    "1take.records — studio nagraniowe we Wrocławiu. Nagrania, miks, mastering i produkcja.",
  openGraph: {
    title: "1take.records",
    description: "Studio nagraniowe — jeden take, jeden standard.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black font-sans text-white">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
