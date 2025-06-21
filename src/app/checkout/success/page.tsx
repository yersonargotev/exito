import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutSuccessPageClient from './success-page-client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Compra Exitosa - Pedido Confirmado | Exito',
  description: 'Tu compra ha sido procesada exitosamente. Revisa los detalles de tu pedido y fecha de entrega estimada.',
  robots: {
    index: false, // No indexar páginas de éxito por privacidad
    follow: false,
  },
  openGraph: {
    title: 'Compra Exitosa - Pedido Confirmado | Exito',
    description: 'Tu compra ha sido procesada exitosamente en Exito.',
    type: 'website',
  },
};

function CheckoutSuccessLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">
          Cargando información del pedido...
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessPageClient />
    </Suspense>
  );
}
