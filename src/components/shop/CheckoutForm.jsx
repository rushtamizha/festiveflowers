'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { site, hasWhatsapp, whatsappLink } from '@/config/site';
import { cartTotals, placeOrder, useCart, useUser } from '@/lib/store';
import { orderWhatsAppText } from '@/lib/order';
import { Price } from '@/components/ui/Rupees';
import { CheckIcon, MailIcon, WhatsAppIcon } from '@/components/ui/Icons';
import CartTotals from '@/components/cart/CartTotals';
import { EmptyState, OrderSummary } from './CartView';

const fields = [
  { name: 'name', label: 'Full name', autoComplete: 'name', required: true, maxLength: 80 },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', required: true, pattern: '[0-9+ \\(\\)\\-]{8,16}', title: '8 to 16 digits; spaces, +, - and brackets are fine', inputMode: 'tel' },
  { name: 'email', label: 'Email (for your order confirmation)', type: 'email', autoComplete: 'email', required: true, maxLength: 120 },
  { name: 'eventDate', label: 'Function date', type: 'date', required: true },
  { name: 'address', label: 'Delivery address', autoComplete: 'street-address', required: true, wide: true, textarea: true, maxLength: 300 },
  { name: 'city', label: 'City', autoComplete: 'address-level2', required: true, maxLength: 80 },
  { name: 'pincode', label: 'PIN code', autoComplete: 'postal-code', required: true, pattern: '[0-9]{6}', inputMode: 'numeric' },
  { name: 'notes', label: 'Notes for the florist (optional)', wide: true, textarea: true, maxLength: 500 },
];

// Asks the server to email the order to the shop and the customer.
// Only ids and quantities are sent: the server prices the order itself from the catalogue.
async function sendOrderEmails(order) {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        id: order.id,
        customer: order.customer,
        items: order.items.map(({ id, qty }) => ({ id, qty })),
      }),
    });
    const result = await response.json();
    if (!response.ok) return 'failed';
    if (!result.emailed) return 'off';
    return result.emailed.customer ? 'sent' : 'shop-only';
  } catch {
    return 'failed';
  }
}

const emailStatus = {
  sending: 'Sending your confirmation email…',
  sent: (order) => `A confirmation has been emailed to ${order.customer.email}.`,
  'shop-only': 'We have your order. The confirmation email to you could not be delivered; please check the address.',
  failed: 'We could not send the confirmation email. Your order is saved here; please send it on WhatsApp or call us.',
  off: null,
};

