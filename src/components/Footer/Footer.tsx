import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

// Footer bileşeni için statik metinler
const FOOTER_TEXTS = {
  ABOUT: {
    TITLE: '/ HAQQINDA',
    CONTENT: 'Emin Mammadov müstəqil Blockchain, Web3 mühəndisi və Elektromaqnit elektronika proqram təminatı tərtibatçısıdır. Onun tədqiqat maraqlarına kosmologiyada verilənlər problemlərinə dair tədqiqatlar daxildir.\n\nO, hazırda Blockchain texnologiyasının problemlərinin həllinə diqqət yetirən Kriptaz Blockchain və elektrik dalğalarını məlumatlara çevirərək yeni nəsil Energyption texnologiyasını yaradan Xoflink üzərində işləyir.'
  },
  KRIPTAZ: {
    TITLE: '/ KRİPTAZ',
    SOCIAL_LINKS: [
      { name: 'YOUTUBE', url: 'https://www.youtube.com/@kriptazChain' },
      { name: 'X', url: 'https://twitter.com/kriptazChain' },
      { name: 'INSTAGRAM', url: 'https://www.instagram.com/kriptazChain' }
    ]
  }
};

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{FOOTER_TEXTS.ABOUT.TITLE}</h3>
          <p className={styles.footerText}>
            {FOOTER_TEXTS.ABOUT.CONTENT}
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>{FOOTER_TEXTS.KRIPTAZ.TITLE}</h3>
          <div className={styles.socialLinks}>
            {FOOTER_TEXTS.KRIPTAZ.SOCIAL_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                className={styles.socialLink}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
