export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Zustand Cart Store Types
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (productId: number) => CartItem | undefined;
  getItemQuantity: (productId: number) => number;
}

export type CartStore = CartState & CartActions;

export type ProductCategory =
  | "men's clothing"
  | "women's clothing"
  | 'electronics'
  | 'jewelery';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface SearchParams {
  query?: string;
  category?: ProductCategory;
  limit?: number;
  sort?: 'asc' | 'desc';
}

// API Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Query State Types for better typing with TanStack Query
export interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  refetch: () => void;
}

// Filter types for product filtering
export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
  sortBy?: 'price' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Pagination types for future use
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
