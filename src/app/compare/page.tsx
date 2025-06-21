import type { Metadata } from 'next';
import ComparePageClient from './compare-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Comparar Productos - Exito',
    description:
        'Compara hasta 3 productos lado a lado para tomar la mejor decisión de compra. Ve diferencias en precio, características y especificaciones.',
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Comparar Productos - Exito',
        description: 'Compara productos lado a lado en Exito.',
        type: 'website',
    },
};

export default function ComparePage() {
    return <ComparePageClient />;
}
