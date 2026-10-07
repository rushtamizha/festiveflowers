'use client';

import { useSyncExternalStore } from 'react';

// True when the media query matches. Always false on the server and during hydration.
export function useMedia(query) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const usePhone = () => useMedia('(max-width: 639.98px)');
export const useBelowDesktop = () => useMedia('(max-width: 1023.98px)');
