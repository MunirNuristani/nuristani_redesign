import { Metadata } from "next";
import { Locale, localeUrl, buildLanguageAlternates } from "@/utils/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return {
    title: "Contact Us - Nuristani Cultural Foundation",
    description:
      "Get in touch with the Mirza Taza Gul Khan Cultural Foundation. Contact us for questions, feedback, or contributions to preserving Nuristani culture.",
    keywords: [
      "contact Nuristani",
      "Nuristani foundation contact",
      "get in touch",
      "تماس با ما",
    ],
    openGraph: {
      title: "Contact - Nuristani Cultural Foundation",
      description: "Get in touch with us about Nuristani culture preservation",
      url: localeUrl(locale, "contact"),
      type: "website",
    },
    alternates: {
      canonical: localeUrl(locale, "contact"),
      languages: buildLanguageAlternates("contact"),
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
