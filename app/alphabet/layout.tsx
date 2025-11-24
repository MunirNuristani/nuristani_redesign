import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuristani Alphabet - Learn the Nuristani Script",
  description:
    "Learn the Nuristani alphabet with pronunciation guides, audio examples, and writing practice. Complete guide to reading and writing in Nuristani language.",
  keywords: [
    "Nuristani alphabet",
    "Nuristani script",
    "Nuristani writing",
    "learn Nuristani",
    "Nuristani pronunciation",
    "الفبای نورستانی",
  ],
  openGraph: {
    title: "Nuristani Alphabet - Learn the Script",
    description:
      "Complete guide to the Nuristani alphabet with pronunciation and examples",
    url: "https://nuristani.info/alphabet",
    type: "website",
    images: [
      {
        url: "/logo_original_noLabel.png",
        width: 1200,
        height: 630,
        alt: "Nuristani Alphabet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuristani Alphabet",
    description: "Learn to read and write in Nuristani language",
  },
  alternates: {
    canonical: "https://nuristani.info/alphabet",
  },
};

export default function AlphabetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
