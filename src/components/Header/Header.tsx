'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Define navigation items
  const navItems = [
    { key: 'B', label: 'BLOQ', href: '/blog', isExternal: false },
    { key: 'X', label: 'X', href: 'https://x.com/eminmammadov', isExternal: true },
    { key: 'L', label: 'LINKEDIN', href: 'https://www.linkedin.com/in/eminmammadov', isExternal: true },
    { key: 'G', label: 'GITHUB', href: 'https://github.com/eminmammadov', isExternal: true },
  ];

  // Function to render navigation items
  const renderNavItems = (isMobile = false) => {
    return navItems.map((item) => {
      // Determine if this item is active
      const isActive = !item.isExternal &&
        ((item.href === '/' && pathname === '/') ||
          (item.href !== '/' && pathname?.startsWith(item.href)));

      // Determine the className based on active state
      const linkClassName = `${styles.link} ${isActive ? styles.active : ''}`;

      if (item.isExternal) {
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          >
            <span className={styles.keyLabel}>[{item.key}]</span> {item.label}
          </a>
        );
      }

      return (
        <Link
          key={item.key}
          href={item.href}
          className={linkClassName}
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        >
          <span className={styles.keyLabel}>[{item.key}]</span> {item.label}
        </Link>
      );
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo */}
            <div className={styles.logoContainer} style={{ marginRight: '8px' }}>
              <Link href="/" className={styles.logoLink}>
                <Image
                  src="/emin-blog-logo.svg"
                  alt="Emin Blog Logo"
                  width={24}
                  height={24}
                  className={styles.logo}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={styles.nav} style={{ marginLeft: '0' }}>
              {renderNavItems()}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Menu</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContainer}>
            {renderNavItems(true)}
          </div>
        </div>
      )}
    </header>
  );
}
