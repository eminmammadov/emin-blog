'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search query from URL on component mount
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Automatically search when input has at least 3 characters
    if (value.length >= 3 || value.length === 0) {
      // Only update URL if we're on blog pages
      if (pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')) {
        // Create new URL with search query
        const params = new URLSearchParams(searchParams);

        if (value.length >= 3) {
          params.set('q', value);
        } else {
          params.delete('q');
        }

        // Update URL with search query
        const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
        router.push(newUrl);
      }
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only update URL if we're on blog pages
    if (pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')) {
      // Create new URL with search query
      const params = new URLSearchParams(searchParams);

      if (searchQuery) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }

      // Update URL with search query
      const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
      router.push(newUrl);
    }
  };

  // Toggle search input visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 300);
    }
  };

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
            {/* Search Container */}
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearchSubmit}>
                <div className={`${styles.searchInputContainer} ${isSearchOpen ? styles.searchInputContainerOpen : ''}`}>
                  <input
                    id="search-input"
                    type="text"
                    className={styles.searchInput}
                    placeholder="Axtar"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Axtarış"
                  />
                </div>
              </form>

              <button
                type="button"
                className={styles.searchButton}
                onClick={toggleSearch}
                aria-label={isSearchOpen ? "Bağla" : "Axtarış"}
              >
{isSearchOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Bağla</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Axtarış</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
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
