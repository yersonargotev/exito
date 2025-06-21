'use client';

import { Button } from '@/components/ui/button';
import { useProductReviewSummary } from '@/hooks/use-reviews';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  productId: number;
}

export function ReviewSummary({ productId }: ReviewSummaryProps) {
  const {
    data: summary,
    isLoading,
    isError,
  } = useProductReviewSummary(productId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (isError || !summary) {
    return null;
  }

  const { averageRating, totalReviews, ratingDistribution } = summary;

  if (totalReviews === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="mb-2 font-medium text-foreground">Sin reseñas aún</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Sé el primero en reseñar este producto
        </p>
        <Button variant="outline" size="sm">
          Escribir reseña
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-lg">Reseñas de clientes</h3>

      {/* Calificación promedio */}
      <div className="mb-6 flex items-center gap-4">
        <div className="text-center">
          <div className="mb-1 font-bold text-3xl">{averageRating}</div>
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= averageRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-muted-foreground text-sm">
            {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
          </div>
        </div>

        {/* Distribución de calificaciones */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground text-xs">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón para escribir reseña */}
      <Button className="w-full" variant="outline">
        Escribir reseña
      </Button>
    </div>
  );
}
