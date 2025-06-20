import { QueryProvider } from '@/components/providers/query-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </QueryProvider>
  );
}
