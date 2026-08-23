import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "1take.records — Studio nagraniowe",
    template: "%s | 1take.records",
  },
  description:
    "1take.records — studio nagraniowe. Nasi artyści, inżynierowie dźwięku i beatmakerzy.",
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
      className={`${bebas.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
