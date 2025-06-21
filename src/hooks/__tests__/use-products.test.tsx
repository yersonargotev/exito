import * as api from '@/lib/api'
import type { Product } from '@/lib/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  useCategories,
  useInfiniteProducts,
  useProduct,
  useProducts,
} from '../use-products'

// Mock the API
jest.mock('@/lib/api')

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
}

const mockProducts: Product[] = [mockProduct]
const mockCategories = ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useProducts Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useProducts', () => {
    it('should fetch and return products successfully', async () => {
      ; (api.getProducts as jest.Mock).mockResolvedValue(mockProducts)

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProducts)
      expect(api.getProducts).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no products found', async () => {
      ; (api.getProducts as jest.Mock).mockResolvedValue([])

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual([])
    })
  })

  describe('useProduct', () => {
    it('should fetch and return product by ID successfully', async () => {
      ; (api.getProductById as jest.Mock).mockResolvedValue(mockProduct)

      const { result } = renderHook(() => useProduct(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockProduct)
      expect(api.getProductById).toHaveBeenCalledWith(1)
    })

    it('should not fetch when ID is invalid', () => {
      const { result } = renderHook(() => useProduct(0), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(api.getProductById).not.toHaveBeenCalled()
    })
  })

  describe('useCategories', () => {
    it('should fetch and return categories successfully', async () => {
      ; (api.getCategories as jest.Mock).mockResolvedValue(mockCategories)

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockCategories)
      expect(api.getCategories).toHaveBeenCalledTimes(1)
    })
  })

  describe('useInfiniteProducts', () => {
    const mockPaginatedResponse = {
      data: mockProducts,
      totalCount: 1,
      hasMore: false,
      nextCursor: null,
    }

    it('should fetch and return infinite products successfully', async () => {
      ; (api.getProductsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse)

      const { result } = renderHook(() => useInfiniteProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.pages).toHaveLength(1)
      expect(result.current.data?.pages[0]).toEqual(mockPaginatedResponse)
      expect(api.getProductsPaginated).toHaveBeenCalledWith({
        pageParam: 0,
        limit: 8,
        search: undefined,
        category: undefined,
      })
    })

    it('should not fetch when search term is too short', () => {
      const { result } = renderHook(() => useInfiniteProducts({
        search: 'a', // Only 1 character
      }), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
      expect(api.getProductsPaginated).not.toHaveBeenCalled()
    })
  })
})
