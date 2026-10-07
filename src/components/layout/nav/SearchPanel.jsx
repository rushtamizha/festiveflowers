'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Price } from '@/components/ui/Rupees';
import { ArrowRightIcon, StarIcon } from '@/components/ui/Icons';
import AddToCartButton from '@/components/product/AddToCartButton';

const POPULAR = ['Rose garland', 'Jasmine', 'Orchid', 'Bouquet', 'Poo jadai', 'Car decoration'];

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps every occurrence of the search words in <mark>, so matches are easy to spot. */
function Highlight({ text, tokens }) {
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'ig');
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <mark key={index} className="rounded-[3px] bg-brand-100 text-brand-800">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

const heading = 'text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase';

/** Results and suggestions for the navbar search field. */
export default function SearchPanel({ query, tokens, results, ready, active, setActive, recent, categories, onNavigate, onPick }) {
  if (query && results.length > 0) {
    return (
      <ul role="listbox" aria-label="Matching products" className="divide-y divide-ink-200 px-3 sm:px-5">
        {results.map((product, index) => (
          <li key={product.id} role="option" aria-selected={active === index}>
            {/* Row = link + sibling button. A <button> inside an <a> is invalid HTML. */}
            <div
              onMouseEnter={() => setActive(index)}
              className={cn('-mx-1 flex items-center gap-3.5 rounded-medium px-1.5 py-3 transition-colors sm:-mx-2 sm:px-2', active === index && 'bg-ink-50')}
            >
              <Link href={`/product/${product.slug}`} onClick={() => onNavigate(true)} className="flex min-w-0 flex-1 items-center gap-3.5">
                <span className="relative block size-14 shrink-0 overflow-hidden rounded-medium border border-ink-200 bg-ink-50">
                  <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    <Highlight text={product.name} tokens={tokens} />
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink-500">
                    {product.reviews > 0 && (
                      <>
                        <StarIcon size={12} className="shrink-0 text-star" />
                        {product.rating.toFixed(1)}
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <Highlight text={product.categoryName} tokens={tokens} />
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-ink tabular-nums">
                    <Price value={product.price} />
                    {product.mrp > product.price && (
                      <s className="ml-1.5 text-xs font-normal text-ink-500">
                        <Price value={product.mrp} />
                      </s>
                    )}
                  </span>
                </span>
              </Link>
              <AddToCartButton product={product} icon />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (query) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-sm font-semibold text-ink">{ready ? `No matches for “${query}”` : 'Searching…'}</p>
        {ready && (
          <Link href="/shop" onClick={() => onNavigate()} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            Browse the full catalogue <ArrowRightIcon size={15} />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-5">
      {recent.length > 0 && (
        <section>
          <h3 className={heading}>Recent</h3>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {recent.map((item) => (
              <button key={item} type="button" className="chip h-9" onClick={() => onPick(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className={heading}>Popular searches</h3>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {POPULAR.map((item) => (
            <button key={item} type="button" className="chip h-9" onClick={() => onPick(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className={heading}>Categories</h3>
        <div className="mt-2.5 grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-6 lg:grid-cols-11">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => onNavigate()}
              className="press group flex flex-col items-center gap-1.5 text-center"
            >
              <span className="relative block size-14 overflow-hidden rounded-medium border border-ink-200 bg-ink-50">
                <Image src={category.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-500 ease-fluid group-hover:scale-110" />
              </span>
              <span className="line-clamp-2 text-[11px] leading-tight font-semibold text-ink-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
