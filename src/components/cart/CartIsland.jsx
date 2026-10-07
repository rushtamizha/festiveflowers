'use client';

// "Dynamic Island" confirmation for add-to-cart.
// A black capsule drops in at the top, morphs open to show what was added, then folds back
// and leaves: the same rhythm as iOS live activities. It replaces an intrusive drawer pop.
// This file is loaded on demand, the first time something is added to the cart.

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { cartCount, dismissLastAdded, openCart, useCart, useUi } from '@/lib/store';
import { spring } from '@/lib/motion';
import { Price } from '@/components/ui/Rupees';
import { CheckIcon } from '@/components/ui/Icons';

export default function CartIsland() {
  const { lastAdded } = useUi();
  const cart = useCart();
  const [phase, setPhase] = useState('hidden'); // hidden → pill → open → pill → hidden
  const stamp = lastAdded?.at;

  useEffect(() => {
    if (!stamp) return;
    const timers = [
      setTimeout(() => setPhase('pill'), 0),
      setTimeout(() => setPhase('open'), 140),
      setTimeout(() => setPhase('pill'), 2600),
      setTimeout(() => {
        setPhase('hidden');
        dismissLastAdded();
      }, 2950),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stamp]);

  const open = phase === 'open';

  const view = () => {
    setPhase('hidden');
    dismissLastAdded();
    openCart();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[max(10px,env(safe-area-inset-top))] z-[80] flex justify-center px-4 lg:top-[84px] lg:justify-end lg:px-8"
    >
      <AnimatePresence>
        {phase !== 'hidden' && lastAdded && (
          <motion.div
            key="island"
            layout
            initial={{ opacity: 0, y: -24, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.7 }}
            transition={spring.island}
            style={{ borderRadius: open ? 28 : 999 }}
            className="pointer-events-auto flex items-center overflow-hidden bg-ink-900 text-white shadow-large"
          >
            <motion.div
              layout
              transition={spring.island}
              className={open ? 'flex items-center gap-3 p-2' : 'flex items-center gap-2 px-3 py-1.5'}
            >
              <motion.div layout="position" className="relative shrink-0">
                <Image
                  src={lastAdded.image}
                  alt=""
                  width={44}
                  height={44}
                  className={open ? 'size-11 rounded-[14px] object-cover' : 'size-6 rounded-full object-cover'}
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring.snappy, delay: 0.12 }}
                  className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-full bg-success-500 ring-2 ring-ink-900"
                >
                  <CheckIcon size={11} strokeWidth={3.5} />
                </motion.span>
              </motion.div>

              <AnimatePresence mode="popLayout" initial={false}>
                {open ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex min-w-0 items-center gap-4"
                  >
                    <div className="max-w-[180px] min-w-0 sm:max-w-[240px]">
                      <p className="text-[11px] font-semibold text-[#5fdc8f]">
                        Added{lastAdded.qty > 1 ? ` ×${lastAdded.qty}` : ''} · {cartCount(cart)} in cart
                      </p>
                      <p className="truncate text-[13px] font-semibold">{lastAdded.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={view}
                      className="press shrink-0 rounded-full bg-brand-600 px-3.5 py-2 text-xs font-bold hover:bg-ink-500"
                    >
                      View
                    </button>
                  </motion.div>
                ) : (
                  <motion.span
                    key="price"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pr-1 text-xs font-semibold tabular-nums"
                  >
                    <Price value={lastAdded.price * lastAdded.qty} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
