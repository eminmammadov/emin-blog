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
  title = "RiseOfTech",
  highlightedText = "EminBloq",
  description = "Kriptaz'ın məhsul və xidmətlərinin inkişafında istifadə etdiyimiz az bilinən blokzincir texnologiyaları və sistem arxitekturası haqqında texniki məqalələr.",
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
