import type {
  PaginatedProductsResponse,
  Product,
  ProductCategory,
  ProductsPaginationParams,
} from '@/lib/types';
import { API_CONFIG } from './config';
import { LocalDataOperations } from './data-utils';
import { RemoteDataOperations } from './remote-api';

// Determinar qué operaciones usar basado en la configuración
const getDataOperations = () => {
  return API_CONFIG.USE_LOCAL_DATA ? LocalDataOperations : RemoteDataOperations;
};

// Funciones públicas del API que determinan automáticamente la fuente de datos
export const getProducts = (): Promise<Product[]> => {
  return getDataOperations().getAllProducts();
};

export const getProductsPaginated = (
  params: ProductsPaginationParams,
): Promise<PaginatedProductsResponse> => {
  return getDataOperations().getProductsPaginated(params);
};

export const getProductById = (id: number): Promise<Product> => {
  return getDataOperations().getProductById(id);
};

export const getProductsByCategory = (
  category: ProductCategory,
): Promise<Product[]> => {
  return getDataOperations().getProductsByCategory(category);
};

export const getCategories = (): Promise<string[]> => {
  return getDataOperations().getCategories();
};

export const searchProducts = (query: string): Promise<Product[]> => {
  return getDataOperations().searchProducts(query);
};

// Funciones específicas para forzar el uso de datos locales o remotos
export const LocalAPI = {
  getProducts: LocalDataOperations.getAllProducts,
  getProductsPaginated: LocalDataOperations.getProductsPaginated,
  getProductById: LocalDataOperations.getProductById,
  getProductsByCategory: LocalDataOperations.getProductsByCategory,
  getCategories: LocalDataOperations.getCategories,
  searchProducts: LocalDataOperations.searchProducts,
};

export const RemoteAPI = {
  getProducts: RemoteDataOperations.getAllProducts,
  getProductsPaginated: RemoteDataOperations.getProductsPaginated,
  getProductById: RemoteDataOperations.getProductById,
  getProductsByCategory: RemoteDataOperations.getProductsByCategory,
  getCategories: RemoteDataOperations.getCategories,
  searchProducts: RemoteDataOperations.searchProducts,
};

// Re-exportar tipos para facilitar el uso
export type {
  Product,
  ProductCategory,
  PaginatedProductsResponse,
  ProductsPaginationParams,
} from '@/lib/types';
