'use client';

import { ProductsFilters } from '@/components/products/products-filters';
import { ProductsList } from '@/components/products/products-list';
import type { ProductCategory } from '@/lib/types';
import { useState } from 'react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | undefined>(
    undefined,
  );

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleCategoryChange = (newCategory: ProductCategory | undefined) => {
    setCategory(newCategory);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className='relative mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center md:p-16'>
        <h1 className="mb-4 font-bold text-4xl tracking-tight md:text-6xl">
          Bienvenido a <span className="text-primary">Éxito Store</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Descubre los mejores productos con la calidad y servicio que te
          mereces. Tu satisfacción es nuestra prioridad.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              // Scroll suave hacia la sección de productos
              const productsSection =
                document.getElementById('products-section');
              productsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className='rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Ver Productos
          </button>
          <button
            type="button"
            onClick={() => {
              // Aplicar filtro de ofertas (productos con precio < 50)
              setSearch('');
              setCategory(undefined);
              // En una implementación real, podríamos tener un filtro específico para ofertas
            }}
            className='rounded-lg border border-border px-8 py-3 font-semibold transition-colors hover:bg-muted'
          >
            Ofertas Especiales
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="space-y-8">
        {/* Título de la sección */}
        <div className="text-center">
          <h2 className="mb-4 font-bold text-3xl">Nuestros Productos</h2>
          <p className='mx-auto max-w-2xl text-muted-foreground'>
            Explora nuestra amplia selección de productos de calidad. Utiliza
            los filtros para encontrar exactamente lo que buscas.
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <ProductsFilters
          search={search}
          category={category}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Lista de productos con infinite scroll */}
        <ProductsList search={search} category={category} />
      </section>

      {/* Features Section */}
      <section className="mt-24">
        <h2 className="mb-8 text-center font-bold text-3xl">
          ¿Por qué elegir Éxito Store?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🚚</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Envío Gratis</h3>
            <p className="text-muted-foreground text-sm">
              Envío gratuito en compras superiores a $100.000
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Compra Segura</h3>
            <p className="text-muted-foreground text-sm">
              Tus datos y pagos están protegidos con la mejor tecnología
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Garantía de Calidad</h3>
            <p className="text-muted-foreground text-sm">
              Productos originales con garantía del fabricante
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 text-center">
        <div className="rounded-lg bg-primary/5 p-8 md:p-12">
          <h2 className="mb-4 font-bold text-3xl">
            ¿Listo para empezar a comprar?
          </h2>
          <p className='mx-auto mb-6 max-w-xl text-muted-foreground'>
            Únete a miles de clientes satisfechos que ya disfrutan de nuestros
            productos y servicio excepcional.
          </p>
          <button
            type="button"
            onClick={() => {
              const productsSection =
                document.getElementById('products-section');
              productsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className='rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Explorar Productos
          </button>
        </div>
      </section>
    </div>
  );
}
