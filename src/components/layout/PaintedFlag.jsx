'use client';

import { useLayoutEffect } from 'react';

// Safety net for the inline "painted" script in layout.js. By the time React hydrates the page
// has painted, so the flag can always be set. Without this, below-the-fold sections would stay
// hidden whenever the script's flag is lost: in development React's Strict Mode remount resets
// the attributes on <html>, and a page rebuilt by an error boundary never runs inline scripts.
export default function PaintedFlag() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-painted', '');
  }, []);

  return null;
}
