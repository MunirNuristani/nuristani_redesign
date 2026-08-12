import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import HistoricalFiguresClient, { HistoricalFigure } from "./HistoricalFiguresClient";

// Same reasoning as the (main) historical-figures page: the Firestore web SDK
// keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

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
