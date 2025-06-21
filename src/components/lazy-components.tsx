import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Loading components for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Cargando...</span>
  </div>
);

// Lazy loaded checkout components
export const LazyCheckoutSteps = dynamic(
  () =>
    import('./checkout/checkout-steps').then((mod) => ({
      default: mod.CheckoutSteps,
    })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for complex interactive components
  },
);

export const LazyOrderSummary = dynamic(
  () =>
    import('./checkout/order-summary').then((mod) => ({
      default: mod.OrderSummary,
    })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-8 rounded bg-muted" />
      </div>
    ),
  },
);

export const LazyPersonalInfoForm = dynamic(
  () =>
    import('./checkout/personal-info-form').then((mod) => ({
      default: mod.PersonalInfoForm,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

export const LazyPaymentInfoForm = dynamic(
  () =>
    import('./checkout/payment-info-form').then((mod) => ({
      default: mod.PaymentInfoForm,
    })),
  {
    loading: () => <LoadingSpinner />,
  },
);

// Lazy load cart components for performance
export const LazyCartSummary = dynamic(
  () =>
    import('./cart/cart-summary').then((mod) => ({ default: mod.CartSummary })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-1/2 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
      </div>
    ),
  },
);
