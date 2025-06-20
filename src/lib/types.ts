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
