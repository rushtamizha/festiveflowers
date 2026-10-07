'use client';

// React Bits — CountUp (https://reactbits.dev/text-animations/count-up)
// Adapted: the final number is server-rendered (crawlers and no-JS visitors see the real
// value) and the spring count runs with Motion's `animate()` when it scrolls into view.

import { useEffect, useRef } from 'react';
import { loadMotion, prefersReducedMotion, whenScrolledIntoView } from '@/lib/lazy';

const format = (value, separator) => {
  const formatted = Intl.NumberFormat('en-US', { useGrouping: !!separator, maximumFractionDigits: 0 }).format(value);
  return separator ? formatted.replace(/,/g, separator) : formatted;
};

export default function CountUp({ to, from = 0, delay = 0, duration = 2, className = '', separator = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let active = true;
    let stop;

    loadMotion().then(({ animate }) => {
      if (!active) return;
      stop = whenScrolledIntoView(el, {
        rootMargin: '0px',
        arm: () => {
          el.textContent = format(from, separator);
        },
        enter: () => {
          animate(from, to, {
            type: 'spring',
            damping: 20 + 40 * (1 / duration),
            stiffness: 100 * (1 / duration),
            delay,
            onUpdate: (latest) => {
              el.textContent = format(Math.round(latest), separator);
            },
          });
        },
      });
    });

    return () => {
      active = false;
      stop?.();
      el.textContent = format(to, separator);
    };
  }, [to, from, delay, duration, separator]);

  return (
    <span className={className} ref={ref}>
      {format(to, separator)}
    </span>
  );
}
