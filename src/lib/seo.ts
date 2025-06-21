import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  url?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const defaultSEO: SEOConfig = {
  title: 'Éxito Store - Tu tienda online de confianza',
  description:
    'Descubre los mejores productos en Éxito Store. Electrónicos, ropa, joyería y más con las mejores ofertas y envío gratis.',
  keywords: [
    'tienda online',
    'ecommerce',
    'electronics',
    'ropa',
    'joyería',
    'ofertas',
    'colombia',
    'exito',
    'compras online',
    'envío gratis',
  ],
  author: 'Éxito Store',
  type: 'website',
  image: '/og.png',
};

export function generateSEOMetadata(config: Partial<SEOConfig> = {}): Metadata {
  const seo = { ...defaultSEO, ...config };

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    creator: seo.author,
    publisher: 'Éxito Store',

    // Robots
    robots: {
      index: !seo.noIndex,
      follow: !seo.noIndex,
      googleBot: {
        index: !seo.noIndex,
        follow: !seo.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: seo.type === 'article' ? 'article' : 'website',
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: 'Éxito Store',
      images: seo.image
        ? [
            {
              url: seo.image,
              width: 1200,
              height: 630,
              alt: seo.title,
              type: 'image/png',
            },
          ]
        : undefined,
      locale: 'es_CO',
      countryName: 'Colombia',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : undefined,
      creator: '@exitostore',
      site: '@exitostore',
    },

    // Manifest
    manifest: '/manifest.json',

    // App-specific
    applicationName: 'Éxito Store',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Éxito Store',
    },

    // Verification
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      me: ['yerson@exitostore.com'],
    },

    // Category
    category: 'technology',

    // Classification
    classification: 'E-commerce, Shopping, Retail',

    // Other
    metadataBase: new URL('https://exito-nine.vercel.app'),
    alternates: {
      canonical: seo.url,
      languages: {
        'es-CO': '/es',
        'en-US': '/en',
      },
    },
  };

  return metadata;
}

// Configuraciones específicas por tipo de página
export const homeSEO: Partial<SEOConfig> = {
  title:
    'Éxito Store - Tu tienda online de confianza | Electrónicos, Ropa y Más',
  description:
    'Descubre miles de productos en Éxito Store. Electrónicos de última tecnología, ropa de moda, joyería exclusiva y más. Envío gratis en compras superiores a $150.000. ¡Compra ahora!',
  keywords: [
    'tienda online colombia',
    'ecommerce colombia',
    'electronics bogotá',
    'ropa online',
    'joyería colombia',
    'ofertas especiales',
    'compras seguras',
    'envío gratis colombia',
  ],
};

export const productSEO = (product: {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}): Partial<SEOConfig> => ({
  title: `${product.title} - Éxito Store | Mejor Precio Online`,
  description: `${product.description.slice(0, 150)}... ¡Cómpralo ahora por $${product.price.toLocaleString('es-CO')} con envío gratis! Categoría: ${product.category}`,
  type: 'product',
  image: product.image,
  keywords: [
    product.title.toLowerCase(),
    product.category,
    'comprar online',
    'mejor precio',
    'envío gratis',
    'exito store',
  ],
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'Éxito Store',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Éxito Store',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100',
    },
  },
});

export const categorySEO = (category: string): Partial<SEOConfig> => ({
  title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Éxito Store | Mejor Selección Online`,
  description: `Explora nuestra amplia selección de ${category}. Los mejores productos, precios competitivos y envío gratis. ¡Encuentra exactamente lo que buscas!`,
  keywords: [
    category,
    `${category} colombia`,
    `comprar ${category}`,
    `ofertas ${category}`,
    'exito store',
    'envío gratis',
  ],
});

export const cartSEO: Partial<SEOConfig> = {
  title: 'Carrito de Compras - Éxito Store | Finaliza tu Pedido',
  description:
    'Revisa tu carrito de compras y finaliza tu pedido de manera segura. Envío gratis en compras superiores a $150.000.',
  noIndex: true, // No indexar páginas del carrito
};

export const checkoutSEO: Partial<SEOConfig> = {
  title: 'Checkout Seguro - Éxito Store | Finalizar Compra',
  description:
    'Completa tu compra de manera segura con nuestro checkout protegido. Múltiples métodos de pago disponibles.',
  noIndex: true, // No indexar páginas de checkout
};

// Schema.org structured data para diferentes páginas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Éxito Store',
  url: 'https://exito-nine.vercel.app',
  logo: 'https://exito-nine.vercel.app/og.png',
  description:
    'Tu tienda online de confianza para electrónicos, ropa, joyería y más.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 123 #45-67',
    addressLocality: 'Bogotá',
    addressRegion: 'Cundinamarca',
    postalCode: '110111',
    addressCountry: 'CO',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+57-1-234-5678',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [
    'https://facebook.com/exitostore',
    'https://twitter.com/exitostore',
    'https://instagram.com/exitostore',
    'https://linkedin.com/company/exitostore',
  ],
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Éxito Store',
  url: 'https://exito-nine.vercel.app',
  description:
    'Tu tienda online de confianza para electrónicos, ropa, joyería y más.',
  publisher: {
    '@type': 'Organization',
    name: 'Éxito Store',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://exito-nine.vercel.app/?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
