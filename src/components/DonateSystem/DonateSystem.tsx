'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiggyBank, ExternalLink } from 'lucide-react';
import styles from './DonateSystem.module.css';

// DonateSystem bileşeni için statik metinler
const DONATE_TEXTS = {
  BUTTON: {
    ARIA_LABEL: 'İanə Et'
  },
  DROPDOWN: {
    TITLE: 'İanə Et',
    DESCRIPTION: 'M10 vasitəsi ilə toplanan hər ianə bu TRC20 USDT adresinə transfer ediləcəkdir.',
    VIEW_ADDRESS: 'Ünvana baxın',
    QR_CODE: {
      SRC: '/images/m10.png',
      ALT: 'M10 QR Code'
    },
    TRON_ADDRESS: 'https://tronscan.org/#/address/TXLMZdz8TkxDwRGij8KPcvoJNdk4CVx26v'
  }
};

interface DonateSystemProps {
  className?: string;
}

export default function DonateSystem({ className }: DonateSystemProps) {
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Toggle donate dropdown
  const toggleDonate = () => {
    setIsDonateOpen(!isDonateOpen);
  };

  // Close donate dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const donateContainer = document.querySelector(`.${styles.donateContainer}`);

      if (donateContainer && !donateContainer.contains(target) && isDonateOpen) {
        setIsDonateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDonateOpen]);

  return (
    <div className={`${styles.donateContainer} ${className || ''}`}>
      <button
        type="button"
        className={`${styles.donateButton} ${isDonateOpen ? styles.donateButtonActive : ''}`}
        onClick={toggleDonate}
        aria-label={DONATE_TEXTS.BUTTON.ARIA_LABEL}
      >
        <PiggyBank size={18} />
      </button>

      {/* Donate Dropdown */}
      <div className={`${styles.donateDropdown} ${isDonateOpen ? styles.donateDropdownOpen : ''}`}>
        <div className={styles.donateHeader}>
          <h3 className={styles.donateTitle}>{DONATE_TEXTS.DROPDOWN.TITLE}</h3>
        </div>

        <div className={styles.donateContent}>
          <div className={styles.qrCodeContainer}>
            <a
              href="https://m10.onelink.me/WzYm?af_js_web=true&af_ss_ver=2_9_3&pid=landing_page&af_channel=Landing%20Page&af_reengagement_window=7d&is_retargeting=true&af_click_lookback=1d&af_ss_ui=true&af_ss_gtm_ui=true&af_sub4=https://www.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={DONATE_TEXTS.DROPDOWN.QR_CODE.SRC}
                alt={DONATE_TEXTS.DROPDOWN.QR_CODE.ALT}
                width={250}
                height={250}
                className={styles.qrCodeImage}
              />
            </a>
          </div>

          <p className={styles.donateDescription}>
            {DONATE_TEXTS.DROPDOWN.DESCRIPTION}
          </p>

          <a
            href={DONATE_TEXTS.DROPDOWN.TRON_ADDRESS}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.donateLink}
          >
            {DONATE_TEXTS.DROPDOWN.VIEW_ADDRESS} <ExternalLink size={14} className={styles.donateLinkIcon} />
          </a>
        </div>
      </div>
    </div>
  );
}