'use client';

import { useEffect, useRef, useState } from 'react';
import Rupees from './Rupees';
import { formatPrice } from '@/lib/format';

/**
 * Money that counts to its new value instead of snapping (easeOutQuint, matching the UI's
 * motion curve). Renders the final value on the server so there is no hydration flash.
 */
export default function AnimatedPrice({ value = 0, className = '', duration = 420 }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    // With reduced motion the count is skipped: one frame, straight to the new value.
    const length = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration;

    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const progress = length === 0 ? 1 : Math.min(1, (now - t0) / length);
      const eased = 1 - Math.pow(1 - progress, 5);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      <Rupees>{formatPrice(display)}</Rupees>
    </span>
  );
}
