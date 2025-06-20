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
