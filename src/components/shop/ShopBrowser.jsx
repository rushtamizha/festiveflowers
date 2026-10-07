'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ShopView from './ShopView';

// Reads filters from the URL (?q=&category=a,b&price=&sort=) and filters in the browser,
// so the shop page itself stays a static, cacheable page and every filtered view is shareable.
export default function ShopBrowser({ products, categories, priceRanges, counts }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get('q')?.trim() || '';
  const categoryParam = params.get('category') || '';
  const price = params.get('price') || '';
  const sort = params.get('sort') || 'featured';
  const picked = useMemo(() => categoryParam.split(',').filter(Boolean), [categoryParam]);

  const navigate = (next) => {
    const search = new URLSearchParams();
    if (next.q) search.set('q', next.q);
    if (next.categories.length) search.set('category', next.categories.join(','));
    if (next.price) search.set('price', next.price);
    if (next.sort && next.sort !== 'featured') search.set('sort', next.sort);
    const query = search.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const state = { q, categories: picked, price, sort };

  const visible = useMemo(() => {
    const range = priceRanges.find((r) => r.slug === price);
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);

    const list = products.filter((p) => {
      if (picked.length && !picked.includes(p.categorySlug)) return false;
      if (range && (p.price < range.min || (range.max !== null && p.price > range.max))) return false;
      if (tokens.length && !tokens.every((t) => p.keywords.includes(t))) return false;
      return true;
    });

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

    return list;
  }, [products, priceRanges, q, picked, price, sort]);

  return (
    <ShopView
      products={visible}
      categories={categories}
      priceRanges={priceRanges}
      counts={counts}
      state={state}
      onChange={(patch) => navigate({ ...state, ...patch })}
      onClear={() => navigate({ q: '', categories: [], price: '', sort })}
    />
  );
}
