import { ProductCard } from '@/components/ui/product-card';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { type ReactNode } from 'react';

// Simple mock to fix hydration in tests by always returning true
jest.mock('@/hooks/use-cart', () => {
  const originalModule = jest.requireActual('@/hooks/use-cart');

  return {
    ...originalModule,
    // Mock only the hydration hook to return true immediately
    useHydratedCartStore: jest.fn(() => true),
  };
});

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product for integration testing',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Integration Tests - Cart Flow', () => {
  beforeEach(() => {
    // Reset cart before each test
    useCartStore.getState().clearCart();
    useCartStore.persist.rehydrate();
    jest.clearAllMocks();
  });

  afterEach(() => {
    useCartStore.getState().clearCart();
    jest.clearAllMocks();
  });

  describe('Product Card to Cart Integration', () => {
    it('should add product to cart and update store state', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ProductCard product={mockProduct} />
        </TestWrapper>,
      );

      // Initially, cart should be empty
      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().totalItems).toBe(0);
      expect(useCartStore.getState().totalPrice).toBe(0);

      // Find and click the add to cart button
      const addButton = screen.getByRole('button', {
        name: /agregar al carrito agregar/i,
      });
      await user.click(addButton);

      // Wait for state to update
      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(1);
        expect(cartState.items[0]?.product.id).toBe(mockProduct.id);
        expect(cartState.items[0]?.quantity).toBe(1);
        expect(cartState.totalItems).toBe(1);
        expect(cartState.totalPrice).toBeCloseTo(29.99, 2);
      });
    });

    it('should handle basic cart operations', async () => {
      // Add item to cart through the store directly for this test
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1);

      // Verify store state
      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(1);
        expect(cartState.totalItems).toBe(1);
        expect(cartState.totalPrice).toBeCloseTo(29.99, 2);
      });
    });

    it('should remove product from cart when quantity reaches zero', async () => {
      // Add item first
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 1);

      // Verify item was added
      expect(useCartStore.getState().items).toHaveLength(1);

      // Remove item
      removeItem(mockProduct.id);

      // Verify item was removed
      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(0);
        expect(cartState.totalItems).toBe(0);
        expect(cartState.totalPrice).toBe(0);
      });
    });

    it('should persist cart state across component remounts', async () => {
      // Add item to cart
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1);

      // Verify state persists (simulate remount by re-hydrating)
      useCartStore.persist.rehydrate();

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(1);
        expect(cartState.totalItems).toBe(1);
      });
    });

    it('should handle multiple products in cart', async () => {
      const secondProduct: Product = {
        ...mockProduct,
        id: 2,
        title: 'Second Test Product',
        price: 19.99,
      };

      const { addItem } = useCartStore.getState();

      // Add first product
      addItem(mockProduct, 1);

      // Add second product
      addItem(secondProduct, 2);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(2);
        expect(cartState.totalItems).toBe(3); // 1 + 2
        expect(cartState.totalPrice).toBeCloseTo(69.97, 2); // 29.99 + (19.99 * 2)
      });
    });

    it('should handle quantity updates correctly', async () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      // Add item
      addItem(mockProduct, 1);

      // Update quantity
      updateQuantity(mockProduct.id, 3);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items[0]?.quantity).toBe(3);
        expect(cartState.totalItems).toBe(3);
        expect(cartState.totalPrice).toBeCloseTo(89.97, 2); // 29.99 * 3
      });
    });

    it('should clear cart properly', async () => {
      const { addItem, clearCart } = useCartStore.getState();

      // Add multiple items
      addItem(mockProduct, 2);
      addItem({ ...mockProduct, id: 2 }, 1);

      // Clear cart
      clearCart();

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(0);
        expect(cartState.totalItems).toBe(0);
        expect(cartState.totalPrice).toBe(0);
      });
    });

    it('should increase item quantity when adding the same product multiple times', async () => {
      const { addItem } = useCartStore.getState();

      // Add same item multiple times
      addItem(mockProduct, 1);
      addItem(mockProduct, 2);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(1); // Still one item type
        expect(cartState.items[0]?.quantity).toBe(3); // But quantity increased
        expect(cartState.totalItems).toBe(3);
        expect(cartState.totalPrice).toBeCloseTo(89.97, 2); // 29.99 * 3
      });
    });

    it('should handle increase and decrease quantity operations', async () => {
      const { addItem, increaseQuantity, decreaseQuantity } =
        useCartStore.getState();

      // Add item
      addItem(mockProduct, 1);

      // Increase quantity
      increaseQuantity(mockProduct.id);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items[0]?.quantity).toBe(2);
        expect(cartState.totalItems).toBe(2);
      });

      // Decrease quantity
      decreaseQuantity(mockProduct.id);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items[0]?.quantity).toBe(1);
        expect(cartState.totalItems).toBe(1);
      });
    });

    it('should remove item when decreasing quantity to zero', async () => {
      const { addItem, decreaseQuantity } = useCartStore.getState();

      // Add item with quantity 1
      addItem(mockProduct, 1);

      // Verify item is in cart
      expect(useCartStore.getState().items).toHaveLength(1);

      // Decrease quantity (should remove item since it's at 1)
      decreaseQuantity(mockProduct.id);

      await waitFor(() => {
        const cartState = useCartStore.getState();
        expect(cartState.items).toHaveLength(0);
        expect(cartState.totalItems).toBe(0);
        expect(cartState.totalPrice).toBe(0);
      });
    });

    it('should get correct item by ID', async () => {
      const { addItem, getItemById } = useCartStore.getState();

      // Add item
      addItem(mockProduct, 2);

      // Get item by ID
      const item = getItemById(mockProduct.id);

      expect(item).toBeDefined();
      expect(item?.product.id).toBe(mockProduct.id);
      expect(item?.quantity).toBe(2);

      // Test non-existent item
      const nonExistentItem = getItemById(999);
      expect(nonExistentItem).toBeUndefined();
    });

    it('should get correct item quantity', async () => {
      const { addItem, getItemQuantity } = useCartStore.getState();

      // Test non-existent item
      expect(getItemQuantity(mockProduct.id)).toBe(0);

      // Add item
      addItem(mockProduct, 3);

      // Test existing item
      expect(getItemQuantity(mockProduct.id)).toBe(3);
    });
  });
});
