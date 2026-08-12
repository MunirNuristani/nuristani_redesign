import { Metadata } from 'next';
import { base } from '@/utils/airTable';
import ArticleDetailClient from './ArticleDetailClient';
import { Locale, localeUrl, buildLanguageAlternates } from '@/utils/locales';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const path = `articles/${id}`;

  try {
    const data = await base('Articles').find(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const article = data.fields as any;

    const title = article?.Article_Name_en || article?.Article_Name || 'Nuristani Article';
    const author = article?.Author_Name_en || article?.Author_Name || '';
    const description = author
      ? `${title} — by ${author}. Read this article about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.`
      : `${title} — Read this article about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.`;
    const imageUrl = article?.Pictures?.[0]?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: localeUrl(locale, path),
        type: 'article',
        ...(imageUrl && {
          images: [{ url: imageUrl, alt: title }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(imageUrl && { images: [imageUrl] }),
      },
      alternates: {
        canonical: localeUrl(locale, path),
        languages: buildLanguageAlternates(path),
      },
    };
  } catch {
    return {
      title: 'Nuristani Article',
      description: 'Read articles about Nuristani culture, history, and heritage on the Nuristani Cultural Foundation.',
    };
  }
}

export default function ArticleDetailPage() {
  return <ArticleDetailClient />;
}
