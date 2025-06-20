'use client';

import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { useProductCart } from '@/hooks/use-cart';
import { useProduct } from '@/hooks/use-products';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductActions } from './product-actions';
import { ProductBreadcrumb } from './product-breadcrumb';
import { ProductImage } from './product-image';
import { ProductInfo } from './product-info';

interface ProductDetailProps {
    productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
    const router = useRouter();
    const {
        data: product,
        isLoading,
        isError,
        error,
        refetch,
    } = useProduct(productId);

    // Solo usar productCart si el producto existe
    const productCart = product ? useProductCart(product) : null;

    // Estado de carga
    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    // Estado de error
    if (isError || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className='flex min-h-[60vh] items-center justify-center'>
                    <div className='max-w-md space-y-6 text-center'>
                        <div className="text-6xl">😕</div>
                        <h1 className='font-bold text-2xl text-gray-900'>
                            Producto no encontrado
                        </h1>
                        {error && (
                            <ErrorMessage
                                message={error.message || 'No pudimos cargar este producto'}
                            />
                        )}
                        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                            <Button onClick={() => refetch()}>Reintentar</Button>
                            <Button onClick={() => router.push('/')} variant="outline">
                                Ir al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <ProductBreadcrumb product={product} />

            {/* Back button */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>
            </div>

            {/* Main content */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
                {/* Product Image */}
                <ProductImage product={product} />

                {/* Product Information and Actions */}
                <div className="space-y-6">
                    <ProductInfo product={product} />
                    {productCart && <ProductActions product={product} productCart={productCart} />}
                </div>
            </div>

            {/* Additional product details */}
            <div className="mt-12 border-t pt-8">
                <div className="max-w-4xl">
                    <h2 className='mb-6 font-bold text-2xl text-gray-900'>
                        Descripción del producto
                    </h2>
                    <div className="prose prose-gray max-w-none">
                        <p className='text-gray-700 text-lg leading-relaxed'>
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb skeleton */}
            <div className="mb-6">
                <div className='h-4 w-64 animate-pulse rounded bg-gray-200' />
            </div>

            {/* Back button skeleton */}
            <div className="mb-6">
                <div className='h-10 w-24 animate-pulse rounded bg-gray-200' />
            </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
                {/* Image skeleton */}
                <div className='aspect-square animate-pulse rounded-lg bg-gray-200' />

                {/* Product info skeleton */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className='h-8 w-3/4 animate-pulse rounded bg-gray-200' />
                        <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
                        <div className='h-10 w-24 animate-pulse rounded bg-gray-200' />
                    </div>

                    <div className="space-y-2">
                        <div className='h-4 animate-pulse rounded bg-gray-200' />
                        <div className='h-4 animate-pulse rounded bg-gray-200' />
                        <div className='h-4 w-3/4 animate-pulse rounded bg-gray-200' />
                    </div>

                    <div className="space-y-4">
                        <div className='h-12 animate-pulse rounded bg-gray-200' />
                        <div className='h-10 animate-pulse rounded bg-gray-200' />
                    </div>
                </div>
            </div>

            {/* Description skeleton */}
            <div className="mt-12 border-t pt-8">
                <div className='mb-6 h-8 w-48 animate-pulse rounded bg-gray-200' />
                <div className="space-y-2">
                    <div className='h-4 animate-pulse rounded bg-gray-200' />
                    <div className='h-4 animate-pulse rounded bg-gray-200' />
                    <div className='h-4 w-3/4 animate-pulse rounded bg-gray-200' />
                </div>
            </div>
        </div>
    );
}
