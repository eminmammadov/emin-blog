'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './UpcomingPopUp.module.css';

export default function UpcomingPopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Sadece ana sayfada göster
    if (pathname !== '/') {
      setIsVisible(false);
      return;
    }

    // LocalStorage'dan son kapatma zamanını kontrol et
    const lastClosed = localStorage.getItem('upcomingPopUpClosed');
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

    // Eğer son kapatmadan bu yana 1 saat geçmişse veya hiç kapatılmamışsa göster
    const shouldShow = !lastClosed || (currentTime - Number.parseInt(lastClosed, 10)) > oneHour;

    if (!shouldShow) {
      console.log('UpcomingPopUp will not show - last closed:', new Date(Number.parseInt(lastClosed || '0', 10)).toLocaleString());
      return;
    }

    // 1 saniye sonra yumuşakça göster
    const timer = setTimeout(() => {
      setIsVisible(true);
      console.log('UpcomingPopUp is now visible');
    }, 1000);

    return () => {
      clearTimeout(timer);
      console.log('UpcomingPopUp timer cleared');
    };
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    // Kapatma zamanını localStorage'a kaydet
    localStorage.setItem('upcomingPopUpClosed', Date.now().toString());
  };

  // Eğer görünür değilse veya ana sayfada değilse, hiçbir şey render etme
  if (!isVisible || pathname !== '/') {
    return null;
  }

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popup}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/pop-up.jpg"
            alt="Pop-up Image"
            width={380}
            height={180}
            className={styles.popupImage}
            priority
          />
        </div>
        <div className={styles.popupContent}>
          <h2 className={styles.title}>Hazırlanır!</h2>
          <p className={styles.description}>
            Metalong Labs layihəsi haqqında son bloq yazısı hazırlanır və tezliklə yayımlanacaq.
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={handleClose}
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}
