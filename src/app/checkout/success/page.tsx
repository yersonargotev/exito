'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Home,
  Mail,
  Package,
  Phone,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const orderIdFromParams = searchParams.get('orderId');
    if (!orderIdFromParams) {
      router.push('/');
      return;
    }
    setOrderId(orderIdFromParams);
  }, [searchParams, router]);

  // Datos ficticios del pedido
  const orderData = {
    orderId: orderId || '',
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días
    trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
    total: '$1,523,600 COP',
    paymentMethod: 'Tarjeta terminada en ****1234',
  };

  const handleDownloadInvoice = () => {
    toast.success('Descargando factura...');
    // Aquí iría la lógica para descargar la factura
  };

  const handleTrackOrder = () => {
    toast.success('Función de seguimiento disponible en breve');
    // Aquí iría la navegación a la página de seguimiento
  };

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">
            Cargando información del pedido...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header de éxito */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-lg text-muted-foreground">
              Tu pedido ha sido procesado exitosamente
            </p>
          </div>

          {/* ID del pedido */}
          <div className="inline-block rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
            <p className="mb-1 text-green-700 text-sm dark:text-green-300">
              Número de pedido
            </p>
            <p className="font-mono font-semibold text-green-800 text-xl dark:text-green-200">
              {orderData.orderId}
            </p>
          </div>
        </div>

        {/* Información del pedido */}
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Estado del pedido */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Estado del Pedido
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado actual</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Confirmado
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total pagado</span>
                <span className="font-semibold text-foreground">
                  {orderData.total}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Método de pago</span>
                <span className="text-foreground">
                  {orderData.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Número de seguimiento
                </span>
                <span className="font-mono text-foreground">
                  {orderData.trackingNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Información de entrega */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Información de Entrega
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 text-sm dark:text-blue-200">
                    Fecha estimada de entrega
                  </span>
                </div>
                <p className="font-semibold text-blue-900 text-lg dark:text-blue-100">
                  {orderData.estimatedDelivery.toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="mt-1 text-blue-700 text-xs dark:text-blue-300">
                  Entre 3-5 días hábiles
                </p>
              </div>

              <div className="space-y-1 text-muted-foreground text-sm">
                <p>• Te contactaremos para coordinar la entrega</p>
                <p>• Recibirás actualizaciones por email y SMS</p>
                <p>• El pago se procesó exitosamente</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              onClick={handleTrackOrder}
              className="w-full"
              variant="outline"
            >
              <Package className="mr-2 h-4 w-4" />
              Rastrear Pedido
            </Button>

            <Button
              onClick={handleDownloadInvoice}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar Factura
            </Button>
          </div>

          {/* Contacto */}
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 font-medium text-foreground">
              ¿Necesitas ayuda?
            </h3>
            <div className="space-y-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Envíanos un email: soporte@exito.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Llámanos: +57 (1) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Horario: Lunes a Viernes 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/">Seguir comprando</Link>
            </Button>
          </div>

          {/* Información adicional */}
          <div className="border-border border-t pt-6 text-center text-muted-foreground text-xs">
            <p className="mb-2">
              ¡Gracias por tu compra! Te hemos enviado un email de confirmación.
            </p>
            <p>
              Si tienes alguna pregunta sobre tu pedido, no dudes en
              contactarnos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
