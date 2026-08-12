import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
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
      url: localeUrl(locale, "alphabet"),
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
      canonical: localeUrl(locale, "alphabet"),
      languages: buildLanguageAlternates("alphabet"),
    },
  };
}

export default function AlphabetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
