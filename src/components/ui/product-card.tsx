import { useProductCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
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
            className={cn(
                'group relative rounded-lg border border-border bg-card p-4 transition-all hover:shadow-lg',
                className,
            )}
        >
            {/* Imagen del producto */}
            <div className='relative mb-4 aspect-square overflow-hidden rounded-md bg-muted'>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Información del producto */}
            <div className="space-y-2">
                {/* Categoría */}
                <div className="flex items-center justify-between">
                    <span className='rounded-full bg-primary/10 px-2 py-1 font-medium text-primary text-xs'>
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
                <h3 className='line-clamp-2 font-medium leading-tight'>
                    {product.title}
                </h3>

                {/* Precio */}
                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                </div>

                {/* Controles del carrito */}
                <div className="pt-2">
                    {!isInCart ? (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className='flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Agregar al carrito
                        </button>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleDecreaseQuantity}
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className='min-w-[2rem] text-center font-medium text-sm'>
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleIncreaseQuantity}
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                            <span className='font-medium text-muted-foreground text-sm'>
                                En carrito
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
