import { Metadata } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";
import AlphabetClient, { AlphabetLetter } from "./AlphabetClient";

// Firestore web SDK keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

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
      description: "Complete guide to the Nuristani alphabet with pronunciation and examples",
      url: localeUrl(locale, "alphabet"),
      type: "website",
      images: [{ url: "/logo_original_noLabel.png", width: 1200, height: 630, alt: "Nuristani Alphabet" }],
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

async function getAlphabet(): Promise<AlphabetLetter[]> {
  try {
    const snapshot = await getDocs(query(collection(db, "alphabet"), orderBy("order", "asc")));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        letter: data.letter || "",
        latin: data.latin || "",
        name: data.name || "",
        description: data.description || "",
        recordingOgg: data.recordingOggUrl || "",
        recordingMp3: data.recordingMp3Url || "",
      };
    });
  } catch (error) {
    console.error("Error fetching alphabet:", error);
    return [];
  }
}

export default async function NewAlphabetPage() {
  const letters = await getAlphabet();
  return <AlphabetClient letters={letters} />;
}
