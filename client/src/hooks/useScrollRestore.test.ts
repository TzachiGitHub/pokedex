import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollRestore } from './useScrollRestore';

const SCROLL_POSITION_KEY = 'pokedex-scroll-position';

describe('useScrollRestore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds beforeunload event listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    
    renderHook(() => useScrollRestore({ isLoading: false, hasData: true }));
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('removes beforeunload event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useScrollRestore({ isLoading: false, hasData: true }));
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('does not restore scroll when loading', () => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, '500');
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    renderHook(() => useScrollRestore({ isLoading: true, hasData: true }));
    
    expect(scrollToSpy).not.toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it('does not restore scroll when no data', () => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, '500');
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    renderHook(() => useScrollRestore({ isLoading: false, hasData: false }));
    
    expect(scrollToSpy).not.toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it('does not restore scroll when no saved position', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    renderHook(() => useScrollRestore({ isLoading: false, hasData: true }));
    vi.advanceTimersByTime(500);
    
    expect(scrollToSpy).not.toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it('restores scroll position when conditions are met', () => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, '500');
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    // Mock document height to be sufficient
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      configurable: true,
    });
    
    renderHook(() => useScrollRestore({ isLoading: false, hasData: true }));
    vi.advanceTimersByTime(100);
    
    expect(scrollToSpy).toHaveBeenCalledWith(0, 500);
    expect(sessionStorage.getItem(SCROLL_POSITION_KEY)).toBeNull();
    scrollToSpy.mockRestore();
  });

  it('only restores scroll once', () => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, '500');
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      configurable: true,
    });
    
    const { rerender } = renderHook(
      ({ isLoading, hasData }) => useScrollRestore({ isLoading, hasData }),
      { initialProps: { isLoading: false, hasData: true } }
    );
    
    vi.advanceTimersByTime(100);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with same props
    rerender({ isLoading: false, hasData: true });
    vi.advanceTimersByTime(100);
    
    // Should still only have been called once
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    scrollToSpy.mockRestore();
  });
});
