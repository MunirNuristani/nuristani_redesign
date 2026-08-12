import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/*/new'],
      },
    ],
    sitemap: 'https://nuristani.info/sitemap.xml',
  };
}
