'use client';

import { Button } from '@/components/ui/button';
import { useCompare } from '@/hooks/use-compare';
import { GitCompare, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ComparePageClient() {
    const { items, count, isEmpty, isHydrated, removeItem, clearCompare } =
        useCompare();

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                        <div className="mb-6 rounded-full bg-muted p-4">
                            <GitCompare className="h-12 w-12 text-muted-foreground" />
                        </div>

                        <h2 className="mb-2 font-semibold text-2xl text-foreground">
                            No tienes productos para comparar
                        </h2>

                        <p className="mb-8 max-w-md text-muted-foreground">
                            Agrega hasta 3 productos a tu lista de comparación para ver sus
                            diferencias lado a lado.
                        </p>

                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/" className="flex items-center gap-2">
                                Explorar productos
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <GitCompare className="h-6 w-6 text-primary" />
                            <h1 className="font-bold text-2xl text-foreground sm:text-3xl">
                                Comparar Productos
                            </h1>
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">
                            Comparando {count} de 3 productos máximo
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => {
                            if (
                                confirm(
                                    '¿Estás seguro de que quieres limpiar toda la comparación?',
                                )
                            ) {
                                clearCompare();
                            }
                        }}
                        className="text-destructive hover:bg-destructive/10"
                    >
                        Limpiar comparación
                    </Button>
                </div>

                {/* Tabla de comparación */}
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Headers con imágenes */}
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {items.map((product) => (
                                <div
                                    key={product.id}
                                    className="relative rounded-lg border border-border bg-card p-4"
                                >
                                    {/* Botón de eliminar */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(product.id)}
                                        className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                        aria-label={`Remover ${product.title} de comparación`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>

                                    {/* Imagen */}
                                    <div className="mb-4 aspect-square overflow-hidden rounded-md">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    {/* Título y precio */}
                                    <h3 className="mb-2 line-clamp-2 font-medium text-sm">
                                        {product.title}
                                    </h3>
                                    <p className="font-bold text-lg text-primary">
                                        {new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(product.price * 3800)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Tabla de características */}
                        <div className="rounded-lg border border-border bg-card">
                            {/* Categoría */}
                            <div className="border-border border-b p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="font-medium text-muted-foreground">
                                        Categoría
                                    </div>
                                    {items.map((product) => (
                                        <div key={product.id} className="capitalize">
                                            {product.category}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="border-border border-b p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="font-medium text-muted-foreground">
                                        Precio
                                    </div>
                                    {items.map((product) => (
                                        <div
                                            key={product.id}
                                            className="font-semibold text-primary"
                                        >
                                            ${product.price.toFixed(2)} USD
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="border-border border-b p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="font-medium text-muted-foreground">
                                        Calificación
                                    </div>
                                    {items.map((product) => (
                                        <div key={product.id} className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{product.rating.rate}</span>
                                            </div>
                                            <span className="text-muted-foreground text-sm">
                                                ({product.rating.count} reseñas)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="font-medium text-muted-foreground">
                                        Descripción
                                    </div>
                                    {items.map((product) => (
                                        <div key={product.id} className="text-sm">
                                            {product.description}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {items.map((product) => (
                                <div key={product.id} className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href={`/product/${product.id}`}>Ver detalles</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Agregar al carrito
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
