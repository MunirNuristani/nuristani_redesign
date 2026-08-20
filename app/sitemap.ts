import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase-config';
import { locales, localeUrl, buildLanguageAlternates } from '@/utils/locales';

// Firestore web SDK keeps a persistent stream that doesn't survive the one-shot `next build` step.
export const dynamic = 'force-dynamic';

const staticPaths = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: 'alphabet', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: 'dictionary', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: 'articles', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: 'books', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: 'historic_images', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: 'landscape_images', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: 'historical-figures', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: 'technology', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: 'technology/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: 'calendar', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: 'contact', priority: 0.5, changeFrequency: 'yearly' as const },
];

// Emits one <url> entry per (route, locale) pair, each carrying hreflang
// `alternates.languages` pointing at its sibling locale versions.
function entriesFor(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap {
  const languages = buildLanguageAlternates(path);
  return locales.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticPaths.flatMap((page) =>
    entriesFor(page.path, page.priority, page.changeFrequency)
  );

  try {
    const snapshot = await getDocs(collection(db, 'articles'));
    for (const doc of snapshot.docs) {
      routes.push(...entriesFor(`articles/${doc.id}`, 0.6, 'monthly'));
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  return routes;
}
