'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/store';
import { discountPercent } from '@/lib/format';
import AnimatedPrice from '@/components/ui/AnimatedPrice';
import QuantityStepper from './QuantityStepper';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';

export default function BuyBox({ product }) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const off = discountPercent(product.price, product.mrp);

  const buyNow = () => {
    addToCart(product, qty);
    router.push('/checkout');
  };

  return (
    <>
      <div className="card mt-6 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-ink">Quantity</p>
            <p className="text-xs text-ink-500">
              Total <AnimatedPrice value={product.price * qty} className="font-bold text-ink" />
            </p>
          </div>
          <QuantityStepper value={qty} onChange={setQty} label={product.name} />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-2.5">
          <AddToCartButton product={product} qty={qty} className="btn-lg" />
          <button type="button" onClick={buyNow} className="btn btn-dark btn-lg">
            Buy now
          </button>
          <WishlistButton product={product} className="size-13 border border-ink-200 shadow-none" />
        </div>
      </div>

      {/* Phone: the primary action stays reachable, sitting directly above the tab bar. Solid white, no blur. */}
      <div data-buybar className="fixed inset-x-0 bottom-[60px] z-30 border-t border-ink-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-lg leading-none font-bold text-ink">
              <AnimatedPrice value={product.price * qty} />
            </p>
            <p className="mt-1 truncate text-[11px] text-ink-500">
              Qty {qty}
              {off > 0 && ` · ${off}% off`}
            </p>
          </div>
          <AddToCartButton product={product} qty={qty} className="ml-auto h-12 flex-1 text-[15px]" />
        </div>
      </div>
    </>
  );
}
