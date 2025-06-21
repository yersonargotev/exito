import '@/styles/globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Exito - E-commerce',
  description: 'Exito - E-commerce',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  openGraph: {
    title: 'Exito - E-commerce',
    description: 'Exito - E-commerce',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Exito - E-commerce',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exito - E-commerce',
    description: 'Exito - E-commerce',
    images: ['/og.png'],
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
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
