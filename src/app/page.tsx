import Hero from '@/components/Hero';
import BlogList from '@/components/BlogList';
import { getRecentBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './styles.module.css';

export default function Home() {
  const recentPosts = getRecentBlogs(5);

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
