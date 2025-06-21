import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import { toast } from 'sonner';
import { QuantityControls } from './quantity-controls';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
}

export const CartItemComponent = memo(function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: CartItemProps) {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  const handleRemove = () => {
    onRemoveItem(product.id);
    toast.success(`${product.title} eliminado del carrito`);
  };

  const handleIncrease = () => {
    onIncreaseQuantity(product.id);
    toast.success('Cantidad actualizada');
  };

  const handleDecrease = () => {
    onDecreaseQuantity(product.id);
    if (quantity > 1) {
      toast.success('Cantidad actualizada');
    }
  };

  // Formatear precio a COP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 3800); // Conversión aproximada USD a COP
  };

  return (
    <div data-testid="cart-item" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row">
      {/* Imagen del producto */}
      <div className="mx-auto flex-shrink-0 sm:mx-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-md bg-white sm:h-20 sm:w-20">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 96px, 80px"
          />
        </div>
      </div>

      {/* Información del producto */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-1 line-clamp-2 font-medium text-foreground text-sm sm:text-base">
              {product.title}
            </h3>
            <p className="text-muted-foreground text-sm capitalize">
              {product.category}
            </p>
            <p className="mt-2 font-semibold text-foreground text-lg">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Controles en mobile */}
          <div className="flex flex-col gap-3 sm:items-end">
            {/* Controles de cantidad */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <QuantityControls
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                size="sm"
                min={1}
                max={99}
              />

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={handleRemove}
                aria-label={`Eliminar ${product.title} del carrito`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Subtotal</p>
              <p className="font-semibold text-foreground text-lg">
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
