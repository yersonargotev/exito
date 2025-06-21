import type { Metadata } from 'next';
import CartPageClient from './cart-page-client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Carrito de Compras - Exito',
  description: 'Revisa los productos en tu carrito de compras y procede al checkout. Gestiona cantidades y finaliza tu compra de manera segura.',
  robots: {
    index: false, // No indexar páginas de carrito por privacidad
    follow: true,
  },
  openGraph: {
    title: 'Carrito de Compras - Exito',
    description: 'Revisa los productos en tu carrito de compras y procede al checkout.',
    type: 'website',
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
