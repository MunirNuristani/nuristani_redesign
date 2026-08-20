import { collection, getCountFromServer, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import HomeClient, { Article, Book } from "./HomeClient";

// Firestore web SDK keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

// Importing the full WordBank.json/dictionary_output.json (7MB/4MB) just for
// their length crashes Turbopack dev (and is wasteful even in prod) — same
// issue fixed on the /articles page earlier. Counts verified directly:
// WordBank.json.length === 16516, dictionary_output.json.length === 9342.
const DARI_NURISTANI_WORD_COUNT = 16516;
const NURISTANI_PASHTO_DARI_WORD_COUNT = 9342;

async function getArticles(): Promise<{ preview: Article[]; total: number }> {
  try {
    const articlesRef = collection(db, "articles");
    const [snapshot, countSnapshot] = await Promise.all([
      getDocs(query(articlesRef, orderBy("order", "asc"), limit(6))),
      getCountFromServer(articlesRef),
    ]);
    const preview: Article[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        nameEn: data.nameEn || "",
        author: data.author || "",
        authorEn: data.authorEn || "",
        language: data.language || "prs",
      };
    });
    return { preview, total: countSnapshot.data().count };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { preview: [], total: 0 };
  }
}

async function getBooks(): Promise<Book[]> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "books"), orderBy("order", "asc"), limit(8))
    );
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        author: data.author || "",
      };
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function NewHomePage() {
  const [{ preview: articles, total: articleCount }, books] = await Promise.all([
    getArticles(),
    getBooks(),
  ]);

  const stats = {
    dariNuristani: DARI_NURISTANI_WORD_COUNT,
    nuristaniPashtoDari: NURISTANI_PASHTO_DARI_WORD_COUNT,
    articles: articleCount,
  };

  return <HomeClient articles={articles} books={books} stats={stats} />;
}
