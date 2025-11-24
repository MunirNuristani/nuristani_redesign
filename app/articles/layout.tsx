import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuristani Articles - Cultural Stories and Educational Content",
  description:
    "Read articles about Nuristani culture, history, language, and traditions. Educational content in multiple languages including English, Dari, Pashto, and Nuristani.",
  keywords: [
    "Nuristani articles",
    "Nuristan culture",
    "Afghanistan articles",
    "Nuristani language articles",
    "Nuristan history",
    "مقالات نورستانی",
    "نورستان",
  ],
  openGraph: {
    title: "Nuristani Articles - Cultural & Educational Content",
    description:
      "Explore articles about Nuristani culture, history, and language",
    url: "https://nuristani.info/articles",
    type: "website",
    images: [
      {
        url: "/logo_original_noLabel.png",
        width: 1200,
        height: 630,
        alt: "Nuristani Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuristani Articles",
    description: "Cultural stories and educational content about Nuristan",
  },
  alternates: {
    canonical: "https://nuristani.info/articles",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
