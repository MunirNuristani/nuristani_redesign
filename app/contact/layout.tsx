import { Metadata } from "next";

export const metadata: Metadata = {
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
    url: "https://nuristani.info/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://nuristani.info/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
