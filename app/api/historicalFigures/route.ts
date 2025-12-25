import { db } from "@/utils/firebase-config";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get era filter from query params
    const searchParams = request.nextUrl.searchParams;
    const eraFilter = searchParams.get("era");

    // Build query
    let q;
    if (eraFilter && eraFilter !== "all") {
      // When filtering, don't order by different field to avoid index requirement
      q = query(
        collection(db, "historicalFigures"),
        where("era", "==", eraFilter)
      );
    } else {
      q = query(collection(db, "historicalFigures"), orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const figures: {
      id: string;
      imageUrl: string;
      imagePath: string;
      caption: { en: string; prs: string; ps: string; nr: string };
      era: string;
      createdAt: unknown;
      updatedAt: unknown;
    }[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      figures.push({
        id: doc.id,
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        caption: data.caption,
        era: data.era,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return new Response(JSON.stringify(figures), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Error fetching historical figures:", err);

    // Return empty array instead of error to prevent page crash
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
