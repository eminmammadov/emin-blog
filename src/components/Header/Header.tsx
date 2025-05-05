'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import NotificationSystem from '@/components/NotificationSystem';
import SearchBar from '@/components/SearchBar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        mobileMenuButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Search Bar Component */}
            <SearchBar />

            {/* Notification System */}
            <NotificationSystem />

            {/* Mobile Menu Button */}
            <button
              type="button"
              ref={mobileMenuButtonRef}
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <div className={styles.mobileMenuContainer}>
            {renderNavItems(true)}
          </div>
        </div>
      )}
    </header>
  );
}
