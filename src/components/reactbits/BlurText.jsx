'use client';

// React Bits — BlurText (https://reactbits.dev/text-animations/blur-text)
// Adapted for speed and SEO: the words are server-rendered and visible by default, and the
// blur-in is played with Motion's `animate()` once the heading scrolls into view. Motion itself
// is loaded after first paint, so this component adds nothing to the initial JavaScript.

import { useEffect, useRef } from 'react';
import { loadMotion, prefersReducedMotion, whenScrolledIntoView } from '@/lib/lazy';

const BlurText = ({
  as: Tag = 'p',
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  stepDuration = 0.35,
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    let active = true;
    let stop;
    const from = direction === 'top' ? -30 : 30;

    loadMotion().then(({ animate }) => {
      if (!active) return;
      const spans = Array.from(root.children);
      stop = whenScrolledIntoView(root, {
        rootMargin: '0px 0px -10% 0px',
        arm: () => {
          for (const span of spans) span.style.opacity = '0';
        },
        enter: () => {
          spans.forEach((span, index) => {
            const controls = animate(
              span,
              {
                opacity: [0, 0.5, 1],
                filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                y: [from, direction === 'top' ? 4 : -4, 0],
              },
              { duration: stepDuration * 2, times: [0, 0.5, 1], delay: (index * delay) / 1000, ease: 'linear' },
            );
            if (index === spans.length - 1 && onAnimationComplete) controls.then(onAnimationComplete);
          });
        },
      });
    });

    return () => {
      active = false;
      stop?.();
    };
  }, [text, delay, direction, stepDuration, onAnimationComplete]);

  return (
    <Tag ref={ref} className={`blur-text flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <span className="inline-block" key={index}>
          {segment === ' ' ? ' ' : segment}
          {animateBy === 'words' && index < elements.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
};

export default BlurText;
