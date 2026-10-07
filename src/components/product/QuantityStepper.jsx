'use client';

import { MinusIcon, PlusIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';

export default function QuantityStepper({ value, onChange, min = 1, max = 99, small = false, label = 'item', className }) {
  const cell = small ? 'w-9' : 'w-11';
  const button = cn(
    'press grid h-full place-items-center text-ink-600 hover:bg-ink-50 hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent',
    cell,
  );
  return (
    <div className={cn('inline-flex items-center overflow-hidden rounded-xl border border-ink-200 bg-white', small ? 'h-9' : 'h-11', className)}>
      <button
        type="button"
        className={button}
        aria-label={`Decrease quantity of ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon size={16} strokeWidth={2} />
      </button>
      <span
        aria-live="polite"
        className={cn('grid h-full place-items-center border-x border-ink-200 text-sm font-semibold tabular-nums', small ? 'w-9' : 'w-12')}
      >
        {value}
      </span>
      <button
        type="button"
        className={button}
        aria-label={`Increase quantity of ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
