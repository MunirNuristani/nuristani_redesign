import { Metadata } from 'next';
import PageClient from './PageClient';
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: 'Kalasha Ala Keyboard - Nuristani Language Keyboard App',
    description: 'Download the Kalasha Ala Keyboard — the official Nuristani language keyboard for Android, iOS, Windows, and macOS. Type in Nuristani script with ease on all your devices.',
    keywords: [
      'Kalasha Ala Keyboard',
      'Nuristani keyboard',
      'Nuristani language app',
      'Nuristani script keyboard',
      'Afghanistan language technology',
      'کیبورد نورستانی',
    ],
    openGraph: {
      title: 'Kalasha Ala Keyboard - Nuristani Language Keyboard App',
      description: 'The official Nuristani language keyboard for Android, iOS, Windows, and macOS',
      url: localeUrl(locale, 'technology'),
      type: 'website',
      images: [
        {
          url: '/logo_original_noLabel.png',
          width: 1200,
          height: 630,
          alt: 'Kalasha Ala Nuristani Keyboard',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kalasha Ala Keyboard - Nuristani Language App',
      description: 'Download the Nuristani language keyboard for all platforms',
    },
    alternates: {
      canonical: localeUrl(locale, 'technology'),
      languages: buildLanguageAlternates('technology'),
    },
  };
}

export default function Page() {
  return <PageClient />;
}
