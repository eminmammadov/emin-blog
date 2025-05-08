'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './BlogList.module.css';
import type { BlogPost } from '@/types/blog';

// BlogList bileşeni için statik metinler
const BLOG_LIST_TEXTS = {
  TABLE_HEADERS: {
    DATE: '/ TARİXÇƏ',
    ARTICLES: '/ MƏQALƏLƏR',
    CATEGORY: '/ KATEQORİYA'
  },
  SEARCH: {
    NO_RESULTS: 'üçün heç bir nəticə tapılmadı.',
    RESULTS_FOUND: 'üçün {count} nəticə tapıldı.',
    NO_MATCHING_POSTS: 'Axtarışınıza uyğun bloq yazısı tapılmadı.',
    NO_POSTS: 'Bloq yazısı tapılmadı.'
  }
};

interface BlogListProps {
  posts: BlogPost[];
  limit?: number;
  title?: string;
}

export default function BlogList({
  posts,
  limit,
  title
}: BlogListProps) {
  const searchParams = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);

  // Update filtered posts when posts prop changes
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Filter posts based on search query
  useEffect(() => {
    const query = searchParams.get('q');

    if (query && query.trim() !== '') {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);

      const filtered = posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
        const contentMatch = post.content.toLowerCase().includes(query.toLowerCase());
        const excerptMatch = post.excerpt.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = post.category.toLowerCase().includes(query.toLowerCase());
        const categoriesMatch = post.categories.some(cat =>
          cat.toLowerCase().includes(query.toLowerCase())
        );

        // Check if all search terms are found in any field
        const allTermsMatch = searchTerms.every(term =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.category.toLowerCase().includes(term) ||
          post.categories.some(cat => cat.toLowerCase().includes(term))
        );

        return titleMatch || contentMatch || excerptMatch || categoryMatch || categoriesMatch || allTermsMatch;
      });

      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, searchParams]);

  const displayPosts = limit ? filteredPosts.slice(0, limit) : filteredPosts;

  // Get search query for displaying search results message
  const searchQuery = searchParams.get('q');
  const isSearching = searchQuery && searchQuery.trim() !== '';

  return (
    <section className={styles.blogListContainer}>
      {title && <h2 className={styles.blogListTitle}>/ {title}</h2>}

      {/* Display search results message if searching */}
      {isSearching && (
        <div style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
          {filteredPosts.length === 0 ? (
            <p><strong>&quot;{searchQuery}&quot;</strong> {BLOG_LIST_TEXTS.SEARCH.NO_RESULTS}</p>
          ) : (
            <p><strong>&quot;{searchQuery}&quot;</strong> {BLOG_LIST_TEXTS.SEARCH.RESULTS_FOUND.replace('{count}', filteredPosts.length.toString())}</p>
          )}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          {isSearching ? BLOG_LIST_TEXTS.SEARCH.NO_MATCHING_POSTS : BLOG_LIST_TEXTS.SEARCH.NO_POSTS}
        </div>
      ) : (
        <table className={styles.blogTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.dateHeader}>{BLOG_LIST_TEXTS.TABLE_HEADERS.DATE}</th>
              <th className={styles.nameHeader}>{BLOG_LIST_TEXTS.TABLE_HEADERS.ARTICLES}</th>
              <th className={styles.typeHeader}>{BLOG_LIST_TEXTS.TABLE_HEADERS.CATEGORY}</th>
              <th className={styles.actionHeader} />
            </tr>
          </thead>
          <tbody>
            {displayPosts.map((post) => (
            <tr
              key={post.slug}
              className={styles.blogRow}
            >
              <td className={styles.dateCell}>
                <Link href={`/blog/${post.slug}`} className={styles.blogLink}>
                  <span className={styles.dateSquare} />
                  {post.date}
                </Link>
                <Link href={`/blog/${post.slug}`} className={`${styles.blogLink} ${styles.mobileTypeTag}`}>
                  <span className={styles.typeTag}>
                    {post.category}
                  </span>
                </Link>
              </td>
              <td className={styles.titleCell}>
                <Link href={`/blog/${post.slug}`} className={styles.blogLink}>
                  {post.title}
                </Link>
              </td>
              <td className={styles.typeCell}>
                <Link href={`/blog/${post.slug}`} className={styles.blogLink}>
                  <span className={styles.typeTag}>
                    {post.category}
                  </span>
                </Link>
              </td>
              <td className={styles.actionCell}>
                <Link href={`/blog/${post.slug}`} className={styles.blogLink}>
                  <span className={styles.actionButton}>+</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </section>
  );
}
