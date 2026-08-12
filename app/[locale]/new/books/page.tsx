import { base } from "@/utils/airTable";
import BooksListClient, { Book } from "./BooksListClient";

export const revalidate = 3600;

async function getBooks(): Promise<Book[]> {
  const data = await base("Books")
    .select({ sort: [{ field: "No", direction: "asc" }] })
    .all();
  return data.map((item) => {
    const fields = item.fields as {
      title?: string;
      author?: string;
      translator?: string;
      Book_Picture?: { url: string }[];
      Book_Links?: { url: string }[];
    };
    return {
      id: item.id,
      title: fields.title || "",
      author: fields.author || "",
      translator: fields.translator || "",
      coverUrl: fields.Book_Picture?.[0]?.url || null,
      linkUrl: fields.Book_Links?.[0]?.url || null,
    };
  });
}

export default async function NewBooksPage() {
  const books = await getBooks();
  return <BooksListClient books={books} />;
}
