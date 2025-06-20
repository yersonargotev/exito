import { env } from '@/env';
import fakestoreData from '@/lib/fakestore.json';
import type { Product, ProductCategory } from '@/lib/types';

const API_BASE_URL = 'https://fakestoreapi.com';

// Configuración para determinar si usar datos locales o API remota
// Por defecto: desarrollo = local, producción = remoto
// Se puede forzar con la variable de entorno USE_LOCAL_DATA
const USE_LOCAL_DATA = env.USE_LOCAL_DATA
  ? env.USE_LOCAL_DATA === 'true'
  : env.NODE_ENV === 'development';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    if (USE_LOCAL_DATA) {
      // Simular delay de red para desarrollo
      await new Promise((resolve) => setTimeout(resolve, 200));
      return fakestoreData as Product[];
    }

    return this.fetchFromApi<Product[]>('/products');
  }

  // Obtener producto por ID
  async getProductById(id: number): Promise<Product> {
    if (USE_LOCAL_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const product = fakestoreData.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      return product as Product;
    }

    return this.fetchFromApi<Product>(`/products/${id}`);
  }

  // Obtener productos por categoría
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    if (USE_LOCAL_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return fakestoreData.filter((p) => p.category === category) as Product[];
    }

    return this.fetchFromApi<Product[]>(`/products/category/${category}`);
  }

  // Obtener todas las categorías
  async getCategories(): Promise<string[]> {
    if (USE_LOCAL_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const categories = [...new Set(fakestoreData.map((p) => p.category))];
      return categories;
    }

    return this.fetchFromApi<string[]>('/products/categories');
  }

  // Buscar productos (simulado en local, no disponible en API real)
  async searchProducts(query: string): Promise<Product[]> {
    if (USE_LOCAL_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const searchTerm = query.toLowerCase();
      return fakestoreData.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm),
      ) as Product[];
    }

    // Para API real, obtenemos todos los productos y filtramos en el cliente
    const products = await this.getProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm),
    );
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Funciones helper para uso directo
export const getProducts = () => apiClient.getProducts();
export const getProductById = (id: number) => apiClient.getProductById(id);
export const getProductsByCategory = (category: ProductCategory) =>
  apiClient.getProductsByCategory(category);
export const getCategories = () => apiClient.getCategories();
export const searchProducts = (query: string) =>
  apiClient.searchProducts(query);
