import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { Heart, Minus, Plus, Share2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductActionsProps {
  product: Product;
  productCart: {
    quantity: number;
    isInCart: boolean;
    isHydrated: boolean;
    addToCart: (qty?: number) => void;
    removeFromCart: () => void;
    updateQuantity: (qty: number) => void;
    increaseQuantity: () => void;
    decreaseQuantity: () => void;
  } | null;
}

export function ProductActions({ product, productCart }: ProductActionsProps) {
  const handleAddToCart = () => {
    if (!productCart) return;

    productCart.addToCart(1);
    toast.success('Producto agregado al carrito', {
      description: product.title,
    });
  };

  const handleIncreaseQuantity = () => {
    if (!productCart) return;

    productCart.increaseQuantity();
    toast.success('Cantidad actualizada');
  };

  const handleDecreaseQuantity = () => {
    if (!productCart) return;

    if (productCart.quantity === 1) {
      productCart.removeFromCart();
      toast.success('Producto removido del carrito');
    } else {
      productCart.decreaseQuantity();
      toast.success('Cantidad actualizada');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Mira este producto: ${product.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // El usuario canceló o hay error
        console.log('Error al compartir:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
      } catch (error) {
        toast.error('No se pudo copiar el enlace');
      }
    }
  };

  const handleWishlist = () => {
    // Funcionalidad futura para lista de deseos
    toast.info('Funcionalidad de lista de deseos próximamente');
  };

  if (!productCart?.isHydrated) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="h-10 animate-pulse rounded bg-muted sm:h-12" />
        <div className="h-8 animate-pulse rounded bg-muted sm:h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quantity Controls and Add to Cart */}
      <div className="space-y-3 sm:space-y-4">
        {productCart.isInCart ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-medium text-foreground text-sm">
                Cantidad:
              </span>
              <div className="flex items-center rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecreaseQuantity}
                  className="h-8 w-8 rounded-r-none border-r sm:h-10 sm:w-10"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="flex h-8 min-w-[50px] items-center justify-center font-medium text-sm sm:h-10 sm:min-w-[60px] sm:text-base">
                  {productCart.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleIncreaseQuantity}
                  className="h-8 w-8 rounded-l-none border-l sm:h-10 sm:w-10"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Success message */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-green-800">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">
                  Producto en el carrito
                </span>
              </div>
              <p className="mt-1 text-green-700 text-xs sm:text-sm">
                {productCart.quantity} unidad
                {productCart.quantity !== 1 ? 'es' : ''} agregada
                {productCart.quantity !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ) : (
          /* Add to Cart Button */
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full py-3 font-medium text-base sm:py-4 sm:text-lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Agregar al carrito</span>
            <span className="sm:hidden">Agregar</span>
          </Button>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={handleWishlist}
          className="flex flex-1 items-center justify-center gap-1 px-2 text-xs sm:gap-2 sm:px-4 sm:text-sm"
        >
          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Lista de deseos</span>
          <span className="sm:hidden">Guardar</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-1 px-2 text-xs sm:gap-2 sm:px-4 sm:text-sm"
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Compartir</span>
          <span className="sm:hidden">Compartir</span>
        </Button>
      </div>

      {/* Product Features */}
      <div className="border-border border-t pt-4 sm:pt-6">
        <h3 className="mb-3 font-semibold text-base text-foreground sm:mb-4 sm:text-lg">
          Información del producto
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              Envío gratis a todo el país
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Garantía de 30 días</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Pago seguro</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Soporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
