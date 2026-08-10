import { defaultLocale } from '@/utils/locales';

export default function manifest() {
  return {
    name: 'Mirza Taza Gul Khan Cultural Foundation',
    short_name: 'Nuristani.info',
    description: 'A cultural foundation preserving language, heritage and traditions of Nuristan, Afghanistan',
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#92400e',
    orientation: 'portrait-primary',
    categories: ['education', 'culture', 'reference'],
    lang: 'en',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}