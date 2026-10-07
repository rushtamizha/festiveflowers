'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cartTotals, clearCart, removeFromCart, setCartQty, useCart } from '@/lib/store';
import { Price } from '@/components/ui/Rupees';
import AnimatedPrice from '@/components/ui/AnimatedPrice';
import QuantityStepper from '@/components/product/QuantityStepper';
import CartTotals, { DeliveryProgress, MinimumNote } from '@/components/cart/CartTotals';
import { ArrowRightIcon, BagIcon, TrashIcon } from '@/components/ui/Icons';

export function EmptyState({ icon: Icon = BagIcon, title, text, href = '/shop', cta = 'Start shopping' }) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center gap-3 p-10 text-center sm:p-14">
      <span className="icon-badge size-16">
        <Icon size={26} />
      </span>
      <h2 className="mt-2 text-xl sm:text-2xl">{title}</h2>
      <p className="text-ink-500">{text}</p>
      <Link href={href} className="btn btn-primary mt-3">
        {cta}
      </Link>
    </div>
  );
}

/** The bill card shown beside the cart and the checkout form. */
export function OrderSummary({ totals, children }) {
  return (
    <aside className="card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg">Order summary</h2>
      <p className="text-xs text-ink-500">
        {totals.count} {totals.count === 1 ? 'item' : 'items'}
      </p>
      <MinimumNote totals={totals} className="mt-4" />
      <DeliveryProgress totals={totals} className="mt-3 bg-ink-50" />
      <div className="mt-4">
        <CartTotals totals={totals} />
      </div>
      {children}
    </aside>
  );
}

export default function CartView() {
  const items = useCart();
  const totals = cartTotals(items);

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" text="Add a garland or bouquet and it will show up here." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-10">
      <div>
        <ul className="card divide-y divide-ink-200 px-4 sm:px-6">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4 sm:gap-5">
              <Link href={`/product/${item.slug}`} className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-medium border border-ink-200 bg-ink-50 sm:w-24">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm leading-snug font-bold hover:text-brand-700 sm:text-base">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {item.categoryName} · <Price value={item.price} /> each
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="press grid size-9 shrink-0 place-items-center rounded-medium text-ink-500 hover:bg-ink-100 hover:text-brand-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <TrashIcon size={17} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <QuantityStepper value={item.qty} min={0} onChange={(qty) => setCartQty(item.id, qty)} small label={item.name} />
                  <AnimatedPrice value={item.price * item.qty} className="text-base font-bold" />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap justify-between gap-3">
          <Link href="/shop" className="btn btn-outline">
            Continue shopping
          </Link>
          <button type="button" className="btn text-ink-500 hover:text-brand-700" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </div>

      <OrderSummary totals={totals}>
        {totals.meetsMinimum ? (
          <Link href="/checkout" className="btn btn-primary btn-lg mt-5 w-full">
            Proceed to checkout
            <ArrowRightIcon size={16} />
          </Link>
        ) : (
          <Link href="/shop" className="btn btn-dark btn-lg mt-5 w-full">
            Add more items
          </Link>
        )}
        <p className="mt-3 text-center text-xs text-ink-500">No payment is taken online. Your order goes to us on WhatsApp and by email.</p>
      </OrderSummary>
    </div>
  );
}
