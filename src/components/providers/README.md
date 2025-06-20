# TanStack Query Provider Implementation

This implementation follows the latest TanStack Query best practices for Next.js App Router with SSR compatibility, using Context7 documentation as reference.

## Architecture Overview

### 1. QueryProvider (`query-client-provider.tsx`)

**Key Features:**
- **SSR Compatible**: Different query client instances for server vs browser
- **Streaming Support**: Uses `ReactQueryStreamedHydration` for optimal performance
- **Development Tools**: React Query DevTools in development only
- **Optimized Defaults**: Configured with appropriate `staleTime` and refetch policies

**Implementation Details:**
```tsx
// Server: New client per request (prevents data leakage)
// Browser: Singleton client (prevents recreation during suspense)
const queryClient = getQueryClient()
```

### 2. Server Query Client (`get-query-client.ts`)

**Purpose:** 
- Provides cached query client for server components
- Uses React's `cache()` to scope per request
- Prevents data leakage between different users/requests

**Usage:**
```tsx
const queryClient = getQueryClient()
await queryClient.prefetchQuery({...})
```

### 3. Hydration Boundary (`hydration-boundary.tsx`)

**Features:**
- Reusable wrapper for `HydrationBoundary`
- Helper function for dehydrating query client state
- Simplifies SSR implementation

## Usage Patterns

### Basic Setup in Layout

The providers are already configured in the main `Providers` component:

```tsx
<QueryProvider>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</QueryProvider>
```

### Server-Side Data Prefetching

```tsx
// Server Component
export default async function MyPage() {
  const queryClient = getQueryClient()
  
  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyClientComponent />
    </HydrationBoundary>
  )
}
```

### Client-Side Data Consumption

```tsx
'use client'

function MyClientComponent() {
  // This will use prefetched data immediately
  const { data, isLoading } = useQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData,
  })

  return <div>{data?.title}</div>
}
```

## Best Practices Implemented

### 1. SSR Configuration
- **StaleTime**: 60 seconds to prevent immediate refetching
- **Server Isolation**: Each request gets its own query client
- **Browser Optimization**: Singleton client to prevent recreation

### 2. Performance Optimizations
- **Streaming Hydration**: Uses experimental streaming for better UX
- **Selective Refetching**: Disabled window focus and mount refetching
- **Development Tools**: DevTools only in development

### 3. Error Handling
- **Mutation Retries**: Default retry policy for mutations
- **Graceful Degradation**: Proper loading and error states

## Migration Notes

If you're migrating from an older setup:

1. **Remove old QueryClient initialization** from `_app.tsx` or root layout
2. **Update imports** to use the new provider structure
3. **Use server prefetching** for better performance
4. **Leverage streaming hydration** for optimal UX

## Advanced Usage

### Custom Query Client Configuration

To customize the query client, modify the `makeQueryClient` function:

```tsx
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
        retry: 3,
      },
    },
  })
}
```

### Conditional Prefetching

```tsx
// Prefetch based on conditions
if (shouldPrefetch) {
  await queryClient.prefetchQuery({
    queryKey: ['conditional-data'],
    queryFn: fetchConditionalData,
  })
}
```

This implementation ensures optimal performance, proper SSR support, and follows the latest TanStack Query best practices for Next.js applications. 