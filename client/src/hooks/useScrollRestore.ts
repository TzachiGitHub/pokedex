import { useEffect, useRef } from 'react';

const SCROLL_POSITION_KEY = 'pokedex-scroll-position';

interface UseScrollRestoreOptions {
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether there is data to display */
  hasData: boolean;
}

/**
 * Hook to save and restore scroll position across page refreshes.
 * Saves position to sessionStorage on beforeunload, restores after data loads.
 */
export function useScrollRestore({ isLoading, hasData }: UseScrollRestoreOptions) {
  const hasRestoredScroll = useRef(false);

  // Save scroll position before page unload
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => window.removeEventListener('beforeunload', saveScrollPosition);
  }, []);

  // Restore scroll position after data loads
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);

    if (!savedPosition || isLoading || !hasData || hasRestoredScroll.current) {
      return;
    }

    const scrollY = parseInt(savedPosition, 10);

    // Poll until document height is sufficient for the scroll position
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max
    const intervalId = setInterval(() => {
      attempts++;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight >= scrollY || attempts >= maxAttempts) {
        clearInterval(intervalId);
        window.scrollTo(0, scrollY);
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
        hasRestoredScroll.current = true;
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isLoading, hasData]);
}
