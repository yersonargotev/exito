import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CartSummaryProps {
    totalItems: number;
    totalPrice: number;
    onClearCart: () => void;
}

export function CartSummary({
    totalItems,
    totalPrice,
    onClearCart,
}: CartSummaryProps) {
    const router = useRouter();

    // Formatear precio a COP
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price * 3800); // Conversión aproximada USD a COP
    };

    // Calcular envío (gratis para pedidos mayores a $100 USD)
    const freeShippingThreshold = 100;
    const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 15; // $15 USD
    const finalTotal = totalPrice + shippingCost;

    const handleCheckout = () => {
        // Validar que hay items en el carrito
        if (totalItems === 0) {
            toast.error('No hay productos en tu carrito');
            return;
        }

        toast.success('Redirigiendo al checkout...');
        router.push('/checkout');
    };

    const handleClearCart = () => {
        onClearCart();
        toast.success('Carrito vaciado');
    };

    return (
        <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground text-xl">
                    Resumen del pedido
                </h2>
            </div>

            <div className="mb-6 space-y-3">
                {/* Total de items */}
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        Productos ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-medium text-foreground">
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                {/* Envío */}
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

                {/* Mensaje de envío gratis */}
                {totalPrice < freeShippingThreshold && (
                    <div className="rounded bg-muted p-2 text-muted-foreground text-xs">
                        Agrega {formatPrice(freeShippingThreshold - totalPrice)} más para
                        obtener envío gratis
                    </div>
                )}

                <hr className="border-border" />

                {/* Total final */}
                <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(finalTotal)}</span>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceder al pago
                </Button>

                <Button variant="outline" className="w-full" onClick={handleClearCart}>
                    Vaciar carrito
                </Button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 border-border border-t pt-4">
                <div className="space-y-2 text-muted-foreground text-xs">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>
                            Envío gratis en pedidos superiores a{' '}
                            {formatPrice(freeShippingThreshold)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Devoluciones gratuitas en 30 días</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <span>Pago 100% seguro</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
