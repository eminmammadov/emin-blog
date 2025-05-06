'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './LoadingScreen.module.css';

// LoadingScreen bileşeni için statik metinler
const LOADING_SCREEN_TEXTS = {
  LOGO_TITLE: 'Emin Blog Logo',
  LOADING_TEXT: 'EminBlog yüklənir...'
};

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const pathname = usePathname();

  // İlk yükleme için loading ekranı
  useEffect(() => {
    // 3 saniye sonra ilk loading ekranını kaldır
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Sayfa geçişlerini izle
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    // Sayfa değiştiğinde loading göster
    setIsPageTransition(true);

    // Sayfa yüklendikten sonra loading'i kaldır
    const timer = setTimeout(() => {
      setIsPageTransition(false);
    }, 800); // Sayfa geçişleri için daha kısa bir süre

    return () => clearTimeout(timer);
  }, [pathname]);

  // İlk yükleme veya sayfa geçişi varsa loading göster
  const showLoading = isLoading || isPageTransition;

  return (
    <div className={`${styles.loadingContainer} ${!showLoading ? styles.loadingContainerHidden : ''}`}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingAnimation}>
          <div className={styles.logoContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              width="100%"
              height="100%"
              version="1.1"
              viewBox="0 0 535.44 524.79"
              aria-labelledby="loadingLogoTitle"
            >
              <title id="loadingLogoTitle">{LOADING_SCREEN_TEXTS.LOGO_TITLE}</title>
              <path
                className={styles.logoPath}
                d="M10.68 97.64l514.08 -97.46c5.87,-1.11 10.68,2.95 10.68,9.04l0 404.84c0,6.08 -4.81,11.97 -10.68,13.09l-514.08 97.46c-5.87,1.11 -10.68,-2.95 -10.68,-9.04l0 -404.84c0,-6.08 4.8,-11.97 10.68,-13.09zm415.15 96.87c-11.08,-7.94 -59.37,-9.36 -53.98,-79.41 -54.3,-32.43 -91.02,-15.66 -128.47,17.05 -8.53,7.45 -14.35,15.67 -22.31,23.78 -7.92,8.07 -15.91,13.65 -23.21,21.04 -41.64,42.18 -108.53,62.23 -90.31,127.18 5.79,20.63 9.79,10.74 -1.88,29.64 -5.06,8.2 -13.31,20 -17.37,28.78l-19.62 46.81c-7.13,15.12 -15.31,3.97 -25.11,42.39 40.1,-8.55 47.54,-43.03 59.34,-70.96 5.14,-12.17 6.3,-8.11 17.68,-15.48 26.47,-17.14 49.39,-33.86 66.92,-60.35 17.79,-26.88 5.26,-13.74 59.18,-36.63 10.88,-4.62 34.83,-17.37 46.39,-14.86 11.36,2.47 40.91,7.87 49.18,12.98 -29.33,37.96 -36.58,10.66 -47.34,53.45 34.71,-5.04 48.64,-25.25 65.11,-41.58 8.6,-8.52 23.09,-18.47 4.84,-30.42 -7.62,-4.99 -24.15,-16.7 -31.5,-19.82 1.33,-9.29 6.72,-17.96 10.16,-27.19 2.87,-7.69 2.37,-8.82 22.02,-14.46 -2.38,8.34 -5.47,11.27 -3.96,20.99 7.93,16.4 39.9,-4.38 64.23,-12.91zm-379.02 85.2c35.28,10.64 36.19,-11.05 45.97,-17.83 7.25,-5.03 9.31,-1.52 11.62,-12.02 -21.27,-15.49 -30.11,18.51 -48.05,25.33l-9.54 4.51zm429.63 -112.46c-21.01,1.31 -30.29,6.89 -48.25,-6.56 -9.07,-6.79 -21.48,-24.49 -12.24,-42.28 13.29,-25.6 55.39,-0.29 35.48,24.48 -5.59,6.96 -12.29,7.38 -22.65,8.47 3.51,1.38 8.09,7.79 19.12,10.07 35.73,7.39 51.57,-17.69 40.48,-49.93 -17.94,-52.17 -94.47,-51.72 -108.58,3.94 -8.74,34.48 15.79,68.35 51.32,70.51 14.15,0.86 26.58,-3.56 37.57,-11.16 5.55,-3.84 3.68,-3.87 7.74,-7.54z"
              />
            </svg>
          </div>
        </div>
        <div className={styles.loadingText}>{LOADING_SCREEN_TEXTS.LOADING_TEXT}</div>
      </div>
    </div>
  );
}
