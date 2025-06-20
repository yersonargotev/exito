import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../api';
import type { ProductCategory } from '../types';

// Hook para obtener todos los productos
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un producto por ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener productos por categoría
export function useProductsByCategory(category: ProductCategory) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener todas las categorías
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos (las categorías cambian menos)
  });
}

// Hook para buscar productos
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2, // Solo buscar si hay al menos 2 caracteres
    staleTime: 2 * 60 * 1000, // 2 minutos (búsquedas son más dinámicas)
  });
}
