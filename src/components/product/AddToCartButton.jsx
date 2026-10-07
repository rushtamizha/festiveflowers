'use client';

import { useEffect, useState } from 'react';
import { addToCart, useCart } from '@/lib/store';
import { BagIcon, CheckIcon, PlusIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';

// Adds to the cart. The confirmation is the Dynamic Island capsule (CartIsland), so nothing
// covers the page; the button itself flashes green with a tick.
export default function AddToCartButton({ product, qty = 1, icon = false, className, children }) {
  const cart = useCart();
  const inCart = cart.find((item) => item.id === product.id)?.qty ?? 0;
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, qty);
    setJustAdded(true);
  };

  if (icon) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Add ${product.name} to cart`}
        className={cn(
          'press relative grid size-9 shrink-0 place-items-center rounded-full text-white',
          justAdded ? 'bg-success-500' : 'bg-brand-600 hover:bg-brand-700',
          className,
        )}
      >
        <span key={justAdded ? 'added' : 'add'} className="animate-pop inline-flex">
          {justAdded ? <CheckIcon size={17} strokeWidth={2.4} /> : <PlusIcon size={17} strokeWidth={2.4} />}
        </span>
        {inCart > 0 && !justAdded && (
          <span
            key={inCart}
            className="animate-pop absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-ink-900 text-[10px] leading-none font-bold text-white ring-2 ring-white"
          >
            {inCart}
          </span>
        )}
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn('btn', justAdded ? 'bg-success-500 text-white' : 'btn-primary', className)}>
      <span key={justAdded ? 'added' : 'add'} className="animate-pop inline-flex">
        {justAdded ? <CheckIcon size={18} strokeWidth={2.4} /> : <BagIcon size={18} />}
      </span>
      {justAdded ? 'Added' : (children ?? 'Add to cart')}
    </button>
  );
}
