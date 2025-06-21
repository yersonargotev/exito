/**
 * @jest-environment jsdom
 */

// Mock the modules before importing the API
jest.mock('../config', () => ({
  API_CONFIG: {
    USE_LOCAL_DATA: true,
  },
}));

jest.mock('../data-utils', () => ({
  LocalDataOperations: {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    getCategories: jest.fn(),
    searchProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    getProductsPaginated: jest.fn(),
  },
}));

jest.mock('../remote-api', () => ({
  RemoteDataOperations: {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    getCategories: jest.fn(),
    searchProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    getProductsPaginated: jest.fn(),
  },
}));

import {
  LocalAPI,
  RemoteAPI,
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  getProductsPaginated,
  searchProducts,
} from '../api';
import type { Product, ProductsPaginationParams } from '../types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'A test product 1',
    category: 'electronics',
    image: 'https://example.com/image1.jpg',
    rating: {
      rate: 4.5,
      count: 100,
    },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 39.99,
    description: 'A test product 2',
    category: 'clothing',
    image: 'https://example.com/image2.jpg',
    rating: {
      rate: 3.8,
      count: 50,
    },
  },
];

const mockCategories = ['electronics', 'clothing', 'books'];

const mockPaginatedResponse = {
  data: mockProducts,
  nextCursor: 2,
  hasNextPage: true,
  totalCount: 2,
};

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch and return products successfully', async () => {
      // Mock the data operations to return products
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getAllProducts.mockResolvedValue(mockProducts);

      const result = await getProducts();

      expect(result).toEqual(mockProducts);
    });

    it('should handle errors properly', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getAllProducts.mockRejectedValue(
        new Error('Failed to fetch products'),
      );

      await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductById', () => {
    it('should fetch and return product by ID successfully', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductById.mockResolvedValue(mockProducts[0]);

      const result = await getProductById(1);

      expect(LocalDataOperations.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProducts[0]);
    });

    it('should throw error when product not found', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductById.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(getProductById(999)).rejects.toThrow('Product not found');
    });
  });

  describe('getCategories', () => {
    it('should fetch and return categories successfully', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getCategories.mockResolvedValue(mockCategories);

      const result = await getCategories();

      expect(result).toEqual(mockCategories);
    });

    it('should handle errors properly', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getCategories.mockRejectedValue(
        new Error('Failed to fetch categories'),
      );

      await expect(getCategories()).rejects.toThrow(
        'Failed to fetch categories',
      );
    });
  });

  describe('searchProducts', () => {
    it('should search and return filtered products', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.searchProducts.mockResolvedValue([mockProducts[0]]);

      const result = await searchProducts('Test Product 1');

      expect(LocalDataOperations.searchProducts).toHaveBeenCalledWith(
        'Test Product 1',
      );
      expect(result).toEqual([mockProducts[0]]);
    });

    it('should return empty array when no matches found', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.searchProducts.mockResolvedValue([]);

      const result = await searchProducts('Nonexistent Product');

      expect(result).toHaveLength(0);
    });
  });

  describe('getProductsByCategory', () => {
    it('should filter products by category', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductsByCategory.mockResolvedValue([
        mockProducts[0],
      ]);

      const result = await getProductsByCategory('electronics');

      expect(LocalDataOperations.getProductsByCategory).toHaveBeenCalledWith(
        'electronics',
      );
      expect(result).toEqual([mockProducts[0]]);
    });

    it('should return empty array when category not found', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductsByCategory.mockResolvedValue([]);

      const result = await getProductsByCategory('nonexistent' as any);

      expect(result).toHaveLength(0);
    });
  });

  describe('getProductsPaginated', () => {
    it('should return paginated products', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductsPaginated.mockResolvedValue(
        mockPaginatedResponse,
      );

      const params: ProductsPaginationParams = {
        pageParam: 1,
        limit: 2,
      };

      const result = await getProductsPaginated(params);

      expect(LocalDataOperations.getProductsPaginated).toHaveBeenCalledWith(
        params,
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle pagination with filters', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getProductsPaginated.mockResolvedValue({
        ...mockPaginatedResponse,
        data: [mockProducts[0]],
        totalCount: 1,
      });

      const params: ProductsPaginationParams = {
        pageParam: 1,
        limit: 10,
        category: 'electronics',
        search: 'test',
      };

      const result = await getProductsPaginated(params);

      expect(LocalDataOperations.getProductsPaginated).toHaveBeenCalledWith(
        params,
      );
      expect(result.data).toEqual([mockProducts[0]]);
    });
  });

  describe('LocalAPI', () => {
    it('should provide direct access to local operations', async () => {
      const { LocalDataOperations } = require('../data-utils');
      LocalDataOperations.getAllProducts.mockResolvedValue(mockProducts);

      const result = await LocalAPI.getProducts();

      expect(LocalDataOperations.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('RemoteAPI', () => {
    it('should provide direct access to remote operations', async () => {
      const { RemoteDataOperations } = require('../remote-api');
      RemoteDataOperations.getAllProducts.mockResolvedValue(mockProducts);

      const result = await RemoteAPI.getProducts();

      expect(RemoteDataOperations.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });
});
