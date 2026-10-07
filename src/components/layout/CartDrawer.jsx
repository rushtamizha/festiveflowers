'use client';

// Cart sheet: a bottom sheet with a grab handle and drag-to-dismiss on phones, a side panel
// from `sm` up. Opaque white: no blur behind it. Loaded on demand, the first time it opens.

import { useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { cartTotals, closeCart, removeFromCart, setCartQty, useCart } from '@/lib/store';
import { spring } from '@/lib/motion';
import { useScrollLock } from '@/lib/useScrollLock';
import { BagIcon, CloseIcon, TrashIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Rupees';
import AnimatedPrice from '@/components/ui/AnimatedPrice';
import QuantityStepper from '@/components/product/QuantityStepper';
import CartTotals, { DeliveryProgress, MinimumNote } from '@/components/cart/CartTotals';

const phoneQuery = '(max-width: 639.98px)';
const subscribe = (callback) => {
  const media = window.matchMedia(phoneQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

export default function CartDrawer({ open }) {
  const items = useCart();
  const totals = cartTotals(items);
  const phone = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(phoneQuery).matches,
    () => false,
  );

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const hidden = phone ? { y: '100%' } : { x: '100%' };
  const shown = phone ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-ink-900/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
          />
          <motion.aside
            className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[22px] bg-white shadow-large sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-none"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={spring.smooth}
            drag={phone ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 110 || info.velocity.y > 650) closeCart();
            }}
          >
            <span aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-ink-200 sm:hidden" />
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5">
              <h2 className="text-lg">
                Your cart <span className="text-sm font-medium text-ink-500">({totals.count})</span>
              </h2>
              <button
                type="button"
                autoFocus
                aria-label="Close cart"
                className="press grid size-10 place-items-center rounded-full bg-ink-50 hover:bg-ink-100"
                onClick={closeCart}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                <span className="icon-badge size-14">
                  <BagIcon size={24} />
                </span>
                <p className="text-ink-500">Your cart is empty.</p>
                <Link href="/shop" className="btn btn-primary" onClick={closeCart}>
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul data-lenis-prevent className="flex-1 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, x: 40 }}
                        transition={spring.smooth}
                        className="overflow-hidden border-b border-ink-200 last:border-0"
                      >
                        <div className="flex gap-3.5 py-4">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="relative block aspect-[4/5] w-[72px] shrink-0 overflow-hidden rounded-medium bg-ink-50"
                          >
                            <Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link href={`/product/${item.slug}`} onClick={closeCart} className="line-clamp-2 text-sm leading-snug font-bold hover:text-brand-700">
                              {item.name}
                            </Link>
                            <p className="mt-0.5 text-[13px] text-ink-500">
                              <Price value={item.price} /> each
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <QuantityStepper value={item.qty} min={0} onChange={(qty) => setCartQty(item.id, qty)} small label={item.name} />
                              <AnimatedPrice value={item.price * item.qty} className="text-sm font-bold" />
                              <button
                                type="button"
                                aria-label={`Remove ${item.name}`}
                                className="press grid size-9 place-items-center rounded-full text-ink-500 hover:bg-ink-50 hover:text-brand-700"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <TrashIcon size={17} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-ink-200 bg-ink-50 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <MinimumNote totals={totals} className="mb-3" />
                  <DeliveryProgress totals={totals} className="mb-3" />
                  <CartTotals totals={totals} compact />
                  <div className="mt-4 grid gap-2">
                    <Link href="/checkout" className="btn btn-primary btn-lg" onClick={closeCart}>
                      Checkout
                    </Link>
                    <Link href="/cart" className="btn btn-outline btn-lg" onClick={closeCart}>
                      View full cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