export default function CheckoutForm() {
  const items = useCart();
  const user = useUser();
  const [order, setOrder] = useState(null);
  const [email, setEmail] = useState('sending');
  const totals = cartTotals(items);

  if (order) {
    const message = typeof emailStatus[email] === 'function' ? emailStatus[email](order) : emailStatus[email];
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card overflow-hidden">
          <div className="surface-dark px-6 py-9 text-center sm:px-10">
            <span className="animate-pop mx-auto grid size-16 place-items-center rounded-full bg-success-500 text-white ring-4 ring-white/15">
              <CheckIcon size={30} strokeWidth={2.4} />
            </span>
            <h2 className="mt-5 text-[26px] leading-tight text-white sm:text-[32px]">Thank you, {order.customer.name.split(' ')[0]}!</h2>
            <p className="mt-2 text-sm text-white/70">
              Order <strong className="font-bold text-white">{order.id}</strong> · <Price value={order.total} />
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {hasWhatsapp ? (
              <p className="text-sm leading-relaxed text-ink-600">
                WhatsApp has opened with your order written out. Press <strong className="text-ink">send</strong> there and we will confirm
                availability, delivery time and payment.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-ink-600">Your order has been saved. We will confirm availability, delivery time and payment with you.</p>
            )}

            {message && (
              <p className="mt-4 flex items-start gap-2.5 rounded-medium bg-ink-50 p-3 text-[13px] text-ink-700 ring-1 ring-ink-200">
                <MailIcon size={16} className="mt-0.5 shrink-0 text-brand-700" />
                {message}
              </p>
            )}

            <ul className="mt-5 divide-y divide-ink-200 border-y border-ink-200">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <span className="relative block aspect-[4/5] w-11 shrink-0 overflow-hidden rounded-small border border-ink-200 bg-ink-50">
                    <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-snug">
                    <span className="line-clamp-1 font-semibold text-ink">{item.name}</span>
                    <span className="text-xs text-ink-500">
                      {item.qty} × <Price value={item.price} />
                    </span>
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    <Price value={item.price * item.qty} />
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <CartTotals totals={order.totals} />
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {hasWhatsapp && (
                <a href={whatsappLink(orderWhatsAppText(order))} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <WhatsAppIcon size={18} />
                  Open WhatsApp again
                </a>
              )}
              {site.phone && (
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="btn btn-outline btn-lg">
                  Call {site.phone}
                </a>
              )}
            </div>

            <p className="mt-5 text-center text-xs text-ink-500">
              This order is saved in{' '}
              <Link href="/account" className="font-semibold text-brand-700 underline underline-offset-4">
                your account
              </Link>{' '}
              on this device.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title="Nothing to check out yet" text="Add a garland or bouquet to your cart first." />;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Hidden field real people never fill in; bots do.
    if (data.company) return;
    delete data.company;

    const placed = placeOrder(data);
    setEmail('sending');
    setOrder(placed);

    // Straight to WhatsApp with the order written out. This must happen inside the click
    // itself, or browsers block the new tab.
    if (hasWhatsapp) window.open(whatsappLink(orderWhatsAppText(placed)), '_blank', 'noopener,noreferrer');

    sendOrderEmails(placed).then(setEmail);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-10">
      {/* `key` re-fills the form once the saved profile has been read from this device. */}
      <form key={user ? 'saved' : 'new'} onSubmit={onSubmit} className="card p-5 sm:p-7">
        <h2 className="text-lg sm:text-xl">Delivery details</h2>
        <p className="mt-1 text-[13px] text-ink-500">Saved on this device to fill this form next time.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map(({ name, label, wide, textarea, ...rest }) => (
            <label key={name} className={wide ? 'sm:col-span-2' : ''}>
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
              {textarea ? (
                <textarea name={name} rows={3} className="field" defaultValue={name === 'notes' ? '' : user?.[name] || ''} {...rest} />
              ) : (
                <input name={name} className="field" defaultValue={name === 'eventDate' ? '' : user?.[name] || ''} {...rest} />
              )}
            </label>
          ))}
          <label className="hidden" aria-hidden="true">
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <button type="submit" disabled={!totals.meetsMinimum} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
          {hasWhatsapp && <WhatsAppIcon size={18} />}
          {hasWhatsapp ? 'Place order on WhatsApp' : 'Place order'} ·&nbsp;
          <Price value={totals.total} />
        </button>
        <p className="mt-3 text-xs text-ink-500">
          {hasWhatsapp
            ? 'WhatsApp opens with your full order written out, and a confirmation is emailed to you and to us.'
            : 'A confirmation is emailed to you and to us.'}{' '}
          No payment is taken online.
        </p>
      </form>

      <OrderSummary totals={totals}>
        <ul className="mt-5 space-y-3 border-t border-ink-200 pt-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="relative block aspect-[4/5] w-11 shrink-0 overflow-hidden rounded-small border border-ink-200 bg-ink-50">
                <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 text-[13px] leading-snug">
                <span className="line-clamp-2 font-medium text-ink">{item.name}</span>
                <span className="text-ink-500">Qty {item.qty}</span>
              </span>
              <span className="text-[13px] font-bold tabular-nums">
                <Price value={item.price * item.qty} />
              </span>
            </li>
          ))}
        </ul>
      </OrderSummary>
    </div>
  );
}
