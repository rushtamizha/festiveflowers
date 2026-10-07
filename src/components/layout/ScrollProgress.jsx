'use client';

import { useEffect, useRef } from 'react';
import { loadMotion } from '@/lib/lazy';

// Thin reading-progress bar pinned to the top of the viewport (Motion scroll-linked animation).
export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    let active = true;
    let stop;

    loadMotion().then(({ animate, scroll }) => {
      if (!active) return;
      stop = scroll(animate(bar.current, { scaleX: [0, 1] }, { ease: 'linear' }));
    });

    return () => {
      active = false;
      stop?.();
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-brand-600"
    />
  );
}
