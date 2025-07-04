export default function sitemap() {
  const baseUrl = 'https://nuristani.info';
  
  // Static pages (single URL per page since language is handled by global state)
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/Alphabet', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/dictionary', priority: 0.9, changeFrequency: 'weekly' }, 
    { path: '/Articles', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/Books', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/LandScapes', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/Historic', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/Technology', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/Contact', priority: 0.5, changeFrequency: 'yearly' }
  ];

  const routes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return routes;
}