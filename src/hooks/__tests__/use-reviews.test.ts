import {
  useAddReview,
  useProductReviewSummary,
  useProductReviews,
} from '@/hooks/use-reviews';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';

// Mock the reviews API
jest.mock('@/lib/reviews-api', () => ({
  getProductReviews: jest.fn().mockResolvedValue([
    {
      id: '1',
      productId: 1,
      userId: 'user1',
      userName: 'Test User',
      rating: 5,
      title: 'Great product',
      comment: 'Really love this product!',
      date: new Date('2024-01-01'),
      verified: true,
      helpful: 0,
    },
  ]),
  getProductReviewSummary: jest.fn().mockResolvedValue({
    productId: 1,
    averageRating: 4.5,
    totalReviews: 10,
    ratingDistribution: {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
    },
  }),
  addReview: jest.fn().mockResolvedValue({
    id: '2',
    productId: 1,
    userId: 'user2',
    userName: 'New User',
    rating: 5,
    title: 'Amazing!',
    comment: 'Best purchase ever!',
    date: new Date(),
    verified: false,
    helpful: 0,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  }

  return Wrapper;
};

describe('Reviews Hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useProductReviews', () => {
    it('should fetch reviews for a product', async () => {
      const { result } = renderHook(() => useProductReviews(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0]).toMatchObject({
        id: '1',
        productId: 1,
        userName: 'Test User',
        rating: 5,
      });
    });
  });

  describe('useProductReviewSummary', () => {
    it('should fetch review summary for a product', async () => {
      const { result } = renderHook(() => useProductReviewSummary(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toMatchObject({
        productId: 1,
        averageRating: 4.5,
        totalReviews: 10,
      });
    });
  });

  describe('useAddReview', () => {
    it('should add a new review', async () => {
      const { result } = renderHook(() => useAddReview(), {
        wrapper: createWrapper(),
      });

      const newReview = {
        productId: 1,
        userId: 'user2',
        userName: 'New User',
        rating: 5,
        title: 'Amazing!',
        comment: 'Best purchase ever!',
        verified: false,
      };

      await act(async () => {
        await result.current.mutateAsync(newReview);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toMatchObject({
        productId: 1,
        userName: 'New User',
        rating: 5,
      });
    });
  });
});
