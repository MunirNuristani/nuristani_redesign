import { Metadata } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";
import BooksListClient, { Book } from "./BooksListClient";

// Firestore web SDK keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Nuristani Digital Library - Books and Publications",
    description:
      "Browse our digital library of Nuristani books, publications, and literary works. Access books about Nuristan culture, history, language, and traditions.",
    keywords: [
      "Nuristani books",
      "Nuristan library",
      "Afghanistan books",
      "Nuristani literature",
      "digital library",
      "کتابخانه نورستانی",
      "کتاب های نورستانی",
    ],
    openGraph: {
      title: "Nuristani Digital Library - Books & Publications",
      description: "Explore books and publications about Nuristani culture and heritage",
      url: localeUrl(locale, "books"),
      type: "website",
      images: [{ url: "/logo_original_noLabel.png", width: 1200, height: 630, alt: "Nuristani Digital Library" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nuristani Digital Library",
      description: "Books and publications about Nuristani culture",
    },
    alternates: {
      canonical: localeUrl(locale, "books"),
      languages: buildLanguageAlternates("books"),
    },
  };
}

async function getBooks(): Promise<Book[]> {
  try {
    const snapshot = await getDocs(query(collection(db, "books"), orderBy("order", "asc")));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        author: data.author || "",
        translator: data.translator || "",
        coverUrl: data.coverUrl || null,
        linkUrl: data.linkUrl || null,
      };
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function NewBooksPage() {
  const books = await getBooks();
  return <BooksListClient books={books} />;
}
