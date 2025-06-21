import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import type {
  PaymentInfo,
  PersonalInfo,
  ShippingAddress,
} from '@/lib/validation-schemas';
import { Check, Package, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';

interface OrderSummaryProps {
  personalInfo?: PersonalInfo;
  shippingAddress?: ShippingAddress;
  paymentInfo?: PaymentInfo;
  onConfirmOrder?: () => void;
  isConfirmation?: boolean;
  className?: string;
}

export function OrderSummary({
  personalInfo,
  shippingAddress,
  paymentInfo,
  onConfirmOrder,
  isConfirmation = false,
  className,
}: OrderSummaryProps) {
  const { items, totalItems, totalPrice, isEmpty } = useCart();

  // Formatear precio a COP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 3800); // Conversión aproximada USD a COP
  };

  // Calcular envío
  const freeShippingThreshold = 100;
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  if (isEmpty) {
    return (
      <div className={cn('rounded-lg bg-muted/50 p-6 text-center', className)}>
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No hay productos en tu carrito</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground text-xl">
          Resumen del Pedido
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Lista de productos */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-3 rounded-lg border border-border bg-card p-3"
          >
            {/* Imagen del producto */}
            <div className="flex-shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-white">
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
            </div>

            {/* Información del producto */}
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 font-medium text-foreground text-sm leading-tight">
                {item.product.title}
              </h4>
              <p className="mb-2 text-muted-foreground text-xs capitalize">
                {item.product.category}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  Cantidad: {item.quantity}
                </span>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-muted-foreground text-xs">
                      {formatPrice(item.product.price)} c/u
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="space-y-3 border-border border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({totalItems} items)
          </span>
          <span className="font-medium text-foreground">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          <span className="font-medium text-foreground">
            {shippingCost === 0 ? (
              <span className="font-semibold text-green-600">Gratis</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        {totalPrice < freeShippingThreshold && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/20">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Truck className="h-4 w-4" />
              <span className="text-xs">
                Agrega {formatPrice(freeShippingThreshold - totalPrice)} más
                para envío gratis
              </span>
            </div>
          </div>
        )}

        <hr className="border-border" />

        <div className="flex justify-between font-semibold text-lg">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Información completada en steps anteriores */}
      {(personalInfo || shippingAddress || paymentInfo) && (
        <div className="space-y-4 border-border border-t pt-6">
          <h3 className="font-medium text-foreground">
            Información del Pedido
          </h3>

          {personalInfo && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm dark:text-green-200">
                  Información Personal
                </span>
              </div>
              <div className="space-y-1 text-green-700 text-xs dark:text-green-300">
                <p>
                  {personalInfo.firstName} {personalInfo.lastName}
                </p>
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
              </div>
            </div>
          )}

          {shippingAddress && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm dark:text-blue-200">
                  Dirección de Envío
                </span>
              </div>
              <div className="space-y-1 text-blue-700 text-xs dark:text-blue-300">
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state}
                </p>
                <p>
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
            </div>
          )}

          {paymentInfo && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-sm dark:text-purple-200">
                  Método de Pago
                </span>
              </div>
              <div className="space-y-1 text-purple-700 text-xs dark:text-purple-300">
                <p>
                  Tarjeta terminada en ****{paymentInfo.cardNumber.slice(-4)}
                </p>
                <p>{paymentInfo.cardHolderName}</p>
                <p>
                  Vence: {paymentInfo.expiryMonth}/{paymentInfo.expiryYear}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón de confirmación */}
      {isConfirmation && onConfirmOrder && (
        <div className="border-border border-t pt-6">
          <Button onClick={onConfirmOrder} className="w-full" size="lg">
            <Package className="mr-2 h-4 w-4" />
            Confirmar Pedido
          </Button>

          <div className="mt-4 space-y-1 text-center text-muted-foreground text-xs">
            <p>
              Al confirmar tu pedido aceptas nuestros términos y condiciones
            </p>
            <p>Recibirás un email de confirmación en breve</p>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="rounded-lg bg-muted/30 p-4">
        <h4 className="mb-2 font-medium text-foreground text-sm">
          📋 Detalles del Pedido
        </h4>
        <div className="space-y-1 text-muted-foreground text-xs">
          <p>• Tiempo estimado de entrega: 3-5 días hábiles</p>
          <p>• Podrás rastrear tu pedido una vez confirmado</p>
          <p>• Garantía de devolución de 30 días</p>
          <p>• Soporte disponible 24/7</p>
        </div>
      </div>
    </div>
  );
}
