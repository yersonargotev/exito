import type { Metadata } from 'next';
import CheckoutPageClient from './checkout-page-client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout - Finalizar Compra | Exito',
  description:
    'Completa tu compra de manera segura. Ingresa tu información personal, dirección de envío y método de pago para finalizar tu pedido.',
  robots: {
    index: false, // No indexar páginas de checkout por seguridad
    follow: false,
  },
  openGraph: {
    title: 'Checkout - Finalizar Compra | Exito',
    description: 'Completa tu compra de manera segura en Exito.',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
