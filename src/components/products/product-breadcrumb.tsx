import type { Product } from '@/lib/types';
import { ChevronRight, Home } from 'lucide-react';

interface ProductBreadcrumbProps {
  product: Product;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const formatCategory = (category: string) => {
    return category
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="mb-6 flex items-center space-x-2 text-muted-foreground text-sm">
      <a
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        Inicio
      </a>

      <ChevronRight className="h-4 w-4" />

      <span className="cursor-pointer transition-colors hover:text-foreground">
        {formatCategory(product.category)}
      </span>

      <ChevronRight className="h-4 w-4" />

      <span className="max-w-md truncate font-medium text-foreground">
        {product.title}
      </span>
    </nav>
  );
}
