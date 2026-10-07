'use client';

import { useEffect } from 'react';
import { afterFirstPaint, prefersReducedMotion } from '@/lib/lazy';

// Lenis smooth scrolling. Loaded after the page has painted so it never delays it,
// and skipped entirely for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis;
    let active = true;

    afterFirstPaint()
      .then(() => import('lenis'))
      .then(({ default: Lenis }) => {
        if (!active) return;
        lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          lerp: 0.11,
          stopInertiaOnNavigate: true,
        });
        window.__lenis = lenis;
      });

    return () => {
      active = false;
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
