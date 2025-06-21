import { ProductDetail } from '@/components/products/product-detail';
import { getProducts } from '@/lib/api';
import type { Metadata } from 'next';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number.parseInt(id);

  // Validate product ID
  if (Number.isNaN(productId) || productId <= 0) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe.',
    };
  }

  try {
    // Fetch product data for metadata
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return {
        title: 'Producto no encontrado',
        description: 'El producto que buscas no existe.',
      };
    }

    return {
      title: `${product.title} | Exito`,
      description: `${product.description.substring(0, 160)}...`,
      keywords: [
        product.title,
        product.category,
        'comprar online',
        'oferta',
        'exito',
        'producto',
      ],
      openGraph: {
        title: product.title,
        description: product.description,
        images: [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        title: product.title,
        description: product.description,
        images: [product.image],
        card: 'summary_large_image',
      },
      alternates: {
        canonical: `/product/${productId}`,
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'USD',
        'product:category': product.category,
        'product:availability': 'in stock',
      },
    };
  } catch {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe.',
    };
  }
}

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
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 sm:mb-6">
        <div className="h-4 w-48 animate-pulse rounded bg-muted sm:w-64" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Image skeleton */}
        <div className="aspect-square animate-pulse rounded-lg bg-muted" />

        {/* Product info skeleton */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted sm:h-8" />
            <div className="h-5 w-32 animate-pulse rounded bg-muted sm:h-6" />
            <div className="h-8 w-24 animate-pulse rounded bg-muted sm:h-10" />
          </div>

          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="h-10 animate-pulse rounded bg-muted sm:h-12" />
            <div className="h-8 animate-pulse rounded bg-muted sm:h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
