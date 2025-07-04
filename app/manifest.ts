export default function manifest() {
  return {
    name: 'Mirza Taza Gul Khan Cultural Foundation',
    short_name: 'Nuristani.info',
    description: 'A cultural foundation preserving language, heritage and traditions of Nuristan, Afghanistan',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#92400e',
    orientation: 'portrait-primary',
    categories: ['education', 'culture', 'reference'],
    lang: 'en',
    icons: [
      {
        src: '/logo_original.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/logo_original_noLabel.png', 
        sizes: 'any',
        type: 'image/png'
      }
    ]
  }
}