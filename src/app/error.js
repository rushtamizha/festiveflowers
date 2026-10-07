'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Hook a real error reporter (Sentry or similar) in here when one is added.
    console.error(error);
  }, [error]);

  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="animate-pop grid size-16 place-items-center rounded-full bg-brand-50 text-2xl font-bold text-brand-700">!</span>
      <h1 className="mt-6 text-[26px] sm:text-[32px]">Something broke on our side</h1>
      <p className="mt-2 text-sm text-ink-500">Your cart is safe. Try again, or head back to the shop.</p>
      {error?.digest && <p className="mt-2 text-[11px] font-medium tracking-[0.1em] text-ink-500 uppercase">Ref {error.digest}</p>}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          Try again
        </button>
        <Link href="/shop" className="btn btn-outline btn-lg">
          Browse products
        </Link>
      </div>
    </div>
  );
}
