'use client';

/**
 * The navbar and everything that drops out of it.
 *
 * Search, filters and the phone menu are all views of one white sheet anchored to the bottom
 * of the bar (NavSheet): the cart sheet's material, unfolding downward. Nothing is layered
 * over the page: no scrim, no blur, no separate overlay.
 *
 * Search lives inside the bar on every screen size. Tapping the search icon makes the field
 * unfold from the icon towards the logo (the nav links and the other icons give up their
 * space); closing folds it back and the bar returns to normal. While typing, the sheet lists
 * matching products with the matched text highlighted and a quick-add button on each row.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cartCount, openCart, rememberSearch, useCart, useRecentSearches, useWishlist } from '@/lib/store';
import { searchProducts } from '@/data/search-index';
import { useScrollLock } from '@/lib/useScrollLock';
import { useBelowDesktop } from '@/lib/useMedia';
import { cn } from '@/lib/cn';
import { BagIcon, CloseIcon, FilterIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from '@/components/ui/Icons';
import NavSheet from './nav/NavSheet';
import SearchPanel from './nav/SearchPanel';
import FiltersPanel from './nav/FiltersPanel';
import MenuPanel from './nav/MenuPanel';

// The bar's icons live together in one ringed pill (a small toolbar) rather than as separate
// discs; each lights up white on hover.
const iconGroup = 'flex items-center gap-0.5 rounded-full bg-ink-50 p-1 ring-1 ring-ink-200';
const iconButton =
  'press relative grid size-9 shrink-0 place-items-center rounded-full text-ink-800 hover:bg-white hover:text-brand-700 hover:shadow-small';
const EMPTY_FILTERS = { picked: [], price: '', sort: 'featured' };
const MAX_RESULTS = 8;

function CountBadge({ count, tone = 'brand' }) {
  if (!count) return null;
  return (
    <span
      key={count}
      className={cn(
        'animate-pop absolute -top-1 -right-1 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2 ring-white',
        tone === 'brand' ? 'bg-brand-600' : 'bg-ink-900',
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function HeaderShell({ logo, nav, categories, priceRanges, contact }) {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const recent = useRecentSearches();
  const belowDesktop = useBelowDesktop();

  const headerRef = useRef(null);
  const inputRef = useRef(null);
  const fieldTimer = useRef(null);

  const [panel, setPanel] = useState(null); // 'search' | 'filters' | 'menu' | null
  // The view that is rendered. Follows `panel` when opening, but holds the last view during
  // the collapse so the content does not vanish mid-animation.
  const [shown, setShown] = useState(null);
  const [field, setField] = useState('closed'); // closed → open → closing → closed
  const [term, setTerm] = useState('');
  const [active, setActive] = useState(-1);
  const [index, setIndex] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const show = (view) => {
    setPanel(view);
    if (view) setShown(view);
  };

  const openSearch = () => {
    clearTimeout(fieldTimer.current);
    setField('open');
    show('search');
    // The product index is downloaded only when search is first used.
    if (!index) import('@/data/search-index').then((mod) => setIndex(mod.searchIndex));
  };

  const reset = () => {
    clearTimeout(fieldTimer.current);
    setPanel(null);
    setField('closed');
    setTerm('');
    setActive(-1);
  };

  const close = useCallback(() => {
    setPanel(null);
    setField((state) => {
      if (state !== 'open') return state;
      clearTimeout(fieldTimer.current);
      fieldTimer.current = setTimeout(() => {
        setField('closed');
        setTerm('');
        setActive(-1);
      }, 200);
      return 'closing';
    });
  }, []);

  /* ── lifecycle ─────────────────────────────────────────────────────────── */

  // Navigating anywhere returns the bar to its normal state.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (panel || field !== 'closed') {
      setPanel(null);
      setField('closed');
      setTerm('');
      setActive(-1);
    }
  }

  useEffect(() => {
    if (field === 'open') inputRef.current?.focus();
  }, [field]);

  // Close when interacting anywhere outside the navbar: no overlay needed.
  useEffect(() => {
    if (!panel) return;
    const onPointer = (e) => {
      if (!headerRef.current?.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [panel, close]);

  // Keyboard: ⌘K / Ctrl+K or "/" jumps into the navbar search; Esc closes.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && (panel || field === 'open')) {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Phones and tablets: the sheet is the focus, so the page underneath stops scrolling.
  useScrollLock(Boolean(panel) && belowDesktop);

  /* ── search ────────────────────────────────────────────────────────────── */

  const query = term.trim();
  const { tokens, matches } = useMemo(() => searchProducts(index ?? [], query), [index, query]);
  const results = matches.slice(0, MAX_RESULTS);
  const allResultsHref = `/shop?q=${encodeURIComponent(query)}`;

  const go = (href) => {
    rememberSearch(query);
    reset();
    router.push(href);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    go(active >= 0 && results[active] ? `/product/${results[active].slug}` : allResultsHref);
  };

  const onSearchKeys = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  /* ── filters ───────────────────────────────────────────────────────────── */

  const filterCount = filters.picked.length + (filters.price ? 1 : 0);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.picked.length) params.set('category', filters.picked.join(','));
    if (filters.price) params.set('price', filters.price);
    if (filters.sort !== 'featured') params.set('sort', filters.sort);
    const search = params.toString();
    reset();
    router.push(search ? `/shop?${search}` : '/shop');
  };

  /* ── sheet content per view ────────────────────────────────────────────── */

  const view = panel ?? shown;
  const sheet = {
    search: {
      title: query ? `Results for “${query}”` : 'Search',
      subtitle: query ? `${matches.length} ${matches.length === 1 ? 'product' : 'products'}` : 'Suggestions',
      body: (
        <SearchPanel
          query={query}
          tokens={tokens}
          results={results}
          ready={Boolean(index)}
          active={active}
          setActive={setActive}
          recent={recent}
          categories={categories}
          onNavigate={(remember) => {
            if (remember) rememberSearch(query);
            reset();
          }}
          onPick={(item) => {
            setTerm(item);
            setActive(-1);
            inputRef.current?.focus();
          }}
        />
      ),
      footer:
        query && matches.length > 0 ? (
          <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => go(allResultsHref)}>
            View all {matches.length} results
          </button>
        ) : null,
    },
    filters: {
      title: 'Filters',
      subtitle: filterCount ? `${filterCount} selected` : 'Narrow the catalogue',
      body: <FiltersPanel categories={categories} priceRanges={priceRanges} value={filters} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />,
      footer: (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-outline btn-lg" onClick={() => setFilters(EMPTY_FILTERS)}>
            Reset
          </button>
          <button type="button" className="btn btn-primary btn-lg" onClick={applyFilters}>
            Show products
          </button>
        </div>
      ),
    },
    menu: {
      title: 'Menu',
      subtitle: 'Browse the collections',
      body: <MenuPanel categories={categories} contact={contact} onNavigate={reset} />,
    },
  }[view];

  const items = cartCount(cart);
  const searching = field !== 'closed';

  return (
    <header ref={headerRef} data-searching={searching} className="group/header sticky top-0 z-40">
      <div className="relative z-20 border-b border-ink-200 bg-white">
        <div className="wrap flex h-16 items-center gap-2 lg:gap-4">
          {logo}

          {searching ? (
            /* ── Search mode: the bar itself becomes the search field ── */
            <form onSubmit={submitSearch} role="search" className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:pl-3">
              <div className={cn('relative ml-auto w-full', field === 'closing' ? 'animate-search-shrink' : 'animate-search-grow')}>
                <SearchIcon size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" />
                <input
                  ref={inputRef}
                  type="search"
                  name="q"
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setActive(-1);
                    show('search');
                  }}
                  onFocus={() => panel !== 'filters' && show('search')}
                  onKeyDown={onSearchKeys}
                  placeholder="Search products"
                  aria-label="Search products"
                  autoComplete="off"
                  enterKeyHint="search"
                  className="h-10 w-full rounded-full border border-brand-500 bg-white pr-[76px] pl-10 text-[15px] text-ink placeholder:text-ink-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                <span className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
                  {term && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      className="press grid size-6 place-items-center rounded-full bg-ink-200 text-ink-600"
                      onClick={() => {
                        setTerm('');
                        setActive(-1);
                        inputRef.current?.focus();
                      }}
                    >
                      <CloseIcon size={12} strokeWidth={2.4} />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Filters"
                    aria-pressed={panel === 'filters'}
                    onClick={() => show(panel === 'filters' ? 'search' : 'filters')}
                    className={cn(
                      'press relative grid size-8 place-items-center rounded-full text-white',
                      panel === 'filters' ? 'bg-ink-900' : 'bg-brand-600 hover:bg-brand-700',
                    )}
                  >
                    <FilterIcon size={15} strokeWidth={2.2} />
                    <CountBadge count={filterCount} tone="dark" />
                  </button>
                </span>
              </div>
              <button type="button" onClick={close} className="press shrink-0 px-1.5 text-[15px] font-semibold text-brand-700">
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="hidden min-w-0 flex-1 lg:block">{nav}</div>
              <div className={cn(iconGroup, 'ml-auto lg:ml-0')}>
                <button type="button" className={iconButton} aria-label="Search products" aria-keyshortcuts="/" onClick={openSearch}>
                  <SearchIcon size={20} />
                </button>
                <Link href="/account" className={cn(iconButton, 'hidden lg:grid')} aria-label="Your account">
                  <UserIcon size={20} />
                </Link>
                <Link href="/wishlist" className={cn(iconButton, 'hidden lg:grid')} aria-label={`Favourites, ${wishlist.length} saved`}>
                  <HeartIcon size={20} />
                  <CountBadge count={wishlist.length} tone="dark" />
                </Link>
                <button type="button" className={iconButton} aria-label={`Open cart, ${items} items`} onClick={openCart}>
                  <BagIcon size={20} />
                  <CountBadge count={items} />
                </button>
                <button
                  type="button"
                  onClick={() => show(panel === 'menu' ? null : 'menu')}
                  aria-label={panel === 'menu' ? 'Close menu' : 'Open menu'}
                  aria-expanded={panel === 'menu'}
                  className={cn(iconButton, 'lg:hidden', panel === 'menu' && 'bg-white text-brand-700 shadow-small')}
                >
                  {panel === 'menu' ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── The sheet: one surface, content swaps per view ── */}
      <div className="pointer-events-none absolute inset-x-0 top-full z-10">
        <div className="mx-auto max-w-[1240px] lg:px-6">
          <NavSheet
            open={Boolean(panel)}
            title={sheet?.title}
            subtitle={sheet?.subtitle}
            onClose={close}
            onClosed={() => setShown(null)}
            footer={sheet?.footer}
          >
            {sheet ? (
              <div key={view} className="animate-sheet-in">
                {sheet.body}
              </div>
            ) : null}
          </NavSheet>
        </div>
      </div>
    </header>
  );
}
