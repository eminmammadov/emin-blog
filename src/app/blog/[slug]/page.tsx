import React from 'react';
import { getBlogBySlug, getAllBlogs } from '@/lib/mdx';
import Link from 'next/link';
import styles from './blogPost.module.css';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.blogPostContainer}>
      <div className={styles.blogPostContent}>
        <h1 className={styles.blogPostTitle}>{post.title}</h1>

        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>/ METADATA</h2>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabel}>DATE:</div>
              <div className={styles.metadataValue}>{post.date}</div>
            </div>
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabel}>KATEQORİY:</div>
              <div className={styles.metadataValue}>{post.categories.join(', ')}</div>
            </div>
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabel}>PAYLAŞ:</div>
              <div className={styles.shareButtons}>
                <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://example.com/blog/${post.slug}`)}`} target="_blank" className={styles.shareButton}>
                  X/Twitter
                </Link>
                <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://example.com/blog/${post.slug}`)}`} target="_blank" className={styles.shareButton}>
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionTitle}>/ ARTICLE</h2>
          <div className={styles.articleContent}>
            <MDXRemote source={post.content} />
            <div>
              <Link href="/blog" className={styles.backButton}>
                ← Geriyə get
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
