"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps } from "react";
import { defaultLocale, isLocale } from "@/utils/locales";

type LocaleLinkProps = ComponentProps<typeof Link>;

const EXTERNAL_HREF = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

// Wraps next/link and prefixes internal hrefs with the current locale
// segment (read from the URL, not app state, so it's always correct even
// mid-navigation). External/mailto/tel links pass through untouched.
export default function LocaleLink({ href, ...rest }: LocaleLinkProps) {
  const params = useParams() as { locale?: string };
  const locale = isLocale(params?.locale ?? "") ? (params.locale as string) : defaultLocale;

  let prefixed = href;
  if (typeof href === "string" && !EXTERNAL_HREF.test(href)) {
    prefixed = href === "/" ? `/${locale}` : `/${locale}${href}`;
  }

  return <Link href={prefixed} {...rest} />;
}
