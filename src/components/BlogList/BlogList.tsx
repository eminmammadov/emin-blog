'use client';

import React from 'react';
import Link from 'next/link';
import styles from './BlogList.module.css';
import type { BlogPost } from '@/types/blog';

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
  const displayPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <section className={styles.blogListContainer}>
      {title && <h2 className={styles.blogListTitle}>/ {title}</h2>}
      <table className={styles.blogTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.dateHeader}>/ TARİXÇƏ</th>
            <th className={styles.nameHeader}>/ MƏQALƏLƏR</th>
            <th className={styles.typeHeader}>/ KATEQORİYA</th>
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
    </section>
  );
}
