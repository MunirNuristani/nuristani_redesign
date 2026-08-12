import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./new-theme.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

// Loaded here (not on <html>) so only /new visitors pay for these fonts —
// the live site's font setup in the root layout is untouched.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-plex-sans-arabic",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Field Index (preview)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`new-theme ${plexSans.variable} ${plexSansArabic.variable} ${plexMono.variable}`}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
