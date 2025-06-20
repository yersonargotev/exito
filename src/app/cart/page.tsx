'use client';

import { CartEmpty } from '@/components/cart/cart-empty';
import { CartItemComponent } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCart } from '@/hooks/use-cart';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const {
        items,
        totalItems,
        totalPrice,
        isEmpty,
        isHydrated,
        updateQuantity,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    } = useCart();

    // Mostrar loading durante la hidratación
    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className='flex min-h-[400px] items-center justify-center'>
                        <LoadingSpinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar estado vacío
    if (isEmpty) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <CartEmpty />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header del carrito */}
                <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <div className='mb-2 flex items-center gap-2'>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Continuar comprando
                                </Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <h1 className='font-bold text-2xl text-foreground sm:text-3xl'>
                                Mi Carrito
                            </h1>
                        </div>
                        <p className='mt-1 text-muted-foreground'>
                            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu
                            carrito
                        </p>
                    </div>
                </div>

                {/* Layout del carrito */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Lista de productos - 2/3 del ancho en desktop */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItemComponent
                                    key={item.product.id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemoveItem={removeItem}
                                    onIncreaseQuantity={increaseQuantity}
                                    onDecreaseQuantity={decreaseQuantity}
                                />
                            ))}
                        </div>

                        {/* Sugerencias de productos relacionados (placeholder) */}
                        <div className='mt-8 rounded-lg bg-muted/50 p-6 lg:hidden'>
                            <h3 className='mb-2 font-semibold text-foreground'>
                                💡 Te podría interesar
                            </h3>
                            <p className='text-muted-foreground text-sm'>
                                Descubre más productos que otros clientes han comprado junto con
                                los tuyos.
                            </p>
                            <Button variant="outline" size="sm" className="mt-3" asChild>
                                <Link href="/">Ver recomendaciones</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Resumen del carrito - 1/3 del ancho en desktop */}
                    <div className="mt-8 lg:mt-0">
                        <CartSummary
                            totalItems={totalItems}
                            totalPrice={totalPrice}
                            onClearCart={clearCart}
                        />

                        {/* Políticas de compra */}
                        <div className='mt-6 rounded-lg bg-muted/30 p-4'>
                            <h4 className='mb-3 font-medium text-foreground text-sm'>
                                Información de compra
                            </h4>
                            <div className='space-y-2 text-muted-foreground text-xs'>
                                <p>• Envío gratis en compras superiores a $380.000 COP</p>
                                <p>• Tiempo de entrega: 3-5 días hábiles</p>
                                <p>• Garantía de satisfacción de 30 días</p>
                                <p>• Soporte al cliente 24/7</p>
                            </div>
                        </div>

                        {/* Call to action adicional en desktop */}
                        <div className='mt-6 hidden rounded-lg border border-primary/20 bg-primary/10 p-4 lg:block'>
                            <h4 className='mb-2 font-medium text-primary text-sm'>
                                ¿Necesitas ayuda?
                            </h4>
                            <p className='mb-3 text-primary/80 text-xs'>
                                Nuestro equipo está aquí para ayudarte con tu compra.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                Contactar soporte
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CTA fijo en mobile */}
                <div className='fixed right-0 bottom-0 left-0 border-border border-t bg-background p-4 lg:hidden'>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className='text-muted-foreground text-sm'>Total</p>
                            <p className='font-semibold text-foreground text-lg'>
                                {new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format((totalPrice + (totalPrice >= 100 ? 0 : 15)) * 3800)}
                            </p>
                        </div>
                        <Button size="lg" className='max-w-xs flex-1'>
                            Proceder al pago
                        </Button>
                    </div>
                </div>

                {/* Espaciado adicional en mobile para el CTA fijo */}
                <div className='h-20 lg:hidden' />
            </div>
        </div>
    );
}
