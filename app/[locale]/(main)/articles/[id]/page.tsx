import { cache } from "react";
import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import ArticleDetailClient, { ArticleData } from "./ArticleDetailClient";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";
import { isArticleBlocks, firstBlockImageUrl } from "@/utils/articleBlocks";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

// Firestore web SDK keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = "force-dynamic";

const getArticle = cache(async (id: string): Promise<ArticleData | null> => {
  try {
    const snap = await getDoc(doc(db, "articles", id));
    if (!snap.exists()) return null;
    const data = snap.data();
    const pictures = (data.pictures as string[] | undefined) || [];
    return {
      name: data.name || "",
      nameEn: data.nameEn || "",
      author: data.author || "",
      authorEn: data.authorEn || "",
      language: data.language || "prs",
      body: data.body || "",
      pictures: pictures.map((url, i) => ({ id: String(i), url })),
    };
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const path = `new/articles/${id}`;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Nuristani Article",
      description: "Read articles about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.",
    };
  }

  const title = article.nameEn || article.name || "Nuristani Article";
  const authorName = article.authorEn || article.author || "";
  const description = authorName
    ? `${title} — by ${authorName}. Read this article about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.`
    : `${title} — Read this article about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.`;
  const imageUrl = article.pictures[0]?.url || (isArticleBlocks(article.body) ? firstBlockImageUrl(article.body) : undefined);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: localeUrl(locale, path),
      type: "article",
      ...(imageUrl && { images: [{ url: imageUrl, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    alternates: {
      canonical: localeUrl(locale, path),
      languages: buildLanguageAlternates(path),
    },
  };
}

export default async function NewArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);
  return <ArticleDetailClient article={article} />;
}
