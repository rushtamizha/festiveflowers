'use client';

import { cn } from '@/lib/cn';
import Rupees from '@/components/ui/Rupees';
import { CheckIcon } from '@/components/ui/Icons';

const heading = 'text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase';

function Option({ selected, onClick, children, detail, round = false }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="press flex min-h-9 w-full items-center gap-2.5 rounded-small px-2 text-left text-[13px] font-medium text-ink-800 hover:bg-ink-50"
    >
      <span
        className={cn(
          'grid size-[18px] shrink-0 place-items-center border transition-colors',
          round ? 'rounded-full' : 'rounded-[5px]',
          selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300 bg-white',
        )}
      >
        {selected && <CheckIcon size={12} strokeWidth={3} />}
      </span>
      <span className="flex-1">{children}</span>
      {detail != null && <span className="text-xs text-ink-500 tabular-nums">{detail}</span>}
    </button>
  );
}

/** Category and budget filters: the sidebar on desktop, the body of the filter sheet on phones. */
export default function FilterPanel({ categories, priceRanges, counts, state, onChange }) {
  const picked = state.categories ?? [];
  const toggle = (slug) => onChange?.({ categories: picked.includes(slug) ? picked.filter((s) => s !== slug) : [...picked, slug] });

  return (
    <div className="space-y-6">
      <section>
        <p className={heading}>Category</p>
        <div className="mt-2 space-y-0.5">
          <Option selected={picked.length === 0} onClick={() => onChange?.({ categories: [] })}>
            All Category
          </Option>
          {categories.map((c) => (
            <Option key={c.slug} selected={picked.includes(c.slug)} onClick={() => toggle(c.slug)} detail={counts?.[c.slug]}>
              {c.name}
            </Option>
          ))}
        </div>
      </section>

      <section>
        <p className={heading}>Budget</p>
        <div className="mt-2 space-y-0.5">
          <Option round selected={!state.price} onClick={() => onChange?.({ price: '' })}>
            Any price
          </Option>
          {priceRanges.map((r) => (
            <Option key={r.slug} round selected={state.price === r.slug} onClick={() => onChange?.({ price: r.slug })}>
              <Rupees>{r.label}</Rupees>
            </Option>
          ))}
        </div>
      </section>
    </div>
  );
}
