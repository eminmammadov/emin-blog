import Hero from '@/components/Hero';
import BlogList from '@/components/BlogList';
import { getRecentBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './styles.module.css';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Əsas Səhifə',
  description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
  openGraph: {
    title: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
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
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
    images: [getFullUrl('/images/og-image.jpg')],
  },
};

export default async function Home() {
  const recentPosts = await getRecentBlogs(5);

  return (
    <main>
      <Hero />
      <BlogList
        posts={recentPosts}
        limit={5}
      />
      <Link href="/blog" className={styles.viewAllButton}>
        Bütün Bloqlar
      </Link>
    </main>
  );
}
