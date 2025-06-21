import * as api from '@/lib/api';
import type { Product, ProductCategory } from '@/lib/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  useCategories,
  useInfiniteProducts,
  useProduct,
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from '../use-products';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  getCategories: jest.fn(),
  getProductsByCategory: jest.fn(),
  searchProducts: jest.fn(),
  getProductsPaginated: jest.fn(),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'A test product',
    category: 'electronics',
    image: 'https://example.com/image1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 39.99,
    description: 'Another test product',
    category: 'electronics', // Fixed to valid category
    image: 'https://example.com/image2.jpg',
    rating: { rate: 4.0, count: 50 },
  },
];

const mockCategories: ProductCategory[] = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

// Create a test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        retryDelay: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Override specific query defaults to force no retries
  queryClient.setQueryDefaults(['products'], { retry: false });
  queryClient.setQueryDefaults(['product'], { retry: false });
  queryClient.setQueryDefaults(['categories'], { retry: false });
  queryClient.setQueryDefaults(['products', 'category'], { retry: false });
  queryClient.setQueryDefaults(['products', 'search'], { retry: false });
  queryClient.setQueryDefaults(['products', 'infinite'], { retry: false });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch and return products successfully', async () => {
      (api.getProducts as jest.Mock).mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(api.getProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching products fails', async () => {
      const errorMessage = 'Failed to fetch products';
      (api.getProducts as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      // Wait for retries to complete (retry: 3 means 4 total attempts)
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 15000);

    it('should return empty array as default when data is null', async () => {
      (api.getProducts as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useProduct', () => {
    const productId = 1;

    it('should fetch and return product by ID successfully', async () => {
      (api.getProductById as jest.Mock).mockResolvedValue(mockProducts[0]);

      const { result } = renderHook(() => useProduct(productId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts[0]);
      expect(api.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle error when fetching product by ID fails', async () => {
      const errorMessage = 'Product not found';
      (api.getProductById as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useProduct(productId), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 15000);

    it('should not fetch when productId is invalid', () => {
      const { result } = renderHook(() => useProduct(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(api.getProductById).not.toHaveBeenCalled();
    });
  });

  describe('useCategories', () => {
    it('should fetch and return categories successfully', async () => {
      (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(api.getCategories).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching categories fails', async () => {
      const errorMessage = 'Failed to fetch categories';
      (api.getCategories as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 15000);
  });

  describe('useProductsByCategory', () => {
    const category: ProductCategory = 'electronics';

    it('should fetch and return products by category successfully', async () => {
      const categoryProducts = [mockProducts[0]];
      (api.getProductsByCategory as jest.Mock).mockResolvedValue(
        categoryProducts,
      );

      const { result } = renderHook(() => useProductsByCategory(category), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(categoryProducts);
      expect(api.getProductsByCategory).toHaveBeenCalledWith(category);
    });

    it('should not fetch when category is undefined', () => {
      const { result } = renderHook(
        () => useProductsByCategory(undefined as any),
        {
          wrapper: createWrapper(),
        },
      );

      expect(result.current.data).toBeUndefined();
      expect(api.getProductsByCategory).not.toHaveBeenCalled();
    });
  });

  describe('useSearchProducts', () => {
    const searchQuery = 'test';

    it('should fetch and return search results successfully', async () => {
      (api.searchProducts as jest.Mock).mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useSearchProducts(searchQuery), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(api.searchProducts).toHaveBeenCalledWith(searchQuery);
    });

    it('should not fetch when query is empty', () => {
      const { result } = renderHook(() => useSearchProducts(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(api.searchProducts).not.toHaveBeenCalled();
    });

    it('should not fetch when query is too short (less than 2 characters)', () => {
      const { result } = renderHook(() => useSearchProducts('a'), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(api.searchProducts).not.toHaveBeenCalled();
    });
  });

  describe('useInfiniteProducts', () => {
    const mockPaginatedResponse = {
      data: mockProducts,
      hasNextPage: true,
      nextCursor: 2,
      totalCount: 10,
    };

    it('should fetch and return infinite products successfully', async () => {
      (api.getProductsPaginated as jest.Mock).mockResolvedValue(
        mockPaginatedResponse,
      );

      const { result } = renderHook(() => useInfiniteProducts({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockPaginatedResponse);
      expect(api.getProductsPaginated).toHaveBeenCalledWith({
        pageParam: 0,
        limit: 8,
        search: undefined,
        category: undefined,
      });
    });

    it('should pass filters correctly to API', async () => {
      const filters = {
        search: 'test',
        category: 'electronics' as ProductCategory,
        limit: 10,
      };
      (api.getProductsPaginated as jest.Mock).mockResolvedValue(
        mockPaginatedResponse,
      );

      renderHook(() => useInfiniteProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(api.getProductsPaginated).toHaveBeenCalledWith({
          pageParam: 0,
          limit: 10,
          search: 'test',
          category: 'electronics',
        });
      });
    });

    it('should handle pagination correctly', async () => {
      (api.getProductsPaginated as jest.Mock)
        .mockResolvedValueOnce(mockPaginatedResponse)
        .mockResolvedValueOnce({
          data: [mockProducts[1]],
          hasNextPage: false,
          nextCursor: null,
          totalCount: 10,
        });

      const { result } = renderHook(() => useInfiniteProducts({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page
      await waitFor(() => {
        if (result.current.fetchNextPage) {
          result.current.fetchNextPage();
        }
      });

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });
    });

    it('should handle error when fetching infinite products fails', async () => {
      const errorMessage = 'Failed to fetch infinite products';
      (api.getProductsPaginated as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useInfiniteProducts({}), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 15000);
  });
});
