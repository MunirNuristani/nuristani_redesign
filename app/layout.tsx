// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Metadata } from "next";

import "./globals.css";
import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import { ReducerWrapper } from "@/context/AppContext";
import ClientLayout from "./ClientLayout";
import ThemeProvider from "@/app/theme/Provider";

export function metadata(): Metadata {
  return {
    title: {
      default: "Mirza Taza Gul Khan Cultural Foundation",
      template: "%s | Nuristani Cultural Foundation",
    },
    description:
      "Preserving Nuristani language, culture, and heritage. Learn about Nuristan, Afghanistan through our comprehensive resources including alphabet, dictionary, articles, and historical content.",
    keywords: [
      "Nuristani",
      "Nuristan",
      "Afghanistan",
      "culture",
      "heritage",
      "language",
      "dictionary",
      "alphabet",
      "نورستان",
      "نورستانی",
    ],
    authors: [{ name: "Mirza Taza Gul Khan Cultural Foundation" }],
    creator: "Mirza Taza Gul Khan Cultural Foundation",
    publisher: "Nuristani.info",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://nuristani.info",
      siteName: "Nuristani Cultural Foundation",
      title: "Mirza Taza Gul Khan Cultural Foundation",
      description:
        "Preserving Nuristani language, culture, and heritage of Nuristan, Afghanistan",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Mirza Taza Gul Khan Cultural Foundation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mirza Taza Gul Khan Cultural Foundation",
      description: "Preserving Nuristani language, culture, and heritage",
      images: ["/twitter-image.png"],
      creator: "@nuristani_info",
    },
    alternates: {
      canonical: "https://nuristani.info",
    },
    category: "education",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <ReducerWrapper>
          <ThemeProvider>
            <ClientLayout>
              <Header />
              <div className="h-full">{children}</div>
              <Footer />
            </ClientLayout>
          </ThemeProvider>
        </ReducerWrapper>
      </body>
    </html>
  );
}
