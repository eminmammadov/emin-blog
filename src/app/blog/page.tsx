import React from 'react';
import { getAllBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Bütün Yazılar',
  description: 'Blockchain ve sistem memarlığı haqqında bütün blog yazılarımızı kəşfedin.',
  openGraph: {
    title: 'Bütün Yazılar | Emin Blog',
    description: 'Blockchain ve sistem memarlığı haqqında bütün blog yazılarımızı kəşfedin.',
    url: getFullUrl('/blog'),
    images: [
      {
        url: getFullUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Emin Blog - Bütün Yazılar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bütün Yazılar | Emin Blog',
    description: 'Blockchain ve sistem memarlığı haqqında bütün blog yazılarımızı kəşfedin.',
    images: [getFullUrl('/images/og-image.jpg')],
  },
};

export default async function BlogPage() {
  const allPosts = await getAllBlogs();

  return (
    <main>
      <BlogList
        posts={allPosts}
        title="Bütün bloq yazıları"
      />
    </main>
  );
}
