import { useCompareStore } from '@/store/compare-store';
import { act, renderHook } from '@testing-library/react';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product',
  category: 'test',
  image: '/test.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockProduct2 = {
  id: 2,
  title: 'Test Product 2',
  price: 39.99,
  description: 'Another test product',
  category: 'test',
  image: '/test2.jpg',
  rating: { rate: 4.0, count: 50 },
};

describe('Compare Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      result.current.clearCompare();
    });
  });

  it('should add product to compare list', () => {
    const { result } = renderHook(() => useCompareStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockProduct);
    expect(result.current.isInCompare(mockProduct.id)).toBe(true);
  });

  it('should remove product from compare list', () => {
    const { result } = renderHook(() => useCompareStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isInCompare(mockProduct.id)).toBe(false);
  });

  it('should toggle product in compare list', () => {
    const { result } = renderHook(() => useCompareStore());

    // Toggle add
    act(() => {
      result.current.toggleItem(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.isInCompare(mockProduct.id)).toBe(true);

    // Toggle remove
    act(() => {
      result.current.toggleItem(mockProduct);
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.isInCompare(mockProduct.id)).toBe(false);
  });

  it('should clear all products from compare list', () => {
    const { result } = renderHook(() => useCompareStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
      result.current.clearCompare();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should not add duplicate products', () => {
    const { result } = renderHook(() => useCompareStore());

    act(() => {
      const added1 = result.current.addItem(mockProduct);
      const added2 = result.current.addItem(mockProduct); // Try to add same product again

      expect(added1).toBe(true);
      expect(added2).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
  });

  it('should limit compare list to maximum items', () => {
    const { result } = renderHook(() => useCompareStore());

    const products = Array.from({ length: 5 }, (_, i) => ({
      ...mockProduct,
      id: i + 1,
      title: `Product ${i + 1}`,
    }));

    act(() => {
      products.forEach((product) => {
        result.current.addItem(product);
      });
    });

    // Should only keep first 3 products (maxItems = 3)
    expect(result.current.items).toHaveLength(3);
  });

  it('should check if can add more items', () => {
    const { result } = renderHook(() => useCompareStore());

    expect(result.current.canAddMore()).toBe(true);

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
    });

    expect(result.current.canAddMore()).toBe(true);

    act(() => {
      result.current.addItem({ ...mockProduct, id: 3 });
    });

    expect(result.current.canAddMore()).toBe(false);
  });
});
