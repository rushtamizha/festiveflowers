'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'details', label: 'Details' },
  { id: 'care', label: 'Care & delivery' },
];

// All three panels stay in the HTML (inactive ones are hidden), so search engines read everything.
export default function ProductTabs({ description, craft, care, flowers, specs, leadTime }) {
  const [active, setActive] = useState('description');

  return (
    <section className="wrap py-9 lg:py-12">
      <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-ink-200 [scrollbar-width:none]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative min-h-11 shrink-0 px-4 text-sm font-semibold transition-colors',
              'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-center after:bg-brand-600 after:transition-transform after:duration-500 after:ease-fluid',
              active === tab.id ? 'text-ink after:scale-x-100' : 'text-ink-500 after:scale-x-0 hover:text-ink-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        <div role="tabpanel" id="panel-description" aria-labelledby="tab-description" hidden={active !== 'description'} className="max-w-3xl">
          <h2 className="sr-only">Description</h2>
          <p className="text-[15px] leading-relaxed text-ink-600">{description}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{craft}</p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {flowers.map((flower) => (
              <li key={flower} className="flex items-start gap-2.5 text-sm text-ink-700">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-600" />
                {flower}
              </li>
            ))}
          </ul>
        </div>

        <div role="tabpanel" id="panel-details" aria-labelledby="tab-details" hidden={active !== 'details'} className="max-w-3xl">
          <h2 className="sr-only">Details</h2>
          <div className="overflow-hidden rounded-large border border-ink-200">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-ink-200">
                {Object.entries(specs).map(([key, value]) => (
                  <tr key={key} className="even:bg-ink-50">
                    <th scope="row" className="w-2/5 px-4 py-3 text-left font-medium text-ink-500">
                      {key}
                    </th>
                    <td className="px-4 py-3 font-medium text-ink">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div role="tabpanel" id="panel-care" aria-labelledby="tab-care" hidden={active !== 'care'} className="max-w-3xl">
          <h2 className="sr-only">Care and delivery</h2>
          <div className="rounded-large border border-brand-200 bg-brand-50 p-4 text-[13px] leading-relaxed text-brand-900">
            Fresh flowers are perishable. Please order {leadTime} ahead and plan delivery close to the function time.
          </div>
          <ol className="mt-5 space-y-3">
            {care
              .split('. ')
              .filter(Boolean)
              .map((line, index) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-100 text-[11px] font-bold text-ink-600">{index + 1}</span>
                  {line.endsWith('.') ? line : `${line}.`}
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
