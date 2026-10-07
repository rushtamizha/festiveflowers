'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cartCount, useCart, useWishlist } from '@/lib/store';
import { BagIcon, GridIcon, HeartIcon, HomeIcon, UserIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';

const tabs = [
  { href: '/', label: 'Home', icon: HomeIcon, match: (p) => p === '/' },
  { href: '/shop', label: 'Explore', icon: GridIcon, match: (p) => /^\/(shop|category|price|premium|best-sellers|product)/.test(p) },
  { href: '/wishlist', label: 'Favorites', icon: HeartIcon, match: (p) => p.startsWith('/wishlist'), badge: 'wishlist' },
  { href: '/cart', label: 'Cart', icon: BagIcon, match: (p) => /^\/(cart|checkout)/.test(p), badge: 'cart' },
  { href: '/account', label: 'Profile', icon: UserIcon, match: (p) => p.startsWith('/account') },
];

/** Phone tab bar from the kit. Solid white with a hairline: no blur, no glass. Hidden from lg up. */
export default function TabBar() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const counts = { cart: cartCount(cart), wishlist: wishlist.length };

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon, match, badge }) => {
          const active = match(pathname);
          const count = badge ? counts[badge] : 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'press relative flex h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-semibold',
                  active ? 'text-brand-700' : 'text-ink-500',
                )}
              >
                <span
                  className={cn(
                    'relative grid h-7 w-12 place-items-center rounded-full transition-[transform,background-color,box-shadow] duration-500 ease-spring',
                    active && 'bg-brand-50 ring-1 ring-brand-200',
                  )}
                >
                  <Icon size={20} />
                  {count > 0 && (
                    <span
                      key={count}
                      className="animate-pop absolute -top-1.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[9px] leading-none font-bold text-white"
                    >
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
