import type {
  PaginatedProductsResponse,
  Product,
  ProductCategory,
  ProductsPaginationParams,
} from '@/lib/types';
import { API_CONFIG } from './config';
import { applyFilters, paginateProducts } from './data-utils';

class RemoteApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.fetchFromApi<Product[]>('/products');
  }

  async getProductsPaginated(
    params: ProductsPaginationParams,
  ): Promise<PaginatedProductsResponse> {
    const {
      pageParam = 0,
      limit = API_CONFIG.PAGINATION.DEFAULT_LIMIT,
      category,
      search,
    } = params;

    // Para API real, necesitaríamos adaptar según sus capacidades de paginación
    // Como la FakeStore API no soporta paginación real, simulamos con todos los productos
    const allProducts = await this.getAllProducts();
    const filteredData = applyFilters(allProducts, category, search);

    return paginateProducts(filteredData, pageParam, limit);
  }

  async getProductById(id: number): Promise<Product> {
    return this.fetchFromApi<Product>(`/products/${id}`);
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return this.fetchFromApi<Product[]>(`/products/category/${category}`);
  }

  async getCategories(): Promise<string[]> {
    return this.fetchFromApi<string[]>('/products/categories');
  }

  async searchProducts(query: string): Promise<Product[]> {
    // Para API real, obtenemos todos los productos y filtramos en el cliente
    const products = await this.getAllProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm),
    );
  }
}

// Operaciones con API remota
export const RemoteDataOperations = {
  client: new RemoteApiClient(),

  getAllProducts: () => RemoteDataOperations.client.getAllProducts(),
  getProductsPaginated: (params: ProductsPaginationParams) =>
    RemoteDataOperations.client.getProductsPaginated(params),
  getProductById: (id: number) =>
    RemoteDataOperations.client.getProductById(id),
  getProductsByCategory: (category: ProductCategory) =>
    RemoteDataOperations.client.getProductsByCategory(category),
  getCategories: () => RemoteDataOperations.client.getCategories(),
  searchProducts: (query: string) =>
    RemoteDataOperations.client.searchProducts(query),
};
