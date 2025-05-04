import Hero from '@/components/Hero';
import BlogList from '@/components/BlogList';
import { getRecentBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './styles.module.css';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Əsas Səhifə',
  description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji bloq yazıları',
  openGraph: {
    title: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji bloq yazıları',
    url: getFullUrl('/'),
    images: [
      {
        url: getFullUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Emin Blog - Əsas Səhifə',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji bloq yazıları',
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
        <BlogList
          posts={recentPosts}
          limit={10}
        />
        <Link href="/blog" className={styles.viewAllButton}>
          Bütün Bloqlar
        </Link>
      </main>
    );
  } catch (error) {
    console.error('Error rendering homepage:', error);
    return (
      <main>
        <Hero />
        <div className={styles.errorContainer}>
          <h2>Blog yazıları yüklenirken bir hata oluştu</h2>
          <p>Lütfen daha sonra tekrar deneyin.</p>
        </div>
        <Link href="/blog" className={styles.viewAllButton}>
          Bütün Bloqlar
        </Link>
      </main>
    );
  }
}
