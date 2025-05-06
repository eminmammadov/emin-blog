'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

// Not Found sayfası için statik metinler
const NOT_FOUND_TEXTS = {
  TITLE: '404 - Tapılmadı',
  DESCRIPTION: 'Axtardığınız səhifə mövcud deyil.',
  HOME_BUTTON: 'Əsas Səhifəyə Qayıt'
};

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h2 className={styles.title}>{NOT_FOUND_TEXTS.TITLE}</h2>
      <p className={styles.description}>{NOT_FOUND_TEXTS.DESCRIPTION}</p>

      <Link href="/" className={styles.homeButton}>
        {NOT_FOUND_TEXTS.HOME_BUTTON}
      </Link>
    </div>
  );
}
