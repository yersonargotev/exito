import {
  addReview,
  getProductReviewSummary,
  getProductReviews,
  markReviewHelpful,
} from '@/lib/reviews-api';
import type { ReviewFilters } from '@/lib/types-reviews';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook para obtener reviews de un producto
export function useProductReviews(
  productId: number,
  filters: ReviewFilters = {},
) {
  return useQuery({
    queryKey: ['reviews', productId, filters],
    queryFn: () => getProductReviews(productId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!productId,
  });
}

// Hook para obtener resumen de reviews de un producto
export function useProductReviewSummary(productId: number) {
  return useQuery({
    queryKey: ['reviewSummary', productId],
    queryFn: () => getProductReviewSummary(productId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!productId,
  });
}

// Hook para agregar una nueva review
export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReview,
    onSuccess: (newReview) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['reviews', newReview.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviewSummary', newReview.productId],
      });
    },
  });
}

// Hook para marcar una review como útil
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markReviewHelpful,
    onSuccess: (_, reviewId) => {
      // Invalidar todas las queries de reviews para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: ['reviews'],
      });
    },
  });
}
