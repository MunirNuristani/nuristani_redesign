import { base } from "@/utils/airTable";
import ArticlesListClient, { Article } from "./ArticlesListClient";

export const revalidate = 3600;

async function getArticles(): Promise<Article[]> {
  const data = await base("Articles")
    .select({
      sort: [{ field: "No", direction: "asc" }],
      fields: ["No", "Article_Name", "Article_Name_en", "Author_Name", "Author_Name_en", "language"],
    })
    .all();
  return data.map((item) => ({
    id: item.id,
    name: (item.fields.Article_Name as string) || "",
    nameEn: (item.fields.Article_Name_en as string) || "",
    author: (item.fields.Author_Name as string) || "",
    authorEn: (item.fields.Author_Name_en as string) || "",
    language: (item.fields.language as string) || "prs",
  }));
}

export default async function NewArticlesPage() {
  const articles = await getArticles();
  return <ArticlesListClient articles={articles} />;
}
