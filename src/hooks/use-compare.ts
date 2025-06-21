import type { Product } from '@/lib/types';
import { useCompareStore } from '@/store/compare-store';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

/**
 * Custom hook for safe hydration in Next.js
 * Prevents hydration mismatches between server and client
 */
export const useHydratedCompareStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration after mount
    useCompareStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

/**
 * Hook to get compare items with safe hydration
 */
export const useCompareItems = (): Product[] => {
  const isHydrated = useHydratedCompareStore();
  const items = useCompareStore((state) => state.items);

  return isHydrated ? items : [];
};

/**
 * Hook to get compare actions
 */
export const useCompareActions = () => {
  return useCompareStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      clearCompare: state.clearCompare,
      toggleItem: state.toggleItem,
      canAddMore: state.canAddMore,
    })),
  );
};

/**
 * Hook to check if a product is in compare list
 */
export const useIsInCompare = (productId: number) => {
  const isHydrated = useHydratedCompareStore();
  const isInCompare = useCompareStore((state) => state.isInCompare(productId));

  return isHydrated ? isInCompare : false;
};

/**
 * Complete compare hook with all functionality
 */
export const useCompare = () => {
  const items = useCompareItems();
  const actions = useCompareActions();
  const isHydrated = useHydratedCompareStore();
  const maxItems = useCompareStore((state) => state.maxItems);

  return {
    items,
    count: items.length,
    maxItems,
    isEmpty: items.length === 0,
    isFull: items.length >= maxItems,
    isHydrated,
    ...actions,
  };
};
