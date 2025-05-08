import React, { Suspense } from 'react';
import { getAllBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';

// Blog sayfası için statik metinler
const BLOG_PAGE_TEXTS = {
  META: {
    TITLE: 'Bütün Yazılar',
    DESCRIPTION: 'Blockchain ve sistem memarlığı haqqında bütün blog yazılarımızı kəşfedin.',
    OG_TITLE: 'Bütün Yazılar | Emin Blog',
    OG_ALT: 'Emin Blog - Bütün Yazılar'
  },
  LOADING: 'Yüklənir...',
  BLOG_LIST_TITLE: 'Bütün bloq yazıları',
  ERROR: {
    TITLE: 'Bloq yazıları yüklənərkər bir xəta baş verdi',
    MESSAGE: 'Xahiş edirik bir qədər sonra təkrar yoxlayın.'
  }
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: BLOG_PAGE_TEXTS.META.TITLE,
  description: BLOG_PAGE_TEXTS.META.DESCRIPTION,
  openGraph: {
    title: BLOG_PAGE_TEXTS.META.OG_TITLE,
    description: BLOG_PAGE_TEXTS.META.DESCRIPTION,
    url: getFullUrl('/blog'),
    images: [
      {
        url: getFullUrl('/images/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: BLOG_PAGE_TEXTS.META.OG_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_PAGE_TEXTS.META.OG_TITLE,
    description: BLOG_PAGE_TEXTS.META.DESCRIPTION,
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
        <Suspense fallback={
          <div className="flex items-center justify-center">
            {BLOG_PAGE_TEXTS.LOADING}
          </div>
          }>
          <BlogList
            posts={allPosts}
            title={BLOG_PAGE_TEXTS.BLOG_LIST_TITLE}
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
            {BLOG_PAGE_TEXTS.ERROR.TITLE}
          </h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>
            {BLOG_PAGE_TEXTS.ERROR.MESSAGE}
          </p>
        </div>
      </main>
    );
  }
}
