'use client';

import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WishlistPageClient() {
  const { items, totalItems, isEmpty, isHydrated, removeItem, clearWishlist } =
    useWishlist();
  const router = useRouter();

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
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>

            <h2 className="mb-2 font-semibold text-2xl text-foreground">
              Tu lista de favoritos está vacía
            </h2>

            <p className="mb-8 max-w-md text-muted-foreground">
              Guarda tus productos favoritos aquí para encontrarlos fácilmente
              más tarde.
            </p>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
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
            <div className="mb-2 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Continuar explorando</span>
                  <span className="sm:hidden">Volver</span>
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="font-bold text-2xl text-foreground sm:text-3xl">
                Mis Favoritos
              </h1>
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu
              lista de favoritos
            </p>
          </div>

          {totalItems > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de que quieres limpiar toda tu lista de favoritos?',
                  )
                ) {
                  clearWishlist();
                }
              }}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar lista
            </Button>
          )}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
            >
              {/* Imagen del producto */}
              <div className="aspect-square overflow-hidden">
                <Link href={`/product/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Botón de eliminar */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeItem(product.id)}
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remover ${product.title} de favoritos`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* Información del producto */}
              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="mb-2 line-clamp-2 font-medium text-foreground text-sm hover:text-primary">
                    {product.title}
                  </h3>
                </Link>

                <p className="mb-2 text-muted-foreground text-xs capitalize">
                  {product.category}
                </p>

                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground text-lg">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price * 3800)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-muted-foreground text-xs">
                      {product.rating.rate}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/product/${product.id}`}>Ver producto</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
