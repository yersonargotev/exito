import type { Review, ReviewFilters, ReviewSummary } from '@/lib/types-reviews';

// Datos ficticios de reviews para simular la API
const mockReviews: Review[] = [
  {
    id: '1',
    productId: 1,
    userId: 'user1',
    userName: 'Carlos Rodríguez',
    userAvatar: '/avatars/avatar1.jpg',
    rating: 5,
    title: 'Excelente producto, muy recomendado',
    comment:
      'La calidad es excepcional y llegó muy rápido. Exactamente como se describe en la página. Lo recomiendo 100%.',
    date: new Date('2024-12-15'),
    verified: true,
    helpful: 12,
    images: ['/reviews/product1-review1.jpg'],
  },
  {
    id: '2',
    productId: 1,
    userId: 'user2',
    userName: 'María González',
    rating: 4,
    title: 'Buena relación calidad-precio',
    comment:
      'El producto cumple con las expectativas. La entrega fue puntual y el empaque excelente.',
    date: new Date('2024-12-10'),
    verified: true,
    helpful: 8,
  },
  {
    id: '3',
    productId: 1,
    userId: 'user3',
    userName: 'Ana López',
    rating: 5,
    title: 'Perfecto para regalo',
    comment:
      'Lo compré como regalo y quedó encantada. La calidad es muy buena y el diseño es elegante.',
    date: new Date('2024-12-05'),
    verified: false,
    helpful: 5,
  },
  {
    id: '4',
    productId: 2,
    userId: 'user4',
    userName: 'Pedro Martínez',
    rating: 3,
    title: 'Bueno pero puede mejorar',
    comment:
      'El producto está bien pero esperaba un poco más por el precio. La calidad es aceptable.',
    date: new Date('2024-12-01'),
    verified: true,
    helpful: 3,
  },
  {
    id: '5',
    productId: 2,
    userId: 'user5',
    userName: 'Laura Sánchez',
    rating: 4,
    title: 'Satisfecha con la compra',
    comment:
      'Buen producto en general. El envío fue rápido y el empaque muy cuidado.',
    date: new Date('2024-11-28'),
    verified: true,
    helpful: 7,
  },
];

// Función para obtener reviews de un producto
export const getProductReviews = async (
  productId: number,
  filters: ReviewFilters = {},
): Promise<Review[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredReviews = mockReviews.filter(
    (review) => review.productId === productId,
  );

  // Aplicar filtros
  if (filters.rating) {
    filteredReviews = filteredReviews.filter(
      (review) => review.rating === filters.rating,
    );
  }

  if (filters.verified !== undefined) {
    filteredReviews = filteredReviews.filter(
      (review) => review.verified === filters.verified,
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredReviews = filteredReviews.filter(
      (review) =>
        review.title.toLowerCase().includes(searchTerm) ||
        review.comment.toLowerCase().includes(searchTerm),
    );
  }

  // Aplicar ordenamiento
  const sortBy = filters.sortBy || 'newest';
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.date.getTime() - a.date.getTime();
      case 'oldest':
        return a.date.getTime() - b.date.getTime();
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating_high':
        return b.rating - a.rating;
      case 'rating_low':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return filteredReviews;
};

// Función para obtener resumen de reviews de un producto
export const getProductReviewSummary = async (
  productId: number,
): Promise<ReviewSummary> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const productReviews = mockReviews.filter(
    (review) => review.productId === productId,
  );

  if (productReviews.length === 0) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = productReviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );
  const averageRating = totalRating / productReviews.length;

  const ratingDistribution = productReviews.reduce(
    (dist, review) => {
      dist[review.rating as keyof typeof dist]++;
      return dist;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );

  return {
    productId,
    averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
    totalReviews: productReviews.length,
    ratingDistribution,
  };
};

// Función para agregar una nueva review (simulada)
export const addReview = async (
  review: Omit<Review, 'id' | 'date' | 'helpful'>,
): Promise<Review> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newReview: Review = {
    ...review,
    id: `review_${Date.now()}`,
    date: new Date(),
    helpful: 0,
  };

  // En una aplicación real, esto se enviaría al servidor
  mockReviews.push(newReview);

  return newReview;
};

// Función para marcar una review como útil
export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const review = mockReviews.find((r) => r.id === reviewId);
  if (review) {
    review.helpful++;
  }
};
