import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomePageClient from './home-page-client';

// Force dynamic rendering for this page to ensure fresh product data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Productos de calidad al mejor precio',
  description:
    'Descubre nuestra amplia selección de electrónicos, ropa, joyería y más. Ofertas especiales, envío gratis en compras superiores a $150.000 COP. ¡Compra seguro con garantía!',
  keywords: [
    'productos en línea',
    'electrónicos baratos',
    'ropa de marca',
    'joyería fina',
    'ofertas colombia',
    'envío gratis',
    'compras seguras',
    'tienda virtual',
    'descuentos',
    'tecnología',
  ],
  openGraph: {
    title: 'Éxito Store - Productos de calidad al mejor precio',
    description:
      'Descubre nuestra amplia selección con ofertas especiales y envío gratis.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Éxito Store - Productos destacados',
      },
    ],
  },
  twitter: {
    title: 'Éxito Store - Productos de calidad al mejor precio',
    description: 'Descubre nuestra amplia selección con ofertas especiales.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/',
  },
};

function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <section className="mb-12" aria-label="Cargando sección principal">
        <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200 md:h-96" />
      </section>

      {/* Products Grid Skeleton */}
      <section aria-label="Cargando productos">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((id) => (
            <div
              key={id}
              className="h-80 animate-pulse rounded-lg bg-gray-200"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient />
    </Suspense>
  );
}
