'use client';

import { Button } from '@/components/ui/button';
import { useMarkReviewHelpful, useProductReviews } from '@/hooks/use-reviews';
import type { ReviewFilters } from '@/lib/types-reviews';
import { CheckCircle, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewListProps {
  productId: number;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
  });

  const {
    data: reviews,
    isLoading,
    isError,
  } = useProductReviews(productId, filters);
  const markHelpfulMutation = useMarkReviewHelpful();

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpfulMutation.mutateAsync(reviewId);
      toast.success('¡Gracias por tu voto!');
    } catch (error) {
      toast.error('Error al marcar como útil');
    }
  };

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-border bg-card p-4"
          >
            <div className="mb-2 h-4 rounded bg-muted" />
            <div className="mb-2 h-3 w-1/3 rounded bg-muted" />
            <div className="h-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !reviews) {
    return (
      <div className="text-center text-muted-foreground">
        Error al cargar las reseñas
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No hay reseñas para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleFilterChange({ sortBy: e.target.value as any })
          }
          className="rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="helpful">Más útiles</option>
          <option value="rating_high">Calificación alta</option>
          <option value="rating_low">Calificación baja</option>
        </select>

        <select
          value={filters.rating || ''}
          onChange={(e) =>
            handleFilterChange({
              rating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="rounded-md border border-border bg-background px-3 py-1 text-sm"
        >
          <option value="">Todas las calificaciones</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>

        <Button
          variant={filters.verified ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            handleFilterChange({
              verified: filters.verified ? undefined : true,
            })
          }
        >
          Solo compras verificadas
        </Button>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            {/* Header de la reseña */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{review.userName}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Compra verificada</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {review.date.toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Título y comentario */}
            <div className="mb-3">
              <h4 className="mb-2 font-medium">{review.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Imágenes de la reseña */}
            {review.images && review.images.length > 0 && (
              <div className="mb-3 flex gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={`${review.id}-image-${index}`}
                    src={image}
                    alt={`Reseña de ${review.userName} - foto ${index + 1}`}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ))}
              </div>
            )}

            {/* Footer de la reseña */}
            <div className="flex items-center justify-between border-border border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(review.id)}
                disabled={markHelpfulMutation.isPending}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Útil ({review.helpful})</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
