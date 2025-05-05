'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h2 className={styles.title}>404 - Tapılmadı</h2>
      <p className={styles.description}>Axtardığınız səhifə mövcud deyil.</p>

      <Link href="/" className={styles.homeButton}>
        Əsas Səhifəyə Qayıt
      </Link>
    </div>
  );
}
