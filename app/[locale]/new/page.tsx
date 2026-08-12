import { base } from "@/utils/airTable";
import HomeClient, { Article, Book } from "./HomeClient";

export const revalidate = 3600;

// Importing the full WordBank.json/dictionary_output.json (7MB/4MB) just for
// their length crashes Turbopack dev (and is wasteful even in prod) — same
// issue fixed on the /articles page earlier. Counts verified directly:
// WordBank.json.length === 16516, dictionary_output.json.length === 9342.
const DARI_NURISTANI_WORD_COUNT = 16516;
const NURISTANI_PASHTO_DARI_WORD_COUNT = 9342;

async function getArticles(): Promise<{ preview: Article[]; total: number }> {
  const data = await base("Articles")
    .select({
      sort: [{ field: "No", direction: "asc" }],
      fields: ["No", "Article_Name", "Article_Name_en", "Author_Name", "Author_Name_en", "language"],
    })
    .all();
  const mapped: Article[] = data.map((item) => ({
    id: item.id,
    name: (item.fields.Article_Name as string) || "",
    nameEn: (item.fields.Article_Name_en as string) || "",
    author: (item.fields.Author_Name as string) || "",
    authorEn: (item.fields.Author_Name_en as string) || "",
    language: (item.fields.language as string) || "prs",
  }));
  return { preview: mapped.slice(0, 6), total: mapped.length };
}

async function getBooks(): Promise<Book[]> {
  const data = await base("Books")
    .select({
      sort: [{ field: "No", direction: "asc" }],
      // Exclude Book_Picture/Book_Links attachment fields — not needed for
      // this preview grid, and large attachment payloads are what tripped
      // the Turbopack dev bug on the articles page earlier.
      fields: ["No", "title", "author"],
      maxRecords: 8,
    })
    .all();
  return data.map((item) => ({
    id: item.id,
    title: (item.fields.title as string) || "",
    author: (item.fields.author as string) || "",
  }));
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
