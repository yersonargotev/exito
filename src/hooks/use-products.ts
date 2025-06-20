import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@/lib/api';
import type { ApiError, ProductCategory, ProductFilters } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

// Utility function to handle API errors
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: 'API_ERROR',
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR',
  };
};

// Hook para obtener todos los productos
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => data ?? [],
  });
}

// Hook para obtener un producto por ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook para obtener productos por categoría
export function useProductsByCategory(category: ProductCategory) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => data ?? [],
  });
}

// Hook para obtener todas las categorías
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos (las categorías cambian menos)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => data ?? [],
  });
}

// Hook para buscar productos
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2, // Solo buscar si hay al menos 2 caracteres
    staleTime: 2 * 60 * 1000, // 2 minutos (búsquedas son más dinámicas)
    retry: 2, // Menos reintentos para búsquedas
    retryDelay: 1000,
    select: (data) => data ?? [],
  });
}

// Hook compuesto para obtener datos de productos con estado de carga combinado
export function useProductsWithCategories() {
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();

  return {
    products: productsQuery.data,
    categories: categoriesQuery.data,
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    isError: productsQuery.isError || categoriesQuery.isError,
    error: productsQuery.error || categoriesQuery.error,
    refetch: () => {
      productsQuery.refetch();
      categoriesQuery.refetch();
    },
  };
}

// Hook para filtrar productos por múltiples criterios
export function useFilteredProducts(filters: ProductFilters) {
  const { category, search, priceRange, rating, sortBy, sortOrder } = filters;

  // Decidir qué query usar basado en los filtros
  const shouldUseCategory = category && !search;
  const shouldUseSearch = search && search.length >= 2;

  const allProductsQuery = useProducts();
  const categoryProductsQuery = useProductsByCategory(
    category as ProductCategory,
  );
  const searchProductsQuery = useSearchProducts(search || '');

  // Seleccionar la query apropiada
  let query = allProductsQuery;
  if (shouldUseCategory) {
    query = categoryProductsQuery;
  } else if (shouldUseSearch) {
    query = searchProductsQuery;
  }

  // Memoizar la función de filtrado para evitar recálculos innecesarios
  const filteredProducts = useCallback(() => {
    if (!query.data) return [];

    let result = [...query.data];

    // Aplicar filtros
    if (priceRange) {
      result = result.filter((product) => {
        if (priceRange.min && product.price < priceRange.min) return false;
        if (priceRange.max && product.price > priceRange.max) return false;
        return true;
      });
    }

    if (rating?.min) {
      result = result.filter(
        (product) => product.rating.rate >= (rating.min || 0),
      );
    }

    // Aplicar ordenamiento
    if (sortBy) {
      result.sort((a, b) => {
        let valueA: number | string;
        let valueB: number | string;

        switch (sortBy) {
          case 'price':
            valueA = a.price;
            valueB = b.price;
            break;
          case 'rating':
            valueA = a.rating.rate;
            valueB = b.rating.rate;
            break;
          case 'title':
            valueA = a.title.toLowerCase();
            valueB = b.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (sortOrder === 'desc') {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      });
    }

    return result;
  }, [query.data, priceRange, rating, sortBy, sortOrder]);

  return {
    ...query,
    data: filteredProducts(),
  };
}

// Hook para manejo centralizado de errores
export function useApiError() {
  const handleError = useCallback((error: unknown) => {
    const apiError = handleApiError(error);
    console.error('API Error:', apiError);
    return apiError;
  }, []);

  return { handleError };
}
