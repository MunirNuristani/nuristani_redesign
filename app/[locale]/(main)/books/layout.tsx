import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

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
      description:
        "Explore books and publications about Nuristani culture and heritage",
      url: localeUrl(locale, "books"),
      type: "website",
      images: [
        {
          url: "/logo_original_noLabel.png",
          width: 1200,
          height: 630,
          alt: "Nuristani Digital Library",
        },
      ],
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

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
