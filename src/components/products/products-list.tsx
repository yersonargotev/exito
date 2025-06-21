import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductCard } from '@/components/ui/product-card';
import { useInfiniteProductsWithAutoLoad } from '@/hooks/use-products';
import type { ProductCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface ProductsListProps {
  category?: ProductCategory;
  search?: string;
  className?: string;
}

export function ProductsList({
  category,
  search,
  className,
}: ProductsListProps) {
  const {
    products,
    totalCount,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    refetch,
  } = useInfiniteProductsWithAutoLoad({
    category,
    search,
    limit: 8,
  });

  // Ref para el elemento que activa el scroll infinito
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para detectar cuando el usuario llega al final
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Cargar más contenido 100px antes de llegar al final
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Estado de carga inicial
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <ErrorMessage
        title="Error al cargar productos"
        message={error?.message || 'Ocurrió un error inesperado'}
        onRetry={() => refetch()}
        className="mx-auto max-w-md"
      />
    );
  }

  // Sin productos
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 font-medium text-lg">
            No se encontraron productos
          </h3>
          <p className="text-sm">
            {search
              ? `No hay productos que coincidan con "${search}"`
              : category
                ? `No hay productos en la categoría "${category}"`
                : 'No hay productos disponibles'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {products.length} de {totalCount} productos
          {search && ` para "${search}"`}
          {category && ` en ${category}`}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Elemento trigger para infinite scroll */}
      <div ref={loadMoreRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <LoadingSpinner text="Cargando más productos..." />
        )}
        {!hasNextPage && products.length > 0 && (
          <p className="text-muted-foreground text-sm">
            Has llegado al final de la lista
          </p>
        )}
      </div>
    </div>
  );
}
