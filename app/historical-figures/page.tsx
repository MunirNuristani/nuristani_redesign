import { Metadata } from 'next';
import PageClient from './PageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Historical Figures of Nuristan - Notable People & Leaders',
  description: 'Discover the notable historical figures, leaders, scholars, and cultural icons of Nuristan, Afghanistan. Biographical profiles of important Nuristani people throughout history.',
  keywords: [
    'Nuristani historical figures',
    'Nuristan leaders',
    'Nuristani scholars',
    'Afghanistan history',
    'Nuristan biography',
    'شخصیت‌های تاریخی نورستان',
  ],
  openGraph: {
    title: 'Historical Figures of Nuristan - Notable People & Leaders',
    description: 'Biographical profiles of notable historical figures from Nuristan, Afghanistan',
    url: 'https://nuristani.info/historical-figures',
    type: 'website',
    images: [
      {
        url: '/logo_original_noLabel.png',
        width: 1200,
        height: 630,
        alt: 'Historical Figures of Nuristan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Historical Figures of Nuristan',
    description: 'Notable historical figures and leaders from Nuristan, Afghanistan',
  },
  alternates: {
    canonical: 'https://nuristani.info/historical-figures',
  },
};

export default function Page() {
  return <PageClient />;
}
