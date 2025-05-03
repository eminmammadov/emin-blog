import React from 'react';
import { getAllBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tüm Yazılar',
  description: 'Blockchain ve sistem memarlığı hakkında tüm blog yazılarımızı keşfedin.',
  openGraph: {
    title: 'Tüm Yazılar | Emin Blog',
    description: 'Blockchain ve sistem memarlığı hakkında tüm blog yazılarımızı keşfedin.',
    url: getFullUrl('/blog'),
    images: [
      {
        url: getFullUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Emin Blog - Tüm Yazılar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tüm Yazılar | Emin Blog',
    description: 'Blockchain ve sistem memarlığı hakkında tüm blog yazılarımızı keşfedin.',
    images: [getFullUrl('/images/og-image.jpg')],
  },
};

export default async function BlogPage() {
  const allPosts = await getAllBlogs();

  return (
    <main>
      <BlogList
        posts={allPosts}
      />
    </main>
  );
}
