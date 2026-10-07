'use client';

import { cn } from '@/lib/cn';
import Rupees from '@/components/ui/Rupees';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

const chip = 'press rounded-full border px-3.5 py-2 text-[13px] font-semibold';
const on = 'border-ink-900 bg-ink-900 text-white';
const off = 'border-ink-200 bg-white text-ink-600 hover:border-ink-300';

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-2.5 text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Filter chips shown inside the navbar sheet. State is owned by the header. */
export default function FiltersPanel({ categories, priceRanges, value, onChange }) {
  const { picked, price, sort } = value;

  return (
    <div className="space-y-5 p-5">
      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = picked.includes(category.slug);
            return (
              <button
                key={category.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ picked: selected ? picked.filter((slug) => slug !== category.slug) : [...picked, category.slug] })}
                className={cn(chip, selected ? 'border-brand-600 bg-brand-600 text-white' : off)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Budget">
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.slug}
              type="button"
              aria-pressed={price === range.slug}
              onClick={() => onChange({ price: price === range.slug ? '' : range.slug })}
              className={cn(chip, price === range.slug ? on : off)}
            >
              <Rupees>{range.label}</Rupees>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Sort by">
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={sort === option.value}
              onClick={() => onChange({ sort: option.value })}
              className={cn(chip, sort === option.value ? on : off)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
