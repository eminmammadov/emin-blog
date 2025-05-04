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
            Blockchain Developer, Web3 Engineer, AI & EEE.
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
