'use client';

import Link from 'next/link';
import { showToast, useOrders, userStore, useUser, useWishlist } from '@/lib/store';
import { formatDate } from '@/lib/format';
import { Price } from '@/components/ui/Rupees';

const fields = [
  { name: 'name', label: 'Full name', autoComplete: 'name', required: true },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'address', label: 'Delivery address', autoComplete: 'street-address', wide: true },
  { name: 'pincode', label: 'PIN code', autoComplete: 'postal-code', inputMode: 'numeric' },
];

export default function AccountView() {
  const user = useUser();
  const orders = useOrders();
  const wishlist = useWishlist();

  const onSubmit = (e) => {
    e.preventDefault();
    const details = Object.fromEntries(new FormData(e.currentTarget));
    userStore.set((current) => ({ ...(current || {}), ...details }));
    showToast('Profile saved on this device');
  };

  const signOut = () => {
    userStore.set(null);
    showToast('Profile removed from this device');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <form key={user ? 'saved' : 'new'} onSubmit={onSubmit} className="card h-fit p-6 sm:p-9">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">
          {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Create your profile'}
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          There is no password and nothing is uploaded: your profile is stored in this browser to speed up checkout.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {fields.map(({ name, label, wide, ...rest }) => (
            <label key={name} className={wide ? 'sm:col-span-2' : ''}>
              <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
              <input name={name} className="field" defaultValue={user?.[name] || ''} {...rest} />
            </label>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary">
            Save profile
          </button>
          {user && (
            <button type="button" className="btn btn-outline" onClick={signOut}>
              Remove my details
            </button>
          )}
        </div>
      </form>

      <div className="space-y-8">
        <section className="card p-6 sm:p-9">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">Your orders</h2>
            <span className="text-sm text-ink-500">{orders.length} saved</span>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-ink-500">
              No orders yet.{' '}
              <Link href="/shop" className="font-medium text-brand-700 underline underline-offset-4">
                Start shopping
              </Link>
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-ink-200">
              {orders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="font-semibold text-ink">{order.id}</strong>
                    <span className="text-sm text-ink-500">{formatDate(order.placedAt)}</span>
                  </div>
                  <ul className="mt-2 space-y-0.5 text-sm text-ink-500">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} × {item.qty}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-medium text-ink"><Price value={order.total} /></p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card flex flex-wrap items-center justify-between gap-4 p-6 sm:p-9">
          <div>
            <h2 className="text-xl font-bold text-ink">Wishlist</h2>
            <p className="mt-1 text-sm text-ink-500">
              {wishlist.length} saved {wishlist.length === 1 ? 'design' : 'designs'}
            </p>
          </div>
          <Link href="/wishlist" className="btn btn-outline">
            View wishlist
          </Link>
        </section>
      </div>
    </div>
  );
}
