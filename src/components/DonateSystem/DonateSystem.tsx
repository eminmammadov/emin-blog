'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiggyBank, ExternalLink } from 'lucide-react';
import styles from './DonateSystem.module.css';

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
        aria-label="İanə Et"
      >
        <PiggyBank size={18} />
      </button>

      {/* Donate Dropdown */}
      <div className={`${styles.donateDropdown} ${isDonateOpen ? styles.donateDropdownOpen : ''}`}>
        <div className={styles.donateHeader}>
          <h3 className={styles.donateTitle}>İanə Et</h3>
        </div>

        <div className={styles.donateContent}>
          <div className={styles.qrCodeContainer}>
            <Image
              src="/images/m10.png"
              alt="M10 QR Code"
              width={250}
              height={250}
              className={styles.qrCodeImage}
            />
          </div>

          <p className={styles.donateDescription}>
            M10 vasitəsi ilə toplanan hər ianə bu TRC20 USDT adresinə transfer ediləcəkdir.
          </p>

          <a
            href="https://tronscan.org/#/address/TXLMZdz8TkxDwRGij8KPcvoJNdk4CVx26v"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.donateLink}
          >
            Ünvana baxın <ExternalLink size={14} className={styles.donateLinkIcon} />
          </a>
        </div>
      </div>
    </div>
  );
}
