'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { loadMotion, prefersReducedMotion } from '@/lib/lazy';

// An image that drifts slightly slower than the page as it scrolls past (Motion scroll-linked animation).
export default function ParallaxImage({ src, alt, sizes, className = '' }) {
  const frame = useRef(null);
  const layer = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let active = true;
    let stop;

    loadMotion().then(({ animate, scroll }) => {
      if (!active) return;
      stop = scroll(animate(layer.current, { y: ['-9%', '9%'] }, { ease: 'linear' }), {
        target: frame.current,
        offset: ['start end', 'end start'],
      });
    });

    return () => {
      active = false;
      stop?.();
    };
  }, []);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div ref={layer} className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
