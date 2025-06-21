import type { CartItem, Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

/**
 * Custom hook for safe hydration in Next.js
 * Prevents hydration mismatches between server and client
 */
export const useHydratedCartStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration after mount
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

/**
 * Hook to get cart items with safe hydration
 */
export const useCartItems = (): CartItem[] => {
  const isHydrated = useHydratedCartStore();
  const items = useCartStore((state) => state.items);

  return isHydrated ? items : [];
};

/**
 * Hook to get cart totals with shallow comparison for optimization
 */
export const useCartTotals = () => {
  const isHydrated = useHydratedCartStore();

  const { totalItems, totalPrice } = useCartStore(
    useShallow((state) => ({
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    })),
  );

  return isHydrated
    ? { totalItems, totalPrice }
    : { totalItems: 0, totalPrice: 0 };
};

/**
 * Hook to get cart actions
 */
export const useCartActions = () => {
  return useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      increaseQuantity: state.increaseQuantity,
      decreaseQuantity: state.decreaseQuantity,
      clearCart: state.clearCart,
    })),
  );
};

/**
 * Hook to get a specific item by product ID
 */
export const useCartItem = (productId: number): CartItem | undefined => {
  const isHydrated = useHydratedCartStore();
  const getItemById = useCartStore((state) => state.getItemById);

  return isHydrated ? getItemById(productId) : undefined;
};

/**
 * Hook to get the quantity of a specific product in the cart
 */
export const useCartItemQuantity = (productId: number): number => {
  const isHydrated = useHydratedCartStore();
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  return isHydrated ? getItemQuantity(productId) : 0;
};

/**
 * Hook to check if a product is in the cart
 */
export const useIsInCart = (productId: number): boolean => {
  const quantity = useCartItemQuantity(productId);
  return quantity > 0;
};

/**
 * Combined hook for product card components
 * Returns all cart-related data for a specific product
 */
export const useProductCart = (product: Product) => {
  const isHydrated = useHydratedCartStore();
  const actions = useCartActions();
  const quantity = useCartItemQuantity(product.id);
  const isInCart = quantity > 0;

  // Memoize cart actions to prevent unnecessary re-renders
  const cartActions = useMemo(
    () => ({
      addToCart: (qty = 1) => {
        if (isHydrated) {
          actions.addItem(product, qty);
        }
      },
      removeFromCart: () => {
        if (isHydrated) {
          actions.removeItem(product.id);
        }
      },
      updateQuantity: (qty: number) => {
        if (isHydrated) {
          actions.updateQuantity(product.id, qty);
        }
      },
      increaseQuantity: () => {
        if (isHydrated) {
          actions.increaseQuantity(product.id);
        }
      },
      decreaseQuantity: () => {
        if (isHydrated) {
          actions.decreaseQuantity(product.id);
        }
      },
    }),
    [isHydrated, actions, product],
  );

  return {
    quantity,
    isInCart,
    isHydrated,
    ...cartActions,
  };
};

/**
 * Hook for cart page with all necessary data and actions
 */
export const useCart = () => {
  const isHydrated = useHydratedCartStore();
  const items = useCartItems();
  const totals = useCartTotals();
  const actions = useCartActions();

  // Memoize computed values
  const cartData = useMemo(
    () => ({
      isEmpty: items.length === 0,
      itemCount: items.length,
      hasItems: items.length > 0,
    }),
    [items.length],
  );

  return {
    ...totals,
    items,
    isHydrated,
    ...cartData,
    ...actions,
  };
};
