'use client';

import { useEffect, useRef } from 'react';
import { FLUID, loadMotion, prefersReducedMotion, whenScrolledIntoView } from '@/lib/lazy';

// Content rises, scales and fades into place as it scrolls into view (Motion).
// It is visible by default, so it shows even if JavaScript never runs.
export default function Reveal({ children, className = '', delay = 0, y = 36, as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let active = true;
    let stop;

    loadMotion().then(({ animate }) => {
      if (!active) return;
      stop = whenScrolledIntoView(el, {
        arm: () => {
          el.style.opacity = '0';
        },
        enter: () => {
          animate(el, { opacity: [0, 1], y: [y, 0], scale: [0.965, 1] }, { duration: 0.95, delay, ease: FLUID });
        },
      });
    });

    return () => {
      active = false;
      stop?.();
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
