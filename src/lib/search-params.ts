import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

// Define parsers for common search parameters
export const searchParsers = {
  // Search query
  q: parseAsString.withDefault(''),

  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),

  // Filters
  category: parseAsString,
  brand: parseAsString,
  priceMin: parseAsInteger,
  priceMax: parseAsInteger,
  inStock: parseAsBoolean.withDefault(false),

  // Sorting
  sortBy: parseAsStringEnum([
    'price',
    'name',
    'rating',
    'date',
  ] as const).withDefault('name'),
  sortOrder: parseAsStringEnum(['asc', 'desc'] as const).withDefault('asc'),

  // Multiple selections
  tags: parseAsArrayOf(parseAsString),

  // View preferences
  view: parseAsStringEnum(['grid', 'list'] as const).withDefault('grid'),
};

// Create a search params cache for server components
export const searchParamsCache = createSearchParamsCache(searchParsers, {
  // Use shorter URL keys for cleaner URLs
  urlKeys: {
    q: 'q',
    page: 'p',
    limit: 'l',
    category: 'cat',
    brand: 'b',
    priceMin: 'min',
    priceMax: 'max',
    inStock: 'stock',
    sortBy: 'sort',
    sortOrder: 'order',
    tags: 'tags',
    view: 'v',
  },
});

// Export for client components
export type SearchParams = keyof typeof searchParsers;
