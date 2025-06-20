import fakestoreData from '@/lib/fakestore.json';
import type {
  PaginatedProductsResponse,
  Product,
  ProductCategory,
  ProductsPaginationParams,
} from '@/lib/types';
import { API_CONFIG } from './config';

// Función para simular delay de red
const simulateNetworkDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Filtrar productos por categoría
export const filterByCategory = (
  products: Product[],
  category: ProductCategory,
): Product[] => {
  return products.filter((p) => p.category === category);
};

// Filtrar productos por búsqueda
export const filterBySearch = (
  products: Product[],
  search: string,
): Product[] => {
  const searchTerm = search.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm),
  );
};

// Aplicar todos los filtros a los productos
export const applyFilters = (
  products: Product[],
  category?: ProductCategory,
  search?: string,
): Product[] => {
  let filteredData = [...products];

  if (category) {
    filteredData = filterByCategory(filteredData, category);
  }

  if (search && search.length >= API_CONFIG.SEARCH.MIN_QUERY_LENGTH) {
    filteredData = filterBySearch(filteredData, search);
  }

  return filteredData;
};

// Aplicar paginación a un array de productos
export const paginateProducts = (
  products: Product[],
  pageParam: number,
  limit: number,
): PaginatedProductsResponse => {
  const startIndex = pageParam * limit;
  const endIndex = startIndex + limit;
  const paginatedData = products.slice(startIndex, endIndex);
  const hasNextPage = endIndex < products.length;

  return {
    data: paginatedData,
    nextCursor: hasNextPage ? pageParam + 1 : undefined,
    hasNextPage,
    totalCount: products.length,
  };
};

// Operaciones con datos locales
export const LocalDataOperations = {
  async getAllProducts(): Promise<Product[]> {
    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.LOCAL_DELAY);
    return fakestoreData as Product[];
  },

  async getProductsPaginated(
    params: ProductsPaginationParams,
  ): Promise<PaginatedProductsResponse> {
    const {
      pageParam = 0,
      limit = API_CONFIG.PAGINATION.DEFAULT_LIMIT,
      category,
      search,
    } = params;

    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.PAGINATED_DELAY);

    const allProducts = fakestoreData as Product[];
    const filteredData = applyFilters(allProducts, category, search);

    return paginateProducts(filteredData, pageParam, limit);
  },

  async getProductById(id: number): Promise<Product> {
    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.LOCAL_DELAY);
    const product = fakestoreData.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product as Product;
  },

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.LOCAL_DELAY);
    return filterByCategory(fakestoreData as Product[], category);
  },

  async getCategories(): Promise<string[]> {
    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.LOCAL_DELAY);
    const categories = [...new Set(fakestoreData.map((p) => p.category))];
    return categories;
  },

  async searchProducts(query: string): Promise<Product[]> {
    await simulateNetworkDelay(API_CONFIG.TIMEOUTS.LOCAL_DELAY);
    return filterBySearch(fakestoreData as Product[], query);
  },
};
