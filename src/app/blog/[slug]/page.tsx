import { getBlogBySlug, getAllBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './blogPost.module.css';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { getFullUrl } from '@/lib/utils';
import ShareButtons from '@/components/ShareButtons/ShareButtons';

// Blog post sayfası için statik metinler
const BLOG_POST_TEXTS = {
  META: {
    NOT_FOUND_TITLE: 'Blog Yazıları Tapılmadı',
    NOT_FOUND_DESCRIPTION: 'Axtardığınız bloq yazısı tapılmadı.',
    DEFAULT_TITLE: 'Blog',
    DEFAULT_DESCRIPTION: 'Emin Blog'
  },
  SECTIONS: {
    METADATA: '/ METADATA',
    ARTICLE: '/ MƏQALƏ'
  },
  LABELS: {
    DATE: 'TARİXÇƏ:',
    CATEGORY: 'KATEQORİYA:',
    SHARE: 'PAYLAŞ:'
  },
  BACK_BUTTON: '← Geriyə get',
  ERROR: {
    TITLE: 'Blog yazısı yüklenirken bir hata oluştu',
    MESSAGE: 'Lütfen daha sonra tekrar deneyin.'
  }
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Dynamic metadata generation for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    console.log(`Generating metadata for blog post with slug: ${slug}`);
    const post = await getBlogBySlug(slug);

    if (!post) {
      console.log(`Blog post with slug ${slug} not found for metadata`);
      return {
        title: BLOG_POST_TEXTS.META.NOT_FOUND_TITLE,
        description: BLOG_POST_TEXTS.META.NOT_FOUND_DESCRIPTION,
      };
    }

    console.log(`Generated metadata for: ${post.title}`);
    return {
      title: post.title,
      description: post.excerpt,
      authors: [{ name: post.author }],
      keywords: [...post.categories, 'blog', 'Emin Blog'],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        tags: post.categories,
        url: getFullUrl(`/blog/${slug}`),
        images: [
          {
            url: getFullUrl('/images/og-image.jpg'),
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [getFullUrl('/images/og-image.jpg')],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog post:", error);
    return {
      title: BLOG_POST_TEXTS.META.DEFAULT_TITLE,
      description: BLOG_POST_TEXTS.META.DEFAULT_DESCRIPTION,
    };
  }
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    console.log(`Fetching blog post with slug: ${slug}`);
    const post = await getBlogBySlug(slug);

    if (!post) {
      console.log(`Blog post with slug ${slug} not found`);
      notFound();
    }

    console.log(`Rendering blog post: ${post.title}`);
    return (
      <article className={styles.blogPostContainer}>
        <div className={styles.blogPostContent}>
          <h1 className={styles.blogPostTitle}>{post.title}</h1>

          <div className={styles.metadataSection}>
            <h2 className={styles.sectionTitle}>{BLOG_POST_TEXTS.SECTIONS.METADATA}</h2>
            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>{BLOG_POST_TEXTS.LABELS.DATE}</div>
                <div className={styles.metadataValue}>{post.date}</div>
              </div>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>{BLOG_POST_TEXTS.LABELS.CATEGORY}</div>
                <div className={styles.metadataValue}>{post.category}</div>
              </div>
              <div className={styles.metadataItem}>
                <div className={styles.metadataLabel}>{BLOG_POST_TEXTS.LABELS.SHARE}</div>
                <ShareButtons
                  title={post.title}
                  slug={post.slug}
                />
              </div>
            </div>
          </div>

          <div className={styles.articleSection}>
            <h2 className={styles.sectionTitle}>{BLOG_POST_TEXTS.SECTIONS.ARTICLE}</h2>
            <div className={styles.articleContent}>
              <MDXRemote source={post.content} />
              <div>
                <Link href="/blog" className={styles.backButton}>
                  {BLOG_POST_TEXTS.BACK_BUTTON}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error(`Error rendering blog post with slug ${params.slug}:`, error);
    return (
      <article className={styles.blogPostContainer}>
        <div className={styles.blogPostContent}>
          <h1 className={styles.blogPostTitle}>{BLOG_POST_TEXTS.ERROR.TITLE}</h1>
          <div className={styles.articleSection}>
            <div className={styles.articleContent}>
              <p>{BLOG_POST_TEXTS.ERROR.MESSAGE}</p>
              <div>
                <Link href="/blog" className={styles.backButton}>
                  {BLOG_POST_TEXTS.BACK_BUTTON}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}
