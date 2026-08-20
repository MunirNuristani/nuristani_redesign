import { Metadata } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";
import HistoricalFiguresClient, { HistoricalFigure } from "./HistoricalFiguresClient";

// Same reasoning as the (main) historical-figures page: the Firestore web SDK
// keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Historical Figures of Nuristan - Notable People & Leaders",
    description:
      "Discover the notable historical figures, leaders, scholars, and cultural icons of Nuristan, Afghanistan. Biographical profiles of important Nuristani people throughout history.",
    keywords: [
      "Nuristani historical figures",
      "Nuristan leaders",
      "Nuristani scholars",
      "Afghanistan history",
      "Nuristan biography",
      "شخصیت‌های تاریخی نورستان",
    ],
    openGraph: {
      title: "Historical Figures of Nuristan - Notable People & Leaders",
      description: "Biographical profiles of notable historical figures from Nuristan, Afghanistan",
      url: localeUrl(locale, "historical-figures"),
      type: "website",
      images: [{ url: "/logo_original_noLabel.png", width: 1200, height: 630, alt: "Historical Figures of Nuristan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Historical Figures of Nuristan",
      description: "Notable historical figures and leaders from Nuristan, Afghanistan",
    },
    alternates: {
      canonical: localeUrl(locale, "historical-figures"),
      languages: buildLanguageAlternates("historical-figures"),
    },
  };
}

const ERA_ORDER: Record<string, number> = {
  "Pre-1800": 1,
  "1800-1850": 2,
  "1850-1900": 3,
  "1900-1920": 4,
  "1920-1940": 5,
  "1940-1960": 6,
  "1960-1980": 7,
  "1980-2000": 8,
  "2000-Present": 9,
  Custom: 10,
};

async function getHistoricalFigures(): Promise<HistoricalFigure[]> {
  try {
    const snapshot = await getDocs(query(collection(db, "historicalFigures"), orderBy("createdAt", "desc")));

    const figures: HistoricalFigure[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.seconds != null ? { seconds: data.createdAt.seconds } : null;
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        caption: data.caption,
        era: data.era,
        createdAt,
      };
    });

    return figures.sort((a, b) => {
      const aEraOrder = ERA_ORDER[a.era] || 999;
      const bEraOrder = ERA_ORDER[b.era] || 999;
      if (aEraOrder !== bEraOrder) return aEraOrder - bEraOrder;
      return (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);
    });
  } catch (error) {
    console.error("Error fetching historical figures:", error);
    return [];
  }
}

export default async function NewHistoricalFiguresPage() {
  const figures = await getHistoricalFigures();
  return <HistoricalFiguresClient figures={figures} />;
}
