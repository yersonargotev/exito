import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  useCartActions,
  useCartItem,
  useCartItemQuantity,
  useCartItems,
  useCartTotals,
  useHydratedCartStore,
  useIsInCart,
} from '../use-cart';

// Mock product for testing
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product for cart testing',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

// Helper to reset cart state and ensure clean state
const resetCart = () => {
  act(() => {
    useCartStore.getState().clearCart();
    // Force immediate hydration
    useCartStore.persist.rehydrate();
  });
};

// Helper to wait for hydration to complete
const waitForHydration = async () => {
  const { result } = renderHook(() => useHydratedCartStore());
  await waitFor(() => {
    expect(result.current).toBe(true);
  });
};

describe('useCart Hooks', () => {
  beforeEach(async () => {
    resetCart();
    jest.clearAllMocks();
    // Ensure hydration is complete before each test
    await waitForHydration();
  });

  afterEach(() => {
    resetCart();
  });

  describe('useHydratedCartStore', () => {
    it('should eventually return true after mounting', async () => {
      const { result } = renderHook(() => useHydratedCartStore());

      // Should become true after useEffect runs
      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe('useCartItems', () => {
    it('should return empty array initially', async () => {
      const { result } = renderHook(() => useCartItems());

      // Wait for hydration
      await waitFor(() => {
        expect(result.current).toEqual([]);
      });
    });

    it('should return cart items when items exist', async () => {
      const { result } = renderHook(() => useCartItems());

      // Add items to the store
      act(() => {
        useCartStore.getState().addItem(mockProduct, 2);
      });

      await waitFor(() => {
        expect(result.current).toHaveLength(1);
        expect(result.current[0]?.product.id).toBe(mockProduct.id);
        expect(result.current[0]?.quantity).toBe(2);
      });
    });
  });

  describe('useCartTotals', () => {
    it('should return zero totals initially', async () => {
      const { result } = renderHook(() => useCartTotals());

      await waitFor(() => {
        expect(result.current).toEqual({
          totalItems: 0,
          totalPrice: 0,
        });
      });
    });

    it('should return correct totals when items exist', async () => {
      const { result } = renderHook(() => useCartTotals());

      // Add items to the store
      act(() => {
        useCartStore.getState().addItem(mockProduct, 3);
      });

      await waitFor(() => {
        expect(result.current.totalItems).toBe(3);
        expect(result.current.totalPrice).toBeCloseTo(89.97, 2); // 29.99 * 3
      });
    });

    it('should update when store changes', async () => {
      const { result } = renderHook(() => useCartTotals());

      // Add an item
      act(() => {
        useCartStore.getState().addItem(mockProduct, 2);
      });

      await waitFor(() => {
        expect(result.current.totalItems).toBe(2);
        expect(result.current.totalPrice).toBeCloseTo(59.98, 2); // 29.99 * 2
      });
    });
  });

  describe('useCartActions', () => {
    it('should provide all cart actions', () => {
      const { result } = renderHook(() => useCartActions());

      expect(result.current).toHaveProperty('addItem');
      expect(result.current).toHaveProperty('removeItem');
      expect(result.current).toHaveProperty('updateQuantity');
      expect(result.current).toHaveProperty('increaseQuantity');
      expect(result.current).toHaveProperty('decreaseQuantity');
      expect(result.current).toHaveProperty('clearCart');

      // All should be functions
      Object.values(result.current).forEach((action) => {
        expect(typeof action).toBe('function');
      });
    });

    it('should execute addItem correctly', async () => {
      const { result } = renderHook(() => ({
        actions: useCartActions(),
        items: useCartItems(),
      }));

      act(() => {
        result.current.actions.addItem(mockProduct, 2);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]?.quantity).toBe(2);
      });
    });
  });

  describe('useCartItem', () => {
    it('should return undefined for non-existent item', async () => {
      const { result } = renderHook(() => useCartItem(999));

      await waitFor(() => {
        expect(result.current).toBeUndefined();
      });
    });

    it('should return item when it exists', async () => {
      // Add the item first and wait for state to update
      act(() => {
        useCartStore.getState().addItem(mockProduct, 1);
      });

      const { result } = renderHook(() => useCartItem(mockProduct.id));

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current?.product.id).toBe(mockProduct.id);
        expect(result.current?.quantity).toBe(1);
      });
    });
  });

  describe('useCartItemQuantity', () => {
    it('should return 0 for non-existent item', async () => {
      const { result } = renderHook(() => useCartItemQuantity(999));

      await waitFor(() => {
        expect(result.current).toBe(0);
      });
    });

    it('should return correct quantity when item exists', async () => {
      // Add the item first and wait for state to update
      act(() => {
        useCartStore.getState().addItem(mockProduct, 3);
      });

      const { result } = renderHook(() => useCartItemQuantity(mockProduct.id));

      await waitFor(() => {
        expect(result.current).toBe(3);
      });
    });
  });

  describe('useIsInCart', () => {
    it('should return false for non-existent item', async () => {
      const { result } = renderHook(() => useIsInCart(999));

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('should return true when item exists', async () => {
      // Add the item first and wait for state to update
      act(() => {
        useCartStore.getState().addItem(mockProduct, 1);
      });

      const { result } = renderHook(() => useIsInCart(mockProduct.id));

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });
});
