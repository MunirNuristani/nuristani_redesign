import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Historic Images of Nuristan - Historical Photography Archive",
    description:
      "Browse rare and historic photographs of Nuristan, Afghanistan. A visual archive preserving the cultural heritage, people, and landscapes of the Nuristani region throughout history.",
    keywords: [
      "Nuristan historic photos",
      "Afghanistan historical images",
      "Nuristani photography",
      "Nuristan history",
      "historic Afghanistan",
      "نورستان تاریخی",
    ],
    openGraph: {
      title: "Historic Images of Nuristan - Historical Photography Archive",
      description: "Rare and historic photographs preserving the cultural heritage of Nuristan, Afghanistan",
      url: localeUrl(locale, "historic_images"),
      type: "website",
      images: [{ url: "/logo_original_noLabel.png", width: 1200, height: 630, alt: "Historic Images of Nuristan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Historic Images of Nuristan",
      description: "Rare historical photographs of Nuristan, Afghanistan",
    },
    alternates: {
      canonical: localeUrl(locale, "historic_images"),
      languages: buildLanguageAlternates("historic_images"),
    },
  };
}

export default function HistoricImagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
