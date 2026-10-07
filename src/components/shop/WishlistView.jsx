'use client';

import { useWishlist } from '@/lib/store';
import ProductGrid from '@/components/product/ProductGrid';
import { HeartIcon } from '@/components/ui/Icons';
import { EmptyState } from './CartView';

export default function WishlistView() {
  const items = useWishlist();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={HeartIcon}
        title="Your wishlist is empty"
        text="Tap the heart on any design to save it here for later."
        cta="Browse designs"
      />
    );
  }

  return <ProductGrid products={items} heading="h2" />;
}
