import { cn } from '@/lib/cn';

const tones = {
  brand: 'bg-brand-600 text-white',
  neutral: 'bg-ink-50 text-ink-600',
  dark: 'bg-ink-900 text-white',
  success: 'bg-success-700 text-white',
  white: 'bg-white text-ink-900 shadow-small',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] leading-none font-bold tracking-[0.04em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The kit's "% OFF" chip, used on every product image. */
export function DiscountBadge({ percent, className }) {
  if (!percent) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] leading-none font-bold text-success-700 shadow-small',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-success-500" />
      {percent}% OFF
    </span>
  );
}
