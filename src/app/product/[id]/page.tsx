import { ProductDetail } from '@/components/products/product-detail';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id);

  // Validar que el ID sea un número válido
  if (Number.isNaN(productId) || productId <= 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="font-bold text-2xl text-foreground">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground">
            El ID del producto no es válido.
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
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
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div className="aspect-square animate-pulse rounded-lg bg-muted" />

        {/* Product info skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-4">
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generar metadata dinámica
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id);

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
