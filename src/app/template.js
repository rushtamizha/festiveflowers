'use client';

import { useLayoutEffect, useRef } from 'react';
import { FLUID, getMotion, prefersReducedMotion } from '@/lib/lazy';

let firstLoad = true;

// A soft cross-fade whenever you move between pages. The first (server-rendered) load is
// left untouched so nothing delays the initial paint.
export default function Template({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    const kit = getMotion();
    if (!kit || prefersReducedMotion()) return;
    const controls = kit.animate(ref.current, { opacity: [0, 1] }, { duration: 0.5, ease: FLUID });
    return () => controls.stop();
  }, []);

  return <div ref={ref}>{children}</div>;
}
