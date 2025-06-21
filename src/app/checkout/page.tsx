'use client';

import {
  CheckoutSteps,
  OrderSummary,
  PaymentInfoForm,
  PersonalInfoForm,
  ShippingAddressForm,
} from '@/components/checkout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import type {
  PaymentInfo,
  PersonalInfo,
  ShippingAddress,
} from '@/lib/validation-schemas';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { isEmpty, isHydrated, clearCart } = useCart();

  // Estado del stepper
  const [currentStep, setCurrentStep] = useState(1);

  // Estados de los formularios
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | undefined>();
  const [shippingAddress, setShippingAddress] = useState<
    ShippingAddress | undefined
  >();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | undefined>();

  // Estado de procesamiento
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirigir si el carrito está vacío una vez hidratado
  useEffect(() => {
    if (isHydrated && isEmpty) {
      toast.error('Tu carrito está vacío');
      router.push('/cart');
    }
  }, [isHydrated, isEmpty, router]);

  // Handlers para navegación
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handlers para guardar datos de formularios
  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
  };

  const handleShippingAddressSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
  };

  const handlePaymentInfoSubmit = (data: PaymentInfo) => {
    setPaymentInfo(data);
  };

  // Handler para confirmar pedido
  const handleConfirmOrder = async () => {
    if (!personalInfo || !shippingAddress || !paymentInfo) {
      toast.error('Faltan datos del checkout');
      return;
    }

    setIsProcessing(true);

    try {
      // Simular procesamiento del pedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generar ID de pedido ficticio
      const orderId = `EX-${Date.now()}`;

      // Limpiar carrito
      clearCart();

      // Mostrar mensaje de éxito
      toast.success(`¡Pedido ${orderId} confirmado exitosamente!`);

      // Redirigir a página de éxito
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error) {
      toast.error('Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Mostrar loading durante la hidratación
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-muted-foreground">
                Cargando checkout...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío después de la hidratación, no mostrar nada
  // porque se redirigirá
  if (isEmpty) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cart" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al carrito
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-2xl text-foreground sm:text-3xl">
                Finalizar Compra
              </h1>
            </div>
            <p className="mt-1 text-muted-foreground">
              Completa tu información para procesar el pedido
            </p>
          </div>
        </div>

        {/* Layout principal */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Stepper - Solo visible en desktop */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-8">
              <CheckoutSteps currentStep={currentStep} />
            </div>
          </div>

          {/* Formularios - Ocupa 2/5 en desktop */}
          <div data-testid="checkout-form" className="lg:col-span-2">
            {/* Stepper móvil */}
            <div className="mb-6 lg:hidden">
              <CheckoutSteps currentStep={currentStep} />
            </div>

            {/* Contenido del step actual */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <PersonalInfoForm
                  initialData={personalInfo}
                  onSubmit={handlePersonalInfoSubmit}
                  onNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <ShippingAddressForm
                  initialData={shippingAddress}
                  onSubmit={handleShippingAddressSubmit}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <PaymentInfoForm
                  initialData={paymentInfo}
                  onSubmit={handlePaymentInfoSubmit}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <h2 className="mb-2 font-semibold text-foreground text-xl">
                      Confirmar Pedido
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Revisa toda la información antes de confirmar tu compra
                    </p>
                  </div>

                  {/* Mostrar solo un resumen en mobile para el step 4 */}
                  <div className="lg:hidden">
                    <OrderSummary
                      personalInfo={personalInfo}
                      shippingAddress={shippingAddress}
                      paymentInfo={paymentInfo}
                      onConfirmOrder={handleConfirmOrder}
                      isConfirmation={true}
                    />
                  </div>

                  {/* Botones de navegación en desktop */}
                  <div className="hidden lg:flex lg:justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="min-w-[120px]"
                    >
                      Anterior
                    </Button>

                    <Button
                      onClick={handleConfirmOrder}
                      disabled={isProcessing}
                      className="min-w-[200px]"
                      size="lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Procesando...
                        </div>
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido - Ocupa 2/5 en desktop */}
          <div className="mt-8 lg:col-span-2 lg:mt-0">
            <div className="sticky top-8">
              <OrderSummary
                personalInfo={personalInfo}
                shippingAddress={shippingAddress}
                paymentInfo={paymentInfo}
                onConfirmOrder={
                  currentStep === 4 ? handleConfirmOrder : undefined
                }
                isConfirmation={currentStep === 4}
                className="hidden lg:block"
              />
            </div>
          </div>
        </div>

        {/* CTA fijo en mobile para steps 1-3 */}
        {currentStep < 4 && (
          <div className="fixed right-0 bottom-0 left-0 border-border border-t bg-background p-4 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Paso {currentStep} de 4</p>
                <p className="font-medium text-foreground">
                  {currentStep === 1 && 'Información Personal'}
                  {currentStep === 2 && 'Dirección de Envío'}
                  {currentStep === 3 && 'Información de Pago'}
                </p>
              </div>
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} size="sm">
                    Anterior
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Espaciado adicional en mobile */}
        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}
