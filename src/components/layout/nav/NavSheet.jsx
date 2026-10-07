'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { CloseIcon } from '@/components/ui/Icons';

/**
 * The one dropdown surface in the navbar: the cart sheet's material (white, 22px corners,
 * title row + close, grabber, grey footer) unfolding downward from the bar.
 *
 * It is controlled rather than mounted/unmounted: it animates between open and closed, is
 * `inert` and click-through while closed, and tells the parent once the collapse has
 * finished so the content can be released. Opaque white: no scrim, no blur.
 */
export default function NavSheet({ open, title, subtitle, onClose, onClosed, children, footer }) {
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!open) timer.current = setTimeout(() => onClosed?.(), 420);
    return () => clearTimeout(timer.current);
  }, [open, onClosed]);

  return (
    <div
      inert={!open}
      aria-hidden={!open}
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-[450ms] ease-fluid',
        open ? 'pointer-events-auto grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="overflow-hidden">
        {children && (
          <div className="m-2 flex max-h-[calc(100dvh-64px-40px-76px)] flex-col overflow-hidden rounded-[22px] border border-ink-200 bg-white shadow-large lg:max-h-[calc(100dvh-64px-40px-24px)]">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 pr-2.5 pl-5">
              <div className="min-w-0">
                <h2 className="truncate text-base leading-tight">{title}</h2>
                {subtitle && <p className="truncate text-xs text-ink-500">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="press grid size-10 shrink-0 place-items-center rounded-medium text-ink-500 hover:bg-ink-100 hover:text-ink"
              >
                <CloseIcon size={20} />
              </button>
            </header>

            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>

            {footer && <footer className="shrink-0 border-t border-ink-200 bg-ink-50 p-3.5">{footer}</footer>}

            {/* Grabber: mirrors the cart sheet */}
            <button type="button" onClick={onClose} aria-label="Collapse" className="flex shrink-0 justify-center py-2 lg:hidden">
              <span className="h-1 w-10 rounded-full bg-ink-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
