
import type { Metadata, Viewport } from "next";

import "./globals.css";
import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import { ReducerWrapper } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import ThemeProvider from "@/app/theme/Provider";
import { WebVitals } from "./web-vitals";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nuristani.info"),
  title: {
    default: "Mirza Taza Gul Khan Cultural Foundation | Nuristani Language & Culture",
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
    "Kalasha Ala",
    "Nuristani dictionary",
    "learn Nuristani",
  ],
  authors: [{ name: "Mirza Taza Gul Khan Cultural Foundation" }],
  creator: "Mirza Taza Gul Khan Cultural Foundation",
  publisher: "Nuristani.info",
  formatDetection: {
    telephone: false,
  },
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
        url: "/logo_original_noLabel.png",
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
    images: ["/logo_original_noLabel.png"],
    creator: "@nuristani_info",
  },
  alternates: {
    canonical: "https://nuristani.info",
  },
  category: "education",
  verification: {
    // Add your verification codes here when you have them
    google: "Q9IDFIi1RYNtMURBro0oLbLwQbZ8e3WvMu6PvQnX3Tg",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mirza Taza Gul Khan Cultural Foundation",
    alternateName: "Nuristani Cultural Foundation",
    url: "https://nuristani.info",
    logo: "https://nuristani.info/logo_original_noLabel.png",
    description:
      "Preserving Nuristani language, culture, and heritage. Educational resources for learning about Nuristan, Afghanistan including dictionary, alphabet, articles, and historical content.",
    sameAs: [
      "https://twitter.com/nuristani_info",
      "https://www.facebook.com/nuristani.info",
    ],
    foundingDate: "2020",
    foundingLocation: {
      "@type": "Place",
      name: "Afghanistan",
    },
    areaServed: "Worldwide",
    mission:
      "To preserve and promote the Nuristani language, culture, and heritage for future generations through digital resources and educational content.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://v5.airtableusercontent.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />

        {/* Preload LCP image */}
        <link
          rel="preload"
          as="image"
          href="/bg.jpg"
          media="(min-width: 768px)"
          // @ts-ignore
          fetchpriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/heroImage01.png"
          media="(max-width: 767px)"
          // @ts-ignore
          fetchpriority="high"
        />
      </head>
      <body>
        <WebVitals />
        <AuthProvider>
          <ReducerWrapper>
            <ThemeProvider>
              <ClientLayout>
                <Header />
                <main className="min-h-[calc(100dvh-180px)]">{children}</main>
                <Footer />
              </ClientLayout>
            </ThemeProvider>
          </ReducerWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
