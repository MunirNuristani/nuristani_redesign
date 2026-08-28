import { MetadataRoute } from 'next';
import { locales, localeUrl, buildLanguageAlternates } from '@/utils/locales';

// Runs fresh on every request so new articles show up without a redeploy.
export const dynamic = 'force-dynamic';

// Plain REST instead of the Firestore client SDK: the SDK opens a
// persistent, browser-oriented stream that is unreliable in a one-shot
// serverless invocation (it caused intermittent "sitemap could not be
// read" failures in Google Search Console). REST is a single fetch.
const FIRESTORE_ARTICLES_URL = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FB_PROJECTID}/databases/(default)/documents/articles`;

async function fetchArticleIds(): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(FIRESTORE_ARTICLES_URL);
    url.searchParams.set('key', process.env.NEXT_PUBLIC_FB_APIKEY!);
    url.searchParams.set('pageSize', '300');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Firestore REST list failed: ${res.status}`);
    const data = await res.json();

    for (const doc of data.documents ?? []) {
      const id = doc.name?.split('/').pop();
      if (id) ids.push(id);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return ids;
}

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
    const articleIds = await fetchArticleIds();
    for (const id of articleIds) {
      routes.push(...entriesFor(`articles/${id}`, 0.6, 'monthly'));
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  return routes;
}
