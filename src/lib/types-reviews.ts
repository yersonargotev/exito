export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: Date;
  verified: boolean; // Si compró el producto
  helpful: number; // Votos útiles
  images?: string[]; // Imágenes de la review
}

export interface ReviewSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low';
  search?: string;
}
