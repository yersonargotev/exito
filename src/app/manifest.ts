import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Exito - Tu tienda online de confianza',
    short_name: 'Exito',
    description:
      'Encuentra los mejores productos en electrónicos, ropa, joyería y más en Exito. Ofertas exclusivas y envío gratis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es',
    categories: ['shopping', 'business'],
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/og.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Página principal de Exito Store',
      },
    ],
    shortcuts: [
      {
        name: 'Productos',
        short_name: 'Productos',
        description: 'Ver todos los productos',
        url: '/?category=all',
        icons: [{ src: '/icon0.svg', sizes: '96x96' }],
      },
      {
        name: 'Carrito',
        short_name: 'Carrito',
        description: 'Ver carrito de compras',
        url: '/cart',
        icons: [{ src: '/icon1.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
