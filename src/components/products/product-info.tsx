import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 4000); // Conversión aproximada USD a COP
  };

  const formatCategory = (category: string) => {
    return category
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={`star-${index}-${rating}`}
        className={`h-4 w-4 ${index < Math.floor(rating)
            ? 'fill-current text-yellow-400'
            : index < rating
              ? 'fill-current text-yellow-400 opacity-50'
              : 'text-muted-foreground'
          }`}
      />
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category */}
      <div>
        <Badge variant="secondary" className="mb-2">
          {formatCategory(product.category)}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h1 className="font-bold text-foreground text-xl leading-tight sm:text-2xl lg:text-3xl">
          {product.title}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1">
          {renderStars(product.rating.rate)}
        </div>
        <span className="font-medium text-foreground text-sm">
          {product.rating.rate.toFixed(1)}
        </span>
        <span className="text-muted-foreground text-sm">
          ({product.rating.count} reseñas)
        </span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-2xl text-foreground sm:text-3xl lg:text-4xl">
            {formatPrice(product.price)}
          </span>
          <span className="text-muted-foreground text-sm line-through">
            {formatPrice(product.price * 1.2)}
          </span>
        </div>
        <p className="font-medium text-green-600 text-sm">¡Ahorro del 17%!</p>
      </div>

      {/* Short description */}
      <div className="border-border border-t pt-4">
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          {product.description.length > 200
            ? `${product.description.substring(0, 200)}...`
            : product.description}
        </p>
      </div>
    </div>
  );
}
