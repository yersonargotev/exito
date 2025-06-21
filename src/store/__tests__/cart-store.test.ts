/**
 * @jest-environment jsdom
 */
import type { Product } from '@/lib/types';
import { useCartStore } from '../cart-store';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Cart Store', () => {
  // Sample product for testing
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A test product',
    category: 'test',
    image: 'https://example.com/image.jpg',
    rating: {
      rate: 4.5,
      count: 100,
    },
  };

  const mockProduct2: Product = {
    id: 2,
    title: 'Another Test Product',
    price: 39.99,
    description: 'Another test product',
    category: 'test',
    image: 'https://example.com/image2.jpg',
    rating: {
      rate: 4.0,
      count: 50,
    },
  };

  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have initial empty state', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('Adding Items', () => {
    it('should add a new item to cart', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.product.id).toBe(mockProduct.id);
      expect(state.items[0]?.quantity).toBe(1);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(29.99);
    });

    it('should add multiple quantities of the same item', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 3);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.quantity).toBe(3);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(89.97); // 29.99 * 3
    });

    it('should increase quantity when adding existing item', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 1);
      addItem(mockProduct, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.quantity).toBe(3);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(89.97);
    });

    it('should add different products separately', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 1);
      addItem(mockProduct2, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(109.97); // 29.99 + (39.99 * 2)
    });
  });

  describe('Removing Items', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 1);
    });

    it('should remove item completely from cart', () => {
      const { removeItem } = useCartStore.getState();

      removeItem(mockProduct.id);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.product.id).toBe(mockProduct2.id);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(39.99);
    });

    it('should handle removing non-existent item gracefully', () => {
      const { removeItem } = useCartStore.getState();
      const initialState = useCartStore.getState();

      removeItem(999); // Non-existent ID

      const state = useCartStore.getState();
      expect(state.items).toEqual(initialState.items);
      expect(state.totalItems).toBe(initialState.totalItems);
      expect(state.totalPrice).toBe(initialState.totalPrice);
    });
  });

  describe('Updating Quantities', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 3);
    });

    it('should update item quantity', () => {
      const { updateQuantity } = useCartStore.getState();

      updateQuantity(mockProduct.id, 5);

      const state = useCartStore.getState();
      expect(state.items[0]?.quantity).toBe(5);
      expect(state.totalItems).toBe(5);
      expect(state.totalPrice).toBe(149.95); // 29.99 * 5
    });

    it('should remove item when quantity is set to 0', () => {
      const { updateQuantity } = useCartStore.getState();

      updateQuantity(mockProduct.id, 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should handle updating non-existent item gracefully', () => {
      const { updateQuantity } = useCartStore.getState();
      const initialState = useCartStore.getState();

      updateQuantity(999, 5); // Non-existent ID

      const state = useCartStore.getState();
      expect(state.items).toEqual(initialState.items);
    });
  });

  describe('Increase/Decrease Quantity', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
    });

    it('should increase quantity by 1', () => {
      const { increaseQuantity } = useCartStore.getState();

      increaseQuantity(mockProduct.id);

      const state = useCartStore.getState();
      expect(state.items[0]?.quantity).toBe(3);
      expect(state.totalItems).toBe(3);
    });

    it('should decrease quantity by 1', () => {
      const { decreaseQuantity } = useCartStore.getState();

      decreaseQuantity(mockProduct.id);

      const state = useCartStore.getState();
      expect(state.items[0]?.quantity).toBe(1);
      expect(state.totalItems).toBe(1);
    });

    it('should remove item when decreasing quantity to 0', () => {
      const { decreaseQuantity } = useCartStore.getState();

      decreaseQuantity(mockProduct.id); // 2 -> 1
      decreaseQuantity(mockProduct.id); // 1 -> 0 (should remove)

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('Clear Cart', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);
    });

    it('should clear all items from cart', () => {
      const { clearCart } = useCartStore.getState();

      clearCart();

      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('Get Item by ID', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 1);
    });

    it('should return existing cart item', () => {
      const { getItemById } = useCartStore.getState();

      const item = getItemById(mockProduct.id);

      expect(item).toBeDefined();
      expect(item?.product.id).toBe(mockProduct.id);
      expect(item?.quantity).toBe(2);
    });

    it('should return undefined for non-existent item', () => {
      const { getItemById } = useCartStore.getState();

      const item = getItemById(999);

      expect(item).toBeUndefined();
    });
  });

  describe('Item Quantity', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 3);
      addItem(mockProduct2, 2);
    });

    it('should return correct item quantity for existing product', () => {
      const { getItemQuantity } = useCartStore.getState();

      const quantity = getItemQuantity(mockProduct.id);

      expect(quantity).toBe(3);
    });

    it('should return 0 for non-existent product', () => {
      const { getItemQuantity } = useCartStore.getState();

      const quantity = getItemQuantity(999);

      expect(quantity).toBe(0);
    });
  });

  describe('Store Getters', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 1);
    });

    it('should get total items correctly', () => {
      const { getTotalItems } = useCartStore.getState();

      const total = getTotalItems();

      expect(total).toBe(3);
    });

    it('should get total price correctly', () => {
      const { getTotalPrice } = useCartStore.getState();

      const total = getTotalPrice();

      expect(total).toBe(99.97); // (29.99 * 2) + (39.99 * 1)
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct total price with multiple items', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 2); // 29.99 * 2 = 59.98
      addItem(mockProduct2, 3); // 39.99 * 3 = 119.97

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(179.95); // 59.98 + 119.97
    });

    it('should handle decimal precision correctly', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockProduct, 3); // 29.99 * 3 = 89.97

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(89.97);
    });
  });
});
