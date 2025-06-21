'use client';

import { ProductsFilters } from '@/components/products/products-filters';
import { ProductsList } from '@/components/products/products-list';
import type { ProductCategory } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function HomePageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<ProductCategory | undefined>(
        undefined,
    );

    // Sync state with URL parameters on mount and when params change
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlCategory = searchParams.get('category') as ProductCategory | null;

        setSearch(urlSearch);
        setCategory(urlCategory || undefined);
    }, [searchParams]);

    // Update URL when search changes
    const handleSearchChange = useCallback((newSearch: string) => {
        setSearch(newSearch);

        const params = new URLSearchParams(searchParams);
        if (newSearch.trim()) {
            params.set('search', newSearch.trim());
        } else {
            params.delete('search');
        }

        // Keep category if it exists
        if (category) {
            params.set('category', category);
        }

        const newUrl = params.toString() ? `/?${params.toString()}` : '/';
        router.replace(newUrl, { scroll: false });
    }, [router, searchParams, category]);

    // Update URL when category changes
    const handleCategoryChange = useCallback((newCategory: ProductCategory | undefined) => {
        setCategory(newCategory);

        const params = new URLSearchParams(searchParams);
        if (newCategory) {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }

        // Keep search if it exists
        if (search.trim()) {
            params.set('search', search.trim());
        }

        const newUrl = params.toString() ? `/?${params.toString()}` : '/';
        router.replace(newUrl, { scroll: false });
    }, [router, searchParams, search]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSearch('');
        setCategory(undefined);
        router.replace('/', { scroll: false });
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* Hero Section */}
            <section className="relative mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center sm:mb-12 sm:p-8 md:p-16">
                <h1 className="mb-4 font-bold text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                    Bienvenido a <span className="text-primary">Éxito Store</span>
                </h1>
                <p className="mx-auto mb-6 max-w-2xl px-2 text-muted-foreground text-sm sm:mb-8 sm:text-base md:text-lg">
                    Descubre los mejores productos con la calidad y servicio que te
                    mereces. Tu satisfacción es nuestra prioridad.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            // Scroll suave hacia la sección de productos
                            const productsSection =
                                document.getElementById('products-section');
                            productsSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/90 sm:px-8 sm:py-3 sm:text-base"
                    >
                        Ver Productos
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            // Clear current filters and show all products
                            clearAllFilters();
                            // Scroll to products section
                            setTimeout(() => {
                                const productsSection =
                                    document.getElementById('products-section');
                                productsSection?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="rounded-lg border border-border px-6 py-2 font-semibold text-sm transition-colors hover:bg-muted sm:px-8 sm:py-3 sm:text-base"
                    >
                        Ofertas Especiales
                    </button>
                </div>
            </section>

            {/* Products Section */}
            <section id="products-section" className="space-y-6 sm:space-y-8">
                {/* Título de la sección */}
                <div className="text-center">
                    <h2 className="mb-4 font-bold text-2xl sm:text-3xl">
                        Nuestros Productos
                    </h2>
                    <p className="mx-auto max-w-2xl px-2 text-muted-foreground text-sm sm:text-base">
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
            <section className="mt-16 sm:mt-24">
                <h2 className="mb-6 text-center font-bold text-2xl sm:mb-8 sm:text-3xl">
                    ¿Por qué elegir Éxito Store?
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                                <span className="text-xl sm:text-2xl">🚚</span>
                            </div>
                        </div>
                        <h3 className="mb-2 font-semibold text-sm sm:text-base">
                            Envío Gratis
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Envío gratuito en compras superiores a $100.000
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                                <span className="text-xl sm:text-2xl">🔒</span>
                            </div>
                        </div>
                        <h3 className="mb-2 font-semibold text-sm sm:text-base">
                            Compra Segura
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Tus datos y pagos están protegidos con la mejor tecnología
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                                <span className="text-xl sm:text-2xl">🎯</span>
                            </div>
                        </div>
                        <h3 className="mb-2 font-semibold text-sm sm:text-base">
                            Garantía de Calidad
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Productos originales con garantía del fabricante
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-16 text-center sm:mt-24">
                <div className="rounded-lg bg-primary/5 p-6 sm:p-8 md:p-12">
                    <h2 className="mb-4 font-bold text-2xl sm:text-3xl">
                        ¿Listo para empezar a comprar?
                    </h2>
                    <p className="mx-auto mb-6 max-w-xl px-2 text-muted-foreground text-sm sm:text-base">
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
                        className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/90 sm:px-8 sm:py-3 sm:text-base"
                    >
                        Explorar Productos
                    </button>
                </div>
            </section>
        </div>
    );
}
