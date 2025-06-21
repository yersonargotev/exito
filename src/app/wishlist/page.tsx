import type { Metadata } from 'next';
import WishlistPageClient from './wishlist-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Mis Favoritos - Exito',
    description:
        'Revisa y gestiona tu lista de productos favoritos. Guarda los productos que más te gustan para comprarlos más tarde.',
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Mis Favoritos - Exito',
        description: 'Gestiona tu lista de productos favoritos en Exito.',
        type: 'website',
    },
};

export default function WishlistPage() {
    return <WishlistPageClient />;
}
