import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuristani Dictionary - Dari to Nuristani & Nuristani to Pashto/Dari",
  description:
    "Comprehensive Nuristani dictionary with translations from Dari to Nuristani and Nuristani to Pashto/Dari. Search thousands of words with pronunciation guides and meanings.",
  keywords: [
    "Nuristani dictionary",
    "Dari Nuristani translation",
    "Nuristani Pashto",
    "Nuristani language",
    "Kalasha Ala",
    "نورستانی لغت",
    "فرهنگ نورستانی",
  ],
  openGraph: {
    title: "Nuristani Dictionary - Language Translation Tool",
    description:
      "Search the comprehensive Nuristani dictionary with Dari and Pashto translations",
    url: "https://nuristani.info/dictionary",
    type: "website",
    images: [
      {
        url: "/logo_original_noLabel.png",
        width: 1200,
        height: 630,
        alt: "Nuristani Dictionary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuristani Dictionary",
    description: "Comprehensive Nuristani language dictionary with translations",
  },
  alternates: {
    canonical: "https://nuristani.info/dictionary",
  },
};

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
