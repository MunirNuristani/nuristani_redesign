import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Hijri Shamsi Calendar - Afghan Solar Calendar",
    description:
      "Interactive Hijri Shamsi (Afghan Solar) calendar. Convert dates between the Afghan solar calendar and Gregorian calendar. View the current date in the Afghan calendar system used in Afghanistan.",
    keywords: [
      "Hijri Shamsi calendar",
      "Afghan solar calendar",
      "Afghanistan calendar",
      "Shamsi date",
      "تقویم هجری شمسی",
      "تقویم افغانستان",
    ],
    openGraph: {
      title: "Hijri Shamsi Calendar - Afghan Solar Calendar",
      description: "Interactive Afghan solar calendar — view and convert Hijri Shamsi dates",
      url: localeUrl(locale, "calendar"),
      type: "website",
    },
    alternates: {
      canonical: localeUrl(locale, "calendar"),
      languages: buildLanguageAlternates("calendar"),
    },
  };
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
