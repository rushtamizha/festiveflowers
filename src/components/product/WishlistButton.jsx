'use client';

import { showToast, toggleWishlist, useWishlist } from '@/lib/store';
import { HeartIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/cn';

export default function WishlistButton({ product, className, withLabel = false }) {
  const wishlist = useWishlist();
  const active = wishlist.some((item) => item.id === product.id);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(added ? 'Saved to your wishlist' : 'Removed from wishlist');
  };

  if (withLabel) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={cn('btn btn-outline', className)}>
        {/* Re-keyed on change so the heart pops each time it toggles */}
        <span key={active ? 'on' : 'off'} className="animate-pop inline-flex">
          <HeartIcon size={18} filled={active} className={active ? 'text-brand-600' : ''} />
        </span>
        {active ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={cn('press grid size-9 place-items-center rounded-full bg-white shadow-small ring-1 ring-ink-200', className)}
    >
      <span key={active ? 'on' : 'off'} className="animate-pop inline-flex">
        <HeartIcon size={17} filled={active} className={active ? 'text-brand-600' : 'text-ink-500'} />
      </span>
    </button>
  );
}
