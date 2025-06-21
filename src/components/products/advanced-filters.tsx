'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/use-products';
import type { ProductFilters } from '@/lib/types';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface AdvancedFiltersProps {
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
    onClearFilters: () => void;
}

export function AdvancedFilters({
    filters,
    onFiltersChange,
    onClearFilters,
}: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: categories } = useCategories();

    const handlePriceChange = (field: 'min' | 'max', value: string) => {
        const numValue = value ? Number(value) : undefined;
        const newPriceRange = {
            ...filters.priceRange,
            [field]: numValue,
        };

        // Limpiar si ambos valores son undefined
        const priceRange =
            newPriceRange.min || newPriceRange.max ? newPriceRange : undefined;

        onFiltersChange({
            ...filters,
            priceRange,
        });
    };

    const handleRatingChange = (minRating: number) => {
        const rating =
            minRating === (filters.rating?.min || 0) ? undefined : { min: minRating };
        onFiltersChange({
            ...filters,
            rating,
        });
    };

    const hasActiveFilters = !!(
        filters.category ||
        filters.priceRange ||
        filters.rating ||
        (filters.sortBy && filters.sortBy !== 'title')
    );

    return (
        <div className="space-y-4">
            {/* Botón para abrir/cerrar filtros */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros avanzados
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-3 w-3" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {/* Panel de filtros */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleContent>
                    <div className="space-y-6 rounded-lg border border-border bg-card p-4">
                        {/* Categorías */}
                        <div>
                            <Label className="mb-3 font-medium text-sm">Categoría</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={!filters.category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() =>
                                        onFiltersChange({ ...filters, category: undefined })
                                    }
                                    className="justify-start"
                                >
                                    Todas
                                </Button>
                                {categories?.map((category) => (
                                    <Button
                                        key={category}
                                        variant={
                                            filters.category === category ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onFiltersChange({
                                                ...filters,
                                                category: category as any,
                                            })
                                        }
                                        className="justify-start capitalize"
                                    >
                                        {category.replace(/['"]/g, '')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Rango de precios */}
                        <div>
                            <Label className="mb-3 font-medium text-sm">
                                Rango de precio (USD)
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        placeholder="Mín"
                                        value={filters.priceRange?.min || ''}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <span className="text-muted-foreground">-</span>
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        placeholder="Máx"
                                        value={filters.priceRange?.max || ''}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Calificación mínima */}
                        <div>
                            <Label className="mb-3 font-medium text-sm">
                                Calificación mínima
                            </Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <Button
                                        key={rating}
                                        variant={
                                            filters.rating?.min === rating ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => handleRatingChange(rating)}
                                        className="flex items-center gap-1"
                                    >
                                        <span>{rating}</span>
                                        <span className="text-yellow-500">★</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Ordenamiento */}
                        <div>
                            <Label className="mb-3 font-medium text-sm">Ordenar por</Label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {[
                                    { value: 'title', label: 'Nombre A-Z' },
                                    { value: 'price', label: 'Precio: menor a mayor' },
                                    { value: 'rating', label: 'Mejor calificación' },
                                ].map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={
                                            filters.sortBy === option.value ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onFiltersChange({
                                                ...filters,
                                                sortBy: option.value as any,
                                                sortOrder: 'asc',
                                            })
                                        }
                                        className="justify-start"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Orden ascendente/descendente */}
                        {filters.sortBy && filters.sortBy !== 'title' && (
                            <div>
                                <Label className="mb-3 font-medium text-sm">Orden</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={
                                            filters.sortOrder === 'asc' ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onFiltersChange({ ...filters, sortOrder: 'asc' })
                                        }
                                    >
                                        Ascendente
                                    </Button>
                                    <Button
                                        variant={
                                            filters.sortOrder === 'desc' ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onFiltersChange({ ...filters, sortOrder: 'desc' })
                                        }
                                    >
                                        Descendente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Filtros activos */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {filters.category && (
                        <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
                            <span className="capitalize">
                                {filters.category.replace(/['"]/g, '')}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onFiltersChange({ ...filters, category: undefined })
                                }
                                className="h-4 w-4 hover:bg-primary-foreground/20"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {filters.priceRange && (
                        <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
                            <span>
                                ${filters.priceRange.min || 0} - $
                                {filters.priceRange.max || '∞'}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onFiltersChange({ ...filters, priceRange: undefined })
                                }
                                className="h-4 w-4 hover:bg-primary-foreground/20"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {filters.rating && (
                        <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
                            <span>{filters.rating.min}★ o más</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onFiltersChange({ ...filters, rating: undefined })
                                }
                                className="h-4 w-4 hover:bg-primary-foreground/20"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
