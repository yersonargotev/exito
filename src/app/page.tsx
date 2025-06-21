import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomePageClient from './home-page-client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Éxito Store - Tu tienda online de confianza',
  description: 'Descubre los mejores productos en Éxito Store. Electrónicos, ropa, joyería y más con las mejores ofertas y envío gratis.',
  keywords: ['tienda online', 'electronics', 'ropa', 'joyería', 'ofertas', 'colombia', 'exito'],
  openGraph: {
    title: 'Éxito Store - Tu tienda online de confianza',
    description: 'Descubre los mejores productos con las mejores ofertas.',
    type: 'website',
  },
};

function HomePageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageClient />
    </Suspense>
  );
}
