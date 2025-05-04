'use client';

import React from 'react';
import styles from '../../app/blog/[slug]/blogPost.module.css';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const handleTwitterShare = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';
    const fullUrl = `${siteUrl}/blog/${slug}`;

    // Twitter için paylaşım URL'si
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} via @eminmammadov`)}&url=${encodeURIComponent(fullUrl)}`;

    // Mini pencere açalım
    window.open(twitterUrl, 'twitter-share', 'width=550,height=435');
    return false;
  };

  const handleLinkedInShare = () => {
    // LinkedIn için doğrudan paylaşım yöntemi
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';
    const fullUrl = `${siteUrl}/blog/${slug}`;

    // Doğrudan LinkedIn'in paylaşım sayfasına yönlendir
    // Bu, kullanıcının LinkedIn'e giriş yapmasını ve paylaşım yapmasını sağlar
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${title} via @eminmammadov ${fullUrl}`)}`;

    // Yeni bir sekmede açalım
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
