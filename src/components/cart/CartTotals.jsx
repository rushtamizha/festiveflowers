'use client';

import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Price } from '@/components/ui/Rupees';
import AnimatedPrice from '@/components/ui/AnimatedPrice';
import { TruckIcon } from '@/components/ui/Icons';

/** Shown while the cart is below the minimum order value. */
export function MinimumNote({ totals, className }) {
  if (totals.meetsMinimum) return null;
  return (
    <p className={cn('rounded-medium bg-brand-50 px-3 py-2 text-xs text-brand-800 ring-1 ring-brand-200 ring-inset', className)}>
      Add <Price value={totals.shortfall} /> more to reach the <Price value={site.order.minimumValue} /> minimum order.
    </p>
  );
}

/** Free-delivery progress: the small app-style nudge above the totals. */
export function DeliveryProgress({ totals, className }) {
  const target = site.order.freeDeliveryAbove;
  if (!target) return null;
  const percent = Math.min(100, Math.round((totals.subtotal / target) * 100));

  return (
    <div className={cn('rounded-medium bg-white p-3 ring-1 ring-ink-200', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <TruckIcon size={15} className={totals.freeDelivery ? 'text-success-500' : 'text-brand-600'} />
        {totals.freeDelivery ? (
          <span className="text-success-700">Free delivery unlocked</span>
        ) : (
          <span>
            <Price value={totals.freeDeliveryShortfall} /> more for free delivery
          </span>
        )}
        <span className="ml-auto text-[11px] font-medium text-ink-500 tabular-nums">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200"
      >
        <div
          className={cn('h-full rounded-full transition-[width,background-color] duration-700 ease-fluid', totals.freeDelivery ? 'bg-success-500' : 'bg-brand-600')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** The bill: MRP, discount, item total, GST (when charged), delivery and the amount to pay. */
export default function CartTotals({ totals, compact = false }) {
  const rows = [
    totals.savings > 0 && { label: 'Total MRP', value: totals.mrpTotal, tone: 'strike' },
    totals.savings > 0 && { label: 'Discount', value: totals.savings, tone: 'saving' },
    { label: 'Item total', value: totals.subtotal },
    totals.gstPercent > 0 && { label: `GST (${totals.gstPercent}%)`, value: totals.gst, tone: 'muted' },
    { label: 'Delivery', value: totals.delivery, free: totals.delivery === 0 && totals.subtotal > 0 },
  ].filter(Boolean);

  return (
    <dl className={cn('space-y-2', compact ? 'text-[13px]' : 'text-sm')}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4">
          <dt className="text-ink-500">{row.label}</dt>
          <dd
            className={cn(
              'font-semibold tabular-nums',
              row.tone === 'saving' && 'text-success-700',
              row.tone === 'muted' && 'text-ink-500',
              row.tone === 'strike' && 'font-normal text-ink-500 line-through',
              !row.tone && 'text-ink-800',
            )}
          >
            {row.free ? (
              <span className="text-success-700">FREE</span>
            ) : (
              <>
                {row.tone === 'saving' && '− '}
                <Price value={row.value} />
              </>
            )}
          </dd>
        </div>
      ))}

      <div className="flex items-baseline justify-between gap-4 border-t border-ink-200 pt-2.5">
        <dt className="text-[15px] font-bold text-ink">To pay</dt>
        <dd>
          <AnimatedPrice value={totals.total} className={cn('font-bold text-ink', compact ? 'text-lg' : 'text-xl')} />
        </dd>
      </div>
    </dl>
  );
}
