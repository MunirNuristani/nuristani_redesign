import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nuristani.info';

  // Static pages (single URL per page since language is handled by global state)
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/alphabet', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/dictionary', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/articles', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/books', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/landscape_images', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/historic_images', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/technology', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const }
  ];

  const routes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return routes;
}