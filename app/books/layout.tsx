import { Metadata } from "next";

export const metadata: Metadata = {
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
    url: "https://nuristani.info/books",
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
    canonical: "https://nuristani.info/books",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
