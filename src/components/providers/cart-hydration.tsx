'use client';

import { useCartStore } from '@/store/cart-store';
import { useEffect } from 'react';

/**
 * Cart Hydration Component
 * Handles client-side hydration of the cart store
 * Must be used in a client component to prevent SSR mismatches
 */
export function CartHydration() {
  useEffect(() => {
    // Manually trigger hydration on the client side
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
