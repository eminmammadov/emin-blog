'use client';

import { useEffect } from 'react';

export default function LayoutWithAutoPublish({
  children,
}: {
  children: React.ReactNode;
}) {
  // Zamanlanmış blog yazılarını kontrol et ve yayınla
  useEffect(() => {
    const checkScheduledPosts = async () => {
      try {
        // Zamanlanmış blog yazılarını yayınla
        // Burada doğrudan API'yi çağırmak yerine, bir proxy API kullanıyoruz
        const response = await fetch('/api/client/check-scheduled', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.publishedBlogs && result.publishedBlogs.length > 0) {
            console.log(`Auto-published ${result.publishedBlogs.length} scheduled blog posts:`, result.publishedBlogs);
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        // Hata durumunda sessizce devam et, konsola hata yazdırma
        // console.error('Error checking scheduled posts:', _error);
      }
    };

    // Sayfa yüklendiğinde zamanlanmış blog yazılarını kontrol et
    checkScheduledPosts();

    // Her 5 dakikada bir zamanlanmış blog yazılarını kontrol et
    const interval = setInterval(checkScheduledPosts, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
