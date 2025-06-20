import getQueryClient from '@/lib/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

interface HydrationBoundaryWrapperProps {
  children: React.ReactNode;
  state?: unknown;
}

export function HydrationBoundaryWrapper({
  children,
  state,
}: HydrationBoundaryWrapperProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}

// Helper function to dehydrate query client for server components
export function dehydrateQueryClient() {
  const queryClient = getQueryClient();
  return dehydrate(queryClient);
}
