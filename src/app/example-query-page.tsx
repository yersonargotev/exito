import getQueryClient from '@/lib/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

// Example server component that prefetches data
export default async function ExampleQueryPage() {
  const queryClient = getQueryClient();

  // Example: Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      // Replace with your actual data fetching logic
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts/1',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExampleClientComponent />
    </HydrationBoundary>
  );
}

// Example client component that uses the prefetched data
('use client');
import { useQuery } from '@tanstack/react-query';

function ExampleClientComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts/1',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Example TanStack Query with SSR</h1>
      <h2>{data?.title}</h2>
      <p>{data?.body}</p>
    </div>
  );
}
