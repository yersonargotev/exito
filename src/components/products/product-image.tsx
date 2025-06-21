import type { Product } from '@/lib/types';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 h-12 w-12 sm:h-16 sm:w-16" />
          <p className="text-sm sm:text-base">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
      {imageLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-muted">
          <div className="text-muted-foreground">
            <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
        </div>
      )}

      <Image
        src={product.image}
        alt={product.title}
        fill
        data-testid="product-image"
        className={`object-contain p-3 transition-opacity duration-300 sm:p-4 ${imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
        priority
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
}
