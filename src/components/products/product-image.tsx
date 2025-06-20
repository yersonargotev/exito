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
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
        <div className="text-center text-gray-400">
          <ImageIcon className="mx-auto mb-2 h-16 w-16" />
          <p>Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
      {imageLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100">
          <div className="text-gray-400">
            <ImageIcon className="h-16 w-16" />
          </div>
        </div>
      )}

      <Image
        src={product.image}
        alt={product.title}
        fill
        className={`object-contain p-4 transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 768px) 100vw, 50vw"
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
