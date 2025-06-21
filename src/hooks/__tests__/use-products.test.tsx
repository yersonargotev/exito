import {
  useCategories,
  useProduct,
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from '@/hooks/use-products';
import * as api from '@/lib/api';
import type { Product, ProductCategory } from '@/lib/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

// Mock the API module
jest.mock('@/lib/api');

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'A test product',
    category: 'electronics',
    image: 'https://example.com/image1.jpg',
    rating: {
      rate: 4.5,
      count: 100,
    },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 39.99,
    description: 'Another test product',
    category: 'clothing',
    image: 'https://example.com/image2.jpg',
    rating: {
      rate: 4.0,
      count: 50,
    },
  },
];

const mockCategories: ProductCategory[] = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0, // More explicit than false
        retryOnMount: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retryDelay: () => 0,
        networkMode: 'always',
      },
      mutations: {
        retry: 0,
        retryDelay: () => 0,
        networkMode: 'always',
      },
    },
  });

  // Override the setQueryDefaults to force no retries for all queries
  queryClient.setQueryDefaults(['products'], { retry: 0 });
  queryClient.setQueryDefaults(['product'], { retry: 0 });
  queryClient.setQueryDefaults(['categories'], { retry: 0 });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
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

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 15000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 20000);

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
        { timeout: 15000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 20000);

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
        { timeout: 15000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 20000);
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

    it('should handle error when search fails', async () => {
      const errorMessage = 'Search failed';
      (api.searchProducts as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useSearchProducts(searchQuery), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 15000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    }, 20000);

    it('should not fetch when query is too short', () => {
      const { result } = renderHook(() => useSearchProducts('a'), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(api.searchProducts).not.toHaveBeenCalled();
    });

    it('should return empty array as default when data is null', async () => {
      (api.searchProducts as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useSearchProducts(searchQuery), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });
});
