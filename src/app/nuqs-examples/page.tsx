'use client';

import { Button } from '@/components/ui/button';
import { searchParsers } from '@/lib/search-params';
import { useQueryState, useQueryStates } from 'nuqs';
import { Suspense } from 'react';

// Example component demonstrating basic useQueryState usage
function SearchForm() {
    const [query, setQuery] = useQueryState('q', searchParsers.q);
    const [category, setCategory] = useQueryState(
        'category',
        searchParsers.category,
    );
    const [inStock, setInStock] = useQueryState('inStock', searchParsers.inStock);

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-lg">Search Form</h3>

            <div>
                <label htmlFor="search" className="mb-1 block font-medium text-sm">
                    Search Query
                </label>
                <input
                    id="search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value || null)}
                    placeholder="Search products..."
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="category" className="mb-1 block font-medium text-sm">
                    Category
                </label>
                <select
                    id="category"
                    value={category ?? ''}
                    onChange={(e) => setCategory(e.target.value || null)}
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="in-stock"
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked || null)}
                    className="rounded"
                />
                <label htmlFor="in-stock" className="font-medium text-sm">
                    In Stock Only
                </label>
            </div>

            <Button
                onClick={() => {
                    setQuery(null);
                    setCategory(null);
                    setInStock(null);
                }}
                variant="outline"
            >
                Clear Filters
            </Button>
        </div>
    );
}

// Example component demonstrating useQueryStates for multiple params
function ProductFilters() {
    const [filters, setFilters] = useQueryStates({
        sortBy: searchParsers.sortBy,
        sortOrder: searchParsers.sortOrder,
        view: searchParsers.view,
        page: searchParsers.page,
    });

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters({
            sortBy: sortBy as any,
            sortOrder,
            page: 1, // Reset to first page when sorting changes
        });
    };

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-lg">Product Filters</h3>

            <div className="flex items-center gap-4">
                <div>
                    <label htmlFor="sort-by" className="mb-1 block font-medium text-sm">
                        Sort By
                    </label>
                    <select
                        id="sort-by"
                        value={filters.sortBy}
                        onChange={(e) =>
                            handleSortChange(e.target.value, filters.sortOrder)
                        }
                        className="rounded-md border px-3 py-2"
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="date">Date</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="sort-order"
                        className="mb-1 block font-medium text-sm"
                    >
                        Order
                    </label>
                    <select
                        id="sort-order"
                        value={filters.sortOrder}
                        onChange={(e) =>
                            handleSortChange(filters.sortBy, e.target.value as 'asc' | 'desc')
                        }
                        className="rounded-md border px-3 py-2"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="view-type" className="mb-1 block font-medium text-sm">
                        View
                    </label>
                    <select
                        id="view-type"
                        value={filters.view}
                        onChange={(e) => setFilters({ view: e.target.value as any })}
                        className="rounded-md border px-3 py-2"
                    >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2">
                <span className="text-gray-600 text-sm">Page: {filters.page}</span>
                <Button onClick={() => setFilters({ page: filters.page + 1 })}>
                    Next Page
                </Button>
                {filters.page > 1 && (
                    <Button onClick={() => setFilters({ page: filters.page - 1 })}>
                        Previous Page
                    </Button>
                )}
            </div>
        </div>
    );
}

// Example component with server interaction (shallow: false)
function ServerInteractionExample() {
    const [query, setQuery] = useQueryState('q', {
        ...searchParsers.q,
        shallow: false, // This will notify the server on changes
    });

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold text-lg">Server Interaction Example</h3>
            <p className="text-gray-600 text-sm">
                Changes to this input will trigger server-side updates
            </p>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value || null)}
                placeholder="Search with server updates..."
                className="w-full rounded-md border px-3 py-2"
            />
        </div>
    );
}

// Main component with Suspense boundaries for client components
export default function NuqsExamplesPage() {
    return (
        <div className="container mx-auto space-y-8 py-8">
            <div>
                <h1 className="mb-2 font-bold text-3xl">Nuqs Examples</h1>
                <p className="text-gray-600">
                    Demonstrating best practices for using nuqs in Next.js App Router
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Suspense fallback={<div>Loading search form...</div>}>
                    <SearchForm />
                </Suspense>

                <Suspense fallback={<div>Loading filters...</div>}>
                    <ProductFilters />
                </Suspense>
            </div>

            <Suspense fallback={<div>Loading server example...</div>}>
                <ServerInteractionExample />
            </Suspense>
        </div>
    );
}
