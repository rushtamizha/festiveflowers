'use client';

// Scroll-linked text: each word brightens as you scroll through the paragraph.
// Based on React Bits' ScrollReveal (https://reactbits.dev/text-animations/scroll-reveal),
// rebuilt on Motion's `scroll()` so it needs no GSAP and loads after first paint.

import { useEffect, useRef } from 'react';
import { loadMotion, prefersReducedMotion } from '@/lib/lazy';

export default function ScrollWords({ text, as: Tag = 'p', className = '', dim = 0.45 }) {
  const ref = useRef(null);
  const words = text.split(' ');

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    let active = true;
    let stop;

    loadMotion().then(({ scroll }) => {
      if (!active) return;
      const spans = Array.from(root.children);
      stop = scroll(
        (progress) => {
          const head = progress * (spans.length + 4);
          for (let i = 0; i < spans.length; i++) {
            const lit = Math.min(1, Math.max(0, (head - i) / 4));
            spans[i].style.opacity = String(dim + (1 - dim) * lit);
          }
        },
        { target: root, offset: ['start 0.9', 'end 0.45'] },
      );
    });

    return () => {
      active = false;
      stop?.();
      for (const span of root.children) span.style.opacity = '';
    };
  }, [text, dim]);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="transition-opacity duration-200 ease-out">
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
