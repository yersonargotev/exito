/**
 * @jest-environment jsdom
 */
import type { Product } from '@/lib/types';
import { useWishlistStore } from '../wishlist-store';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Wishlist Store', () => {
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
    useWishlistStore.setState({
      items: [],
      totalItems: 0,
    });
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have empty initial state', () => {
      const state = useWishlistStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
    });
  });

  describe('Adding Items', () => {
    it('should add item to wishlist', () => {
      const { addItem } = useWishlistStore.getState();

      addItem(mockProduct);

      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProduct);
      expect(state.totalItems).toBe(1);
    });

    it('should not add duplicate items', () => {
      const { addItem } = useWishlistStore.getState();

      addItem(mockProduct);
      addItem(mockProduct); // Try to add same product again

      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.totalItems).toBe(1);
    });

    it('should add different products separately', () => {
      const { addItem } = useWishlistStore.getState();

      addItem(mockProduct);
      addItem(mockProduct2);

      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(2);
    });
  });

  describe('Removing Items', () => {
    beforeEach(() => {
      const { addItem } = useWishlistStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);
    });

    it('should remove item from wishlist', () => {
      const { removeItem } = useWishlistStore.getState();

      removeItem(mockProduct.id);

      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.id).toBe(mockProduct2.id);
      expect(state.totalItems).toBe(1);
    });

    it('should handle removing non-existent item', () => {
      const { removeItem } = useWishlistStore.getState();

      removeItem(999); // Non-existent ID

      const state = useWishlistStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(2);
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      const { addItem } = useWishlistStore.getState();
      addItem(mockProduct);
    });

    it('should check if item is in wishlist', () => {
      const { isInWishlist } = useWishlistStore.getState();

      expect(isInWishlist(mockProduct.id)).toBe(true);
      expect(isInWishlist(mockProduct2.id)).toBe(false);
    });

    it('should toggle item correctly', () => {
      const { toggleItem } = useWishlistStore.getState();

      // Remove existing item
      toggleItem(mockProduct);
      let state = useWishlistStore.getState();
      expect(state.items).toHaveLength(0);

      // Add new item
      toggleItem(mockProduct2);
      state = useWishlistStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]?.id).toBe(mockProduct2.id);
    });
  });

  describe('Clear Wishlist', () => {
    beforeEach(() => {
      const { addItem } = useWishlistStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);
    });

    it('should clear all items from wishlist', () => {
      const { clearWishlist } = useWishlistStore.getState();

      clearWishlist();

      const state = useWishlistStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
    });
  });
});
