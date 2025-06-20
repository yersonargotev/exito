import { ProductDetail } from '@/components/products/product-detail';
import { Suspense } from 'react';

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    const productId = Number.parseInt(params.id);

    // Validar que el ID sea un número válido
    if (Number.isNaN(productId) || productId <= 0) {
        return (
            <div className='flex min-h-[60vh] items-center justify-center'>
                <div className='space-y-4 text-center'>
                    <h1 className='font-bold text-2xl text-gray-900'>
                        Producto no encontrado
                    </h1>
                    <p className="text-gray-600">El ID del producto no es válido.</p>
                    <a
                        href="/"
                        className='inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail productId={productId} />
        </Suspense>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb skeleton */}
            <div className="mb-6">
                <div className='h-4 w-64 animate-pulse rounded bg-gray-200' />
            </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
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
        </div>
    );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: ProductPageProps) {
    const productId = Number.parseInt(params.id);

    if (Number.isNaN(productId) || productId <= 0) {
        return {
            title: 'Producto no encontrado',
            description: 'El producto solicitado no existe.',
        };
    }

    try {
        // En un caso real, podrías hacer fetch del producto aquí para metadata
        return {
            title: `Producto ${productId} - Mi Tienda`,
            description: `Detalles del producto ${productId}`,
        };
    } catch {
        return {
            title: 'Producto no encontrado',
            description: 'El producto solicitado no existe.',
        };
    }
}
