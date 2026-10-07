'use client';

import { useState } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import Rupees from '@/components/ui/Rupees';
import { CloseIcon, FilterIcon } from '@/components/ui/Icons';
import { SORT_OPTIONS } from '@/components/layout/nav/FiltersPanel';
import { useScrollLock } from '@/lib/useScrollLock';
import { cn } from '@/lib/cn';
import FilterPanel from './FilterPanel';

// Catalogue layout: toolbar (count, filters, sort), active-filter chips, a filter sidebar on
// desktop and a bottom filter sheet on phones. `onChange(patch)` / `onClear()` are omitted in
// the static fallback that is prerendered into the HTML.
export default function ShopView({ products, categories, priceRanges, counts, state, onChange, onClear }) {
  const { q = '', categories: picked = [], price = '', sort = 'featured' } = state;
  const [sheetOpen, setSheetOpen] = useState(false);
  useScrollLock(sheetOpen);

  const chips = [
    ...picked.map((slug) => ({
      key: `cat-${slug}`,
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      clear: () => onChange?.({ categories: picked.filter((s) => s !== slug) }),
    })),
    price && {
      key: 'price',
      label: priceRanges.find((r) => r.slug === price)?.label ?? price,
      clear: () => onChange?.({ price: '' }),
    },
    q && { key: 'q', label: `“${q}”`, clear: () => onChange?.({ q: '' }) },
  ].filter(Boolean);
  const activeCount = picked.length + (price ? 1 : 0);
  const filterProps = { categories, priceRanges, counts, state: { categories: picked, price }, onChange };

  return (
    <div className="wrap grid gap-6 py-7 lg:grid-cols-[14rem_1fr] lg:gap-10 lg:py-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24">
          <FilterPanel {...filterProps} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-4">
          <p className="text-sm text-ink-500" aria-live="polite">
            <strong className="font-bold text-ink">{products.length}</strong> {products.length === 1 ? 'design' : 'designs'}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="press inline-flex h-10 items-center gap-2 rounded-medium border border-ink-200 px-3.5 text-sm font-medium text-ink-800 hover:bg-ink-50 lg:hidden"
            >
              <FilterIcon size={16} />
              Filters
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{activeCount}</span>
              )}
            </button>

            <label className="inline-flex items-center gap-2">
              <span className="hidden text-sm text-ink-500 sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(e) => onChange?.({ sort: e.target.value })}
                aria-label="Sort products"
                className="h-10 rounded-medium border border-ink-200 bg-white px-3 pr-8 text-sm font-medium text-ink-800 hover:border-ink-300 focus:border-ink-400 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="press inline-flex min-h-8 items-center gap-1.5 rounded-small border border-ink-200 bg-ink-50 px-2.5 text-xs font-medium text-ink-700 hover:border-ink-300 hover:text-ink"
              >
                <Rupees>{chip.label}</Rupees>
                <CloseIcon size={12} strokeWidth={2.2} />
              </button>
            ))}
            <button type="button" onClick={() => onClear?.()} className="min-h-8 px-1 text-xs font-semibold text-brand-700 underline-offset-4 hover:underline">
              Clear all
            </button>
          </div>
        )}

        {products.length > 0 ? (
          <ProductGrid products={products} eager={4} heading="h2" className="mt-5 lg:grid-cols-3 xl:grid-cols-4" />
        ) : (
          <div className="card mt-5 p-10 text-center">
            <p className="text-lg font-bold text-ink">No designs match those filters</p>
            <p className="mt-1 text-sm text-ink-500">Try a different category or budget, or clear the filters.</p>
            <button type="button" onClick={() => onClear?.()} className="btn btn-primary mt-5">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Phone filter sheet: slides up from the bottom, opaque white */}
      <div inert={!sheetOpen} aria-hidden={!sheetOpen} className={cn('fixed inset-0 z-[60] lg:hidden', !sheetOpen && 'pointer-events-none')}>
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setSheetOpen(false)}
          className={cn('absolute inset-0 bg-ink-900/45 transition-opacity duration-300', sheetOpen ? 'opacity-100' : 'opacity-0')}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={cn(
            'absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-[22px] bg-white shadow-large transition-transform duration-500 ease-fluid',
            sheetOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <button type="button" aria-label="Close filters" onClick={() => setSheetOpen(false)} className="flex shrink-0 justify-center pt-2.5 pb-1">
            <span className="h-1 w-10 rounded-full bg-ink-200" />
          </button>
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-ink-200 pr-2.5 pl-5">
            <h2 className="text-base">Filters</h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label="Close filters"
              className="press grid size-10 place-items-center rounded-medium text-ink-500 hover:bg-ink-100"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <FilterPanel {...filterProps} />
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-ink-200 bg-ink-50 p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => {
                onClear?.();
                setSheetOpen(false);
              }}
            >
              Clear all
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setSheetOpen(false)}>
              Show {products.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
