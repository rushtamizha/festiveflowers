'use client';

import { ArrowRightIcon } from '@/components/ui/Icons';

export default function BackToTop() {
  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="press inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 hover:border-white/30 hover:text-white"
    >
      Back to top
      <ArrowRightIcon size={14} className="-rotate-90" />
    </button>
  );
}
