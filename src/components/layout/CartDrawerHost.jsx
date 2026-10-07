'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUi } from '@/lib/store';

// Both pieces (and the Motion code they use) are downloaded only when first needed.
const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false });
const CartIsland = dynamic(() => import('@/components/cart/CartIsland'), { ssr: false });

export default function CartDrawerHost() {
  const { cartOpen, lastAdded } = useUi();
  const [drawerUsed, setDrawerUsed] = useState(false);
  const [islandUsed, setIslandUsed] = useState(false);

  if (cartOpen && !drawerUsed) setDrawerUsed(true);
  if (lastAdded && !islandUsed) setIslandUsed(true);

  return (
    <>
      {islandUsed && <CartIsland />}
      {drawerUsed && <CartDrawer open={cartOpen} />}
    </>
  );
}
