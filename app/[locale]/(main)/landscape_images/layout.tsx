import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Nuristan Landscape Photography - Natural Beauty of Afghanistan",
    description:
      "Explore stunning landscape photographs of Nuristan, Afghanistan. Discover the breathtaking mountains, valleys, rivers, and natural scenery of the Nuristani region.",
    keywords: [
      "Nuristan landscape",
      "Afghanistan photography",
      "Nuristan nature",
      "Nuristani mountains",
      "Afghanistan scenery",
      "نورستان طبیعت",
    ],
    openGraph: {
      title: "Nuristan Landscape Photography - Natural Beauty of Afghanistan",
      description: "Stunning landscape photographs capturing the natural beauty of Nuristan, Afghanistan",
      url: localeUrl(locale, "landscape_images"),
      type: "website",
      images: [{ url: "/logo_original_noLabel.png", width: 1200, height: 630, alt: "Nuristan Landscape Photography" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nuristan Landscape Photography",
      description: "Breathtaking landscape photographs of Nuristan, Afghanistan",
    },
    alternates: {
      canonical: localeUrl(locale, "landscape_images"),
      languages: buildLanguageAlternates("landscape_images"),
    },
  };
}

export default function LandscapeImagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
