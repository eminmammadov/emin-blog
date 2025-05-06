'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

// SearchBar komponenti üçün statik mətnlər
const SEARCH_BAR_TEXTS = {
  PLACEHOLDER: 'Axtar',
  ARIA_LABELS: {
    SEARCH: 'Axtarış',
    CLOSE: 'Bağla'
  },
  BUTTON_TITLES: {
    SEARCH: 'Axtarış',
    CLOSE: 'Bağla'
  }
};

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Komponent yüklənəndə URL-dən axtarış sorğusunu başlat
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  // Axtarış girişində dəyişiklikləri idarə et
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Girişdə ən azı 3 simvol olduqda avtomatik axtarış et
    if (value.length >= 3 || value.length === 0) {
      // Yalnız blog səhifələrində URL-i yenilə
      if (pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')) {
        // Axtarış sorğusu ilə yeni URL yarat
        const params = new URLSearchParams(searchParams);

        if (value.length >= 3) {
          params.set('q', value);
        } else {
          params.delete('q');
        }

        // Axtarış sorğusu ilə URL-i yenilə
        const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
        router.push(newUrl);
      }
    }
  };

  // Axtarış formunun göndərilməsini idarə et
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Yalnız blog səhifələrində URL-i yenilə
    if (pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')) {
      // Axtarış sorğusu ilə yeni URL yarat
      const params = new URLSearchParams(searchParams);

      if (searchQuery) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }

      // Axtarış sorğusu ilə URL-i yenilə
      const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '');
      router.push(newUrl);
    }
  };

  // Axtarış girişinin görünüşünü dəyiş
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Açıldıqda girişə fokuslan
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 300);
    }
  };

  return (
    <div className={`${styles.searchContainer} ${className || ''}`}>
      <form onSubmit={handleSearchSubmit}>
        <div className={`${styles.searchInputContainer} ${isSearchOpen ? styles.searchInputContainerOpen : ''}`}>
          <input
            id="search-input"
            type="text"
            className={styles.searchInput}
            placeholder={SEARCH_BAR_TEXTS.PLACEHOLDER}
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label={SEARCH_BAR_TEXTS.ARIA_LABELS.SEARCH}
          />
        </div>
      </form>

      <button
        type="button"
        className={`${styles.searchButton} ${isSearchOpen ? styles.active : ''}`}
        onClick={toggleSearch}
        aria-label={isSearchOpen ? SEARCH_BAR_TEXTS.ARIA_LABELS.CLOSE : SEARCH_BAR_TEXTS.ARIA_LABELS.SEARCH}
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
            <title>{SEARCH_BAR_TEXTS.BUTTON_TITLES.CLOSE}</title>
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
            <title>{SEARCH_BAR_TEXTS.BUTTON_TITLES.SEARCH}</title>
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
  );
}
