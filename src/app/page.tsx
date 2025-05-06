import Hero from '@/components/Hero';
import BlogList from '@/components/BlogList';
import { getRecentBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './styles.module.css';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';
import { Suspense } from 'react';

// Ana sayfa için statik metinler
const HOME_PAGE_TEXTS = {
  META: {
    TITLE: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    DESCRIPTION: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji bloq yazıları',
    OG_TITLE: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    OG_ALT: 'Emin Blog - Əsas Səhifə'
  },
  LOADING: 'Yüklənir...',
  VIEW_ALL: 'Bütün Bloqlar',
  ERROR: {
    TITLE: 'Blog yazıları yüklenirken bir hata oluştu',
    MESSAGE: 'Lütfen daha sonra tekrar deneyin.'
  }
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: HOME_PAGE_TEXTS.META.TITLE,
  description: HOME_PAGE_TEXTS.META.DESCRIPTION,
  openGraph: {
    title: HOME_PAGE_TEXTS.META.OG_TITLE,
    description: HOME_PAGE_TEXTS.META.DESCRIPTION,
    url: getFullUrl('/'),
    images: [
      {
        url: getFullUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: HOME_PAGE_TEXTS.META.OG_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_PAGE_TEXTS.META.OG_TITLE,
    description: HOME_PAGE_TEXTS.META.DESCRIPTION,
    images: [getFullUrl('/images/og-image.jpg')],
  },
};

export default async function Home() {
  try {
    console.log('Fetching recent blogs for homepage...');
    const recentPosts = await getRecentBlogs(5);
    console.log(`Fetched ${recentPosts.length} recent posts for homepage`);

    return (
      <main>
        <Hero />
        <Suspense fallback={<div>{HOME_PAGE_TEXTS.LOADING}</div>}>
          <BlogList
            posts={recentPosts}
            limit={10}
          />
        </Suspense>
        <Link href="/blog" className={styles.viewAllButton}>
          {HOME_PAGE_TEXTS.VIEW_ALL}
        </Link>
      </main>
    );
  } catch (error) {
    console.error('Error rendering homepage:', error);
    return (
      <main>
        <Hero />
        <div className={styles.errorContainer}>
          <h2>{HOME_PAGE_TEXTS.ERROR.TITLE}</h2>
          <p>{HOME_PAGE_TEXTS.ERROR.MESSAGE}</p>
        </div>
        <Link href="/blog" className={styles.viewAllButton}>
          {HOME_PAGE_TEXTS.VIEW_ALL}
        </Link>
      </main>
    );
  }
}
