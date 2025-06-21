'use client';

import { Button } from '@/components/ui/button';
import { useAddReview } from '@/hooks/use-reviews';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewFormProps {
  productId: number;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const addReviewMutation = useAddReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || !comment.trim() || !title.trim() || !userName.trim()) {
      return;
    }

    try {
      await addReviewMutation.mutateAsync({
        productId,
        userId: `user_${Date.now()}`, // En una app real esto vendría de la sesión
        userName: userName.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        verified: false, // En una app real esto se determinaría por compras
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setUserName('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const isSubmitting = addReviewMutation.isPending;
  const isFormValid =
    rating > 0 && title.trim() && comment.trim() && userName.trim();

  return (
    <div className="rounded-lg border bg-background p-6">
      <h3 className="mb-4 font-semibold text-lg">Escribir una reseña</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating input */}
        <div>
          <fieldset>
            <legend className="mb-2 block font-medium text-sm">
              Calificación
            </legend>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Calificar con ${star} estrella${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* User name input */}
        <div>
          <label htmlFor="userName" className="mb-2 block font-medium text-sm">
            Tu nombre
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Title input */}
        <div>
          <label htmlFor="title" className="mb-2 block font-medium text-sm">
            Título de tu reseña
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resume tu experiencia"
            className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Comment input */}
        <div>
          <label htmlFor="comment" className="mb-2 block font-medium text-sm">
            Tu comentario
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            rows={4}
            className="w-full resize-none rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="w-full"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
        </Button>
      </form>
    </div>
  );
}
