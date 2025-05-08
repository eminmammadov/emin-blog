'use client';

import React, { useEffect } from 'react';
import styles from '../../app/blog/[slug]/blogPost.module.css';
import { getShortUrl } from '@/lib/shortLink';
import { extractFirstImageFromContent } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  slug: string;
  content?: string; // Blog içeriği
}

export default function ShareButtons({ title, slug, content }: ShareButtonsProps) {
  // Blog içeriğinden ilk resmi çıkar - bu bilgi blog post sayfasında metadata için kullanılıyor
  useEffect(() => {
    if (content) {
      const firstImageUrl = extractFirstImageFromContent(content);
      if (firstImageUrl) {
        console.log('ShareButtons: Found image in content:', firstImageUrl);
      }
    }
  }, [content]);

  const handleTwitterShare = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';

    // Qısa URL yaradılır
    const shortUrl = getShortUrl(siteUrl, slug);

    // Twitter üçün paylaşım URL-i
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} via @eminmammadov`)}&url=${encodeURIComponent(shortUrl)}`;

    // Kiçik pəncərə açaq
    window.open(twitterUrl, 'twitter-share', 'width=550,height=435');
    return false;
  };

  const handleLinkedInShare = () => {
    // LinkedIn üçün birbaşa paylaşım metodu
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';

    // Qısa URL yaradılır
    const shortUrl = getShortUrl(siteUrl, slug);

    // Birbaşa LinkedIn-in paylaşım səhifəsinə yönləndir
    // Bu, istifadəçinin LinkedIn-ə daxil olmasını və paylaşım etməsini təmin edir
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${title} via @eminmammadov ${shortUrl}`)}`;

    // Yeni bir sekmədə açaq
    window.open(linkedinUrl, '_blank');
    return false;
  };

  return (
    <div className={styles.shareButtons}>
      <button
        type="button"
        onClick={handleTwitterShare}
        className={styles.shareButton}
      >
        X/Twitter
      </button>
      <button
        type="button"
        onClick={handleLinkedInShare}
        className={styles.shareButton}
      >
        LinkedIn
      </button>
    </div>
  );
}
