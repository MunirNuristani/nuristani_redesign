import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale, Locale } from '@/utils/locales';

const HAS_FILE_EXTENSION = /\.[^/]+$/;

const ACCEPT_LANGUAGE_MAP: Record<string, Locale> = {
  en: 'en',
  fa: 'prs',
  prs: 'prs',
  ps: 'ps',
};

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('nuristani-language')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (preferred && ACCEPT_LANGUAGE_MAP[preferred]) {
      return ACCEPT_LANGUAGE_MAP[preferred];
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    HAS_FILE_EXTENSION.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  // Permanent: old unprefixed URLs are consolidated onto the localized ones.
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
