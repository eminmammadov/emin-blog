import React, { Suspense } from 'react';
import { getAllBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

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
  try {
    console.log('Fetching all blogs for blog page...');
    const allPosts = await getAllBlogs();
    console.log(`Fetched ${allPosts.length} posts for blog page`);

    return (
      <main>
        <Suspense fallback={<div>Yüklənir...</div>}>
          <BlogList
            posts={allPosts}
            title="Bütün bloq yazıları"
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error rendering blog page:', error);
    return (
      <main>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          margin: '20px auto',
          maxWidth: '600px',
          backgroundColor: 'var(--background)',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Blog yazıları yüklenirken bir hata oluştu
          </h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>
            Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </main>
    );
  }
}
