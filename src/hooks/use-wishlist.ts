import type { Product } from '@/lib/types';
import { useWishlistStore } from '@/store/wishlist-store';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

/**
 * Custom hook for safe hydration in Next.js
 * Prevents hydration mismatches between server and client
 */
export const useHydratedWishlistStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration after mount
    useWishlistStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

/**
 * Hook to get wishlist items with safe hydration
 */
export const useWishlistItems = (): Product[] => {
  const isHydrated = useHydratedWishlistStore();
  const items = useWishlistStore((state) => state.items);

  return isHydrated ? items : [];
};

/**
 * Hook to get wishlist totals with shallow comparison for optimization
 */
export const useWishlistTotals = () => {
  const isHydrated = useHydratedWishlistStore();
  const { totalItems } = useWishlistStore(
    useShallow((state) => ({
      totalItems: state.totalItems,
    })),
  );

  return {
    totalItems: isHydrated ? totalItems : 0,
    isHydrated,
  };
};

/**
 * Hook to get wishlist actions
 */
export const useWishlistActions = () => {
  return useWishlistStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      clearWishlist: state.clearWishlist,
      toggleItem: state.toggleItem,
    })),
  );
};

/**
 * Hook to check if a product is in wishlist
 */
export const useIsInWishlist = (productId: number) => {
  const isHydrated = useHydratedWishlistStore();
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(productId),
  );

  return isHydrated ? isInWishlist : false;
};

/**
 * Complete wishlist hook with all functionality
 */
export const useWishlist = () => {
  const items = useWishlistItems();
  const { totalItems, isHydrated } = useWishlistTotals();
  const actions = useWishlistActions();

  return {
    items,
    totalItems,
    isEmpty: totalItems === 0,
    isHydrated,
    ...actions,
  };
};
