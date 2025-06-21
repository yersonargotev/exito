'use client';

import { Button } from '@/components/ui/button';
import { useCompareActions, useIsInCompare } from '@/hooks/use-compare';
import type { Product } from '@/lib/types';
import { GitCompare } from 'lucide-react';
import { toast } from 'sonner';

interface CompareButtonProps {
  product: Product;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export function CompareButton({
  product,
  variant = 'ghost',
  size = 'icon',
  showText = false,
  className,
}: CompareButtonProps) {
  const isInCompare = useIsInCompare(product.id);
  const { toggleItem, canAddMore } = useCompareActions();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompare) {
      toggleItem(product);
      toast.success('Producto removido de comparación', {
        description: product.title,
      });
    } else {
      const success = toggleItem(product);
      if (success) {
        toast.success('Producto agregado a comparación', {
          description: product.title,
        });
      } else {
        toast.error('Máximo 3 productos para comparar', {
          description: 'Remueve un producto antes de agregar otro',
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={!isInCompare && !canAddMore()}
      className={className}
      aria-label={
        isInCompare
          ? `Remover ${product.title} de comparación`
          : `Agregar ${product.title} a comparación`
      }
    >
      <GitCompare
        className={`h-4 w-4 ${
          isInCompare ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
      {showText && (
        <span className="ml-2">
          {isInCompare ? 'En Comparación' : 'Comparar'}
        </span>
      )}
    </Button>
  );
}
