import '@/styles/globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Exito - Tu tienda online de confianza',
    template: '%s | Exito',
  },
  description:
    'Descubre los mejores productos en Exito. Electrónicos, ropa, joyería y más con las mejores ofertas y envío gratis en compras superiores a $150.000 COP.',
  keywords: [
    'tienda online',
    'electronics',
    'ropa',
    'joyería',
    'ofertas',
    'colombia',
    'exito',
  ],
  authors: [{ name: 'Exito' }],
  creator: 'Exito',
  publisher: 'Exito',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Exito - Tu tienda online de confianza',
    description:
      'Descubre los mejores productos en Exito con las mejores ofertas.',
    url: 'https://exito-store.vercel.app',
    siteName: 'Exito',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Exito - Tu tienda online de confianza',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exito - Tu tienda online de confianza',
    description: 'Descubre los mejores productos con las mejores ofertas.',
    images: ['/og.png'],
    creator: '@exito_colombia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder for Google Search Console
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
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Éxito Store" />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense
              fallback={<div className="h-16 border-b bg-background" />}
            >
              <Header />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
