import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCategories } from '@/hooks/use-products';
import type { ProductCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface ProductsFiltersProps {
    search: string;
    category?: ProductCategory;
    onSearchChange: (search: string) => void;
    onCategoryChange: (category: ProductCategory | undefined) => void;
    className?: string;
}

export function ProductsFilters({
    search,
    category,
    onSearchChange,
    onCategoryChange,
    className,
}: ProductsFiltersProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const handleClearFilters = () => {
        onSearchChange('');
        onCategoryChange(undefined);
    };

    const hasActiveFilters = search || category;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className='w-full rounded-lg border border-border bg-background py-2 pr-4 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className='-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 text-muted-foreground hover:text-foreground'
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Botón de filtros en móvil */}
                <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        'flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted',
                        'md:hidden',
                        isFilterOpen && 'bg-muted',
                    )}
                >
                    <Filter className="h-4 w-4" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                            {(search ? 1 : 0) + (category ? 1 : 0)}
                        </span>
                    )}
                </button>

                {/* Botón limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className='flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground'
                    >
                        <X className="h-4 w-4" />
                        Limpiar filtros
                    </button>
                )}

                {/* Categorías - Desktop */}
                <div className={cn('flex flex-wrap gap-2', 'hidden md:flex')}>
                    {categoriesLoading ? (
                        <LoadingSpinner size="sm" text="Cargando categorías..." />
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => onCategoryChange(undefined)}
                                className={cn(
                                    'rounded-full border px-3 py-1 text-sm transition-colors',
                                    !category
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background hover:bg-muted',
                                )}
                            >
                                Todas
                            </button>
                            {categories?.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onCategoryChange(cat as ProductCategory)}
                                    className={cn(
                                        'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
                                        category === cat
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background hover:bg-muted',
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Categorías - Mobile (desplegable) */}
            {isFilterOpen && (
                <div className="rounded-lg border border-border bg-background p-4 md:hidden">
                    <h3 className='mb-3 font-medium'>Categorías</h3>
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                onCategoryChange(undefined);
                                setIsFilterOpen(false);
                            }}
                            className={cn(
                                'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                                !category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted',
                            )}
                        >
                            Todas las categorías
                        </button>
                        {categoriesLoading ? (
                            <div className="py-4">
                                <LoadingSpinner size="sm" text="Cargando categorías..." />
                            </div>
                        ) : (
                            categories?.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        onCategoryChange(cat as ProductCategory);
                                        setIsFilterOpen(false);
                                    }}
                                    className={cn(
                                        'block w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition-colors',
                                        category === cat
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted',
                                    )}
                                >
                                    {cat}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Filtros activos (chips) */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {search && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm">
                            <span>Búsqueda: "{search}"</span>
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className='rounded-full p-1 hover:bg-primary/20'
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {category && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm">
                            <span className="capitalize">Categoría: {category}</span>
                            <button
                                type="button"
                                onClick={() => onCategoryChange(undefined)}
                                className='rounded-full p-1 hover:bg-primary/20'
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
