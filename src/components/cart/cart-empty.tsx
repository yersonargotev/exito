import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-muted p-4">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>

      <h2 className="mb-2 font-semibold text-2xl text-foreground">
        Tu carrito está vacío
      </h2>

      <p className="mb-8 max-w-md text-muted-foreground">
        Parece que no has agregado nada a tu carrito aún. ¡Explora nuestros
        productos y encuentra algo que te encante!
      </p>

      <Button asChild className="w-full sm:w-auto">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>
      </Button>
    </div>
  );
}
