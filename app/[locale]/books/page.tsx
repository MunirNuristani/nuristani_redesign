import BooksClient, { Book } from './BooksClient';
import { base } from '@/utils/airTable';

export const revalidate = 3600;

async function getBooks(): Promise<Book[]> {
  const data = await base('Books')
    .select({ sort: [{ field: 'No', direction: 'asc' }] })
    .all();

  const books = data.map((item) => ({ id: item.id, ...item.fields })) as Book[];

  return books.sort((a, b) => a.title.localeCompare(b.title));
}

export default async function BooksPage() {
  const books = await getBooks();
  return <BooksClient initialBooks={books} />;
}
