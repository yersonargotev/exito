import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
          // Disable queries on the server by default to prevent
          // queries from running asynchronously after the HTML has been sent
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      },
    }),
);

export default getQueryClient;
