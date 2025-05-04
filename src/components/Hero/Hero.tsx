'use client';

import React from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  title?: string;
  highlightedText?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function Hero({
  title = "Tex-NO",
  highlightedText = "Emin Bloq",
  description = "Blockchain və sistem memarlığı haqqında texnoloji blog yazıları.",
}: HeroProps) {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          {title}<br />
          <span className={styles.highlightedText}>{highlightedText}</span>
        </h1>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}
