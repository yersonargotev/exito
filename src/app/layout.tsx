import '@/styles/globals.css';
import { WebVitals } from '@/components/analytics/web-vitals';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://exito-store.vercel.app',
  ),
  title: {
    default: 'Exito - Tu tienda online de confianza',
    template: '%s | Exito',
  },
  description:
    'Descubre los mejores productos en Exito. Electrónicos, ropa, joyería y más con las mejores ofertas y envío gratis en compras superiores a $150.000 COP.',
  keywords: [
    'tienda online',
    'electrónicos',
    'ropa',
    'joyería',
    'ofertas',
    'colombia',
    'exito',
    'ecommerce',
    'compras online',
    'tecnología',
    'moda',
    'accesorios',
  ],
  authors: [{ name: 'Exito', url: 'https://exito-store.vercel.app' }],
  creator: 'Exito',
  publisher: 'Exito',
  category: 'ecommerce',
  classification: 'Business',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon0.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon1.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Exito - Tu tienda online de confianza',
    description:
      'Descubre los mejores productos en Exito con las mejores ofertas y envío gratis.',
    url: '/',
    siteName: 'Exito',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Exito - Tu tienda online de confianza',
        type: 'image/png',
      },
    ],
    locale: 'es_CO',
    type: 'website',
    countryName: 'Colombia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exito - Tu tienda online de confianza',
    description: 'Descubre los mejores productos con las mejores ofertas.',
    images: {
      url: '/og.png',
      alt: 'Exito - Tu tienda online de confianza',
    },
    creator: '@exito_colombia',
    site: '@exito_colombia',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-CO': '/',
      es: '/es',
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
    yandex: 'yandex-verification-code', // Replace with actual verification code
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#ffffff',
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
  },
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Éxito Store" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fakestoreapi.com" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense
              fallback={
                <header className="h-16 border-b bg-background">
                  <div className="container mx-auto flex h-full items-center justify-between px-4">
                    <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                </header>
              }
            >
              <Header />
            </Suspense>
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
          <WebVitals />
        </Providers>
      </body>
    </html>
  );
}
