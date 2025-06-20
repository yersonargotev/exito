import { CartHydration } from '@/components/providers/cart-hydration';
import { QueryProvider } from '@/components/providers/query-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartHydration />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryProvider>
  );
}
