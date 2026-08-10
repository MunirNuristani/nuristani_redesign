export const locales = ['en', 'prs', 'ps', 'nr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'prs';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// BCP-47-ish tags used for the <html lang> attribute. "nur" is a
// placeholder tag for Kalasha Ala Nuristani, which has no standard code.
export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  prs: 'fa-AF',
  ps: 'ps',
  nr: 'nur',
};

const rtlLocales: readonly Locale[] = ['prs', 'ps', 'nr'];

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export const localeDescriptions: Record<Locale, string> = {
  en: 'Preserving Nuristani language, culture, and heritage. Learn about Nuristan, Afghanistan through our comprehensive resources.',
  prs: 'حفظ زبان، فرهنگ و میراث نورستانی. در مورد نورستان، افغانستان از طریق منابع جامع ما بیاموزید.',
  ps: 'د نورستانی ژبې، کلتور او میراث ساتل. زموږ د جامع سرچینو له لارې د افغانستان د نورستان په اړه زده کړه.',
  nr: 'نورستانی کلشه الا، کلتور او میراث ساتل',
};

export const localeOgLocale: Record<Locale, string> = {
  en: 'en_US',
  prs: 'fa_AF',
  ps: 'ps_AF',
  nr: 'nr_AF',
};

const baseUrl = 'https://nuristani.info';

// Builds the `alternates.languages` map Next.js expects: every locale's
// version of `path` (no leading slash), plus an x-default pointing at the
// site's default-locale version.
export function buildLanguageAlternates(path: string): Record<string, string> {
  const suffix = path ? `/${path}` : '';
  const entries: Record<string, string> = {};
  for (const locale of locales) {
    entries[locale] = `${baseUrl}/${locale}${suffix}`;
  }
  entries['x-default'] = `${baseUrl}/${defaultLocale}${suffix}`;
  return entries;
}

export function localeUrl(locale: Locale, path: string): string {
  const suffix = path ? `/${path}` : '';
  return `${baseUrl}/${locale}${suffix}`;
}
