import { useProductCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const {
    quantity,
    isInCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useProductCart(product);

  const handleAddToCart = () => {
    addToCart(1);
  };

  const handleIncreaseQuantity = () => {
    increaseQuantity();
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart();
    } else {
      decreaseQuantity();
    }
  };

  return (
    <div
      data-testid="product-card"
      className={cn(
        'group relative rounded-lg border border-border bg-card p-3 transition-all hover:shadow-lg sm:p-4',
        className,
      )}
    >
      {/* Imagen del producto */}
      <Link
        href={`/product/${product.id}`}
        className="relative mb-3 block aspect-square overflow-hidden rounded-md bg-muted sm:mb-4"
      >
        <Image
          src={product.image}
          alt={product.title}
          width={300}
          height={300}
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </Link>

      {/* Información del producto */}
      <div className="space-y-2">
        {/* Categoría */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
            {product.category}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-muted-foreground text-xs">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
        </div>

        {/* Título */}
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 cursor-pointer font-medium text-sm leading-tight transition-colors hover:text-primary sm:text-base">
            {product.title}
          </h3>
        </Link>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <span
            data-testid="product-price"
            className="font-bold text-base sm:text-lg"
          >
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Controles del carrito */}
        <div className="pt-2">
          {!isInCart ? (
            <button
              type="button"
              data-testid="add-to-cart-button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground text-xs transition-colors hover:bg-primary/90 sm:px-4 sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Agregar al carrito</span>
              <span className="sm:hidden">Agregar</span>
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  data-testid="decrease-quantity"
                  onClick={handleDecreaseQuantity}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted sm:h-8 sm:w-8"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span
                  data-testid="quantity-display"
                  className="min-w-[1.5rem] text-center font-medium text-xs sm:min-w-[2rem] sm:text-sm"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  data-testid="increase-quantity"
                  onClick={handleIncreaseQuantity}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted sm:h-8 sm:w-8"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="font-medium text-muted-foreground text-xs sm:text-sm">
                En carrito
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
