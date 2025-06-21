'use client';

import { Button } from '@/components/ui/button';
import { useIsInWishlist, useWishlistActions } from '@/hooks/use-wishlist';
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface WishlistButtonProps {
    product: Product;
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'sm' | 'default' | 'lg' | 'icon';
    showText?: boolean;
    className?: string;
}

export function WishlistButton({
    product,
    variant = 'ghost',
    size = 'icon',
    showText = false,
    className,
}: WishlistButtonProps) {
    const isInWishlist = useIsInWishlist(product.id);
    const { toggleItem } = useWishlistActions();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        toggleItem(product);

        if (isInWishlist) {
            toast.success('Producto removido de favoritos', {
                description: product.title,
            });
        } else {
            toast.success('Producto agregado a favoritos', {
                description: product.title,
            });
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleToggle}
            className={className}
            aria-label={
                isInWishlist
                    ? `Remover ${product.title} de favoritos`
                    : `Agregar ${product.title} a favoritos`
            }
        >
            <Heart
                className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`}
            />
            {showText && (
                <span className="ml-2">
                    {isInWishlist ? 'En Favoritos' : 'Agregar a Favoritos'}
                </span>
            )}
        </Button>
    );
}
