import ArticlesClient, { Article } from './ArticlesClient';
import { base } from '@/utils/airTable';

export const revalidate = 3600;

async function getArticles(): Promise<Article[]> {
  const data = await base('Articles')
    .select({
      sort: [{ field: 'No', direction: 'asc' }],
      // The list view only needs these fields — Article_body (the full
      // article HTML) is fetched separately on the detail page.
      fields: ['No', 'Article_Name', 'Article_Name_en', 'Author_Name', 'Author_Name_en', 'Status', 'language'],
    })
    .all();

  const articles = data.map((item) => ({ id: item.id, ...item.fields })) as unknown as Article[];

  return articles.sort((a, b) => a.Article_Name.localeCompare(b.Article_Name));
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient initialArticles={articles} />;
}
