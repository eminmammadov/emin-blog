import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>/ HAQQINDA</h3>
          <p className={styles.footerText}>
            Emin Mammadov müstəqil Blockchain, Web3 mühəndisi və Elektromaqnit elektronika proqram təminatı tərtibatçısıdır. Onun tədqiqat maraqlarına kosmologiyada verilənlər problemlərinə dair tədqiqatlar daxildir.

            O, hazırda Blockchain texnologiyasının problemlərinin həllinə diqqət yetirən Kriptaz Blockchain və elektrik dalğalarını məlumatlara çevirərək yeni nəsil Energyption texnologiyasını yaradan Xoftlink üzərində işləyir.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>/ KRİPTAZ</h3>
          <div className={styles.socialLinks}>
            <Link href="https://www.youtube.com/@kriptazChain" target="_blank" className={styles.socialLink}>
              YOUTUBE
            </Link>
            <Link href="https://twitter.com/kriptazChain" target="_blank" className={styles.socialLink}>
              X
            </Link>
            <Link href="https://www.instagram.com/kriptazChain" target="_blank" className={styles.socialLink}>
              INSTAGRAM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
