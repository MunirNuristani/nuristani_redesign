import type { Metadata, Viewport } from "next";
import { Lateef, Noto_Sans } from "next/font/google";

import "../globals.css";

const lateef = Lateef({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-lateef",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
});

import { ReducerWrapper } from "@/context/AppContext";
import ClientLayout from "./ClientLayout";
import { WebVitals } from "../web-vitals";
import {
  locales,
  Locale,
  localeHtmlLang,
  localeDescriptions,
  localeOgLocale,
  getDir,
  buildLanguageAlternates,
  localeUrl,
} from "@/utils/locales";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Any locale segment outside the 4 supported ones 404s instead of rendering.
export const dynamicParams = false;

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };

  return {
    metadataBase: new URL("https://nuristani.info"),
    title: {
      default: "Mirza Taza Gul Khan Cultural Foundation | Nuristani Language & Culture",
      template: "%s | Nuristani Cultural Foundation",
    },
    description: localeDescriptions[locale],
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
      locale: localeOgLocale[locale],
      url: localeUrl(locale, ""),
      siteName: "Nuristani Cultural Foundation",
      title: "Mirza Taza Gul Khan Cultural Foundation",
      description: localeDescriptions[locale],
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
      canonical: localeUrl(locale, ""),
      languages: buildLanguageAlternates(""),
    },
    category: "education",
    verification: {
      google: "Q9IDFIi1RYNtMURBro0oLbLwQbZ8e3WvMu6PvQnX3Tg",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = (await params) as { locale: Locale };
  const htmlLang = localeHtmlLang[locale];
  const dir = getDir(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mirza Taza Gul Khan Cultural Foundation",
    alternateName: "Nuristani Cultural Foundation",
    url: "https://nuristani.info",
    logo: "https://nuristani.info/logo_original_noLabel.png",
    description: localeDescriptions[locale],
    inLanguage: htmlLang,
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
    <html lang={htmlLang} dir={dir} className={`${lateef.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* DNS prefetch for data sources */}
        <link rel="dns-prefetch" href="https://v5.airtableusercontent.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />

        {/* Preload LCP image */}
        <link
          rel="preload"
          as="image"
          href="/bg.jpg"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/heroImage01.webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
      </head>
      <body>
        <WebVitals />
        <ReducerWrapper key={locale} initialLocale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </ReducerWrapper>
      </body>
    </html>
  );
}
