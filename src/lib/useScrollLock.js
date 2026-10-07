'use client';

import { useEffect } from 'react';

// Stops the page behind a drawer or dialog from scrolling (and pauses Lenis).
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const el = document.documentElement;
    const previous = el.style.overflow;
    el.style.overflow = 'hidden';
    window.__lenis?.stop();
    return () => {
      el.style.overflow = previous;
      window.__lenis?.start();
    };
  }, [locked]);
}
