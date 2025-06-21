import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sin conexión - Éxito Store',
    description:
        'No tienes conexión a internet. Algunos productos pueden estar disponibles en tu caché local.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function OfflineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
