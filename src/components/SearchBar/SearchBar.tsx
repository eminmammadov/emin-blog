'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

// SearchBar bileşeni için statik metinler
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
