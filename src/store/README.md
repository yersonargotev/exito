# 🛍️ Cart Store - Zustand Implementation

## Overview

This cart store implementation uses **Zustand** with modern best practices for **Next.js** applications, including persistence, hydration handling, and optimized performance.

## 🏗️ Architecture

### Core Technologies
- **Zustand 5.x** - State management
- **Immer Middleware** - Immutable state updates
- **Persist Middleware** - localStorage persistence
- **DevTools Middleware** - Redux DevTools integration
- **TypeScript** - Full type safety

### File Structure
```
src/
├── store/
│   ├── cart-store.ts          # Main cart store implementation
│   └── README.md             # This documentation
├── hooks/
│   └── use-cart.ts           # Custom hooks for cart functionality
├── components/providers/
│   └── cart-hydration.tsx    # Client-side hydration component
└── lib/
    └── types.ts              # TypeScript definitions
```

## 🚀 Features

### Store Features
- ✅ **Add products** to cart with quantity
- ✅ **Update quantities** (increase/decrease)
- ✅ **Remove items** from cart
- ✅ **Clear entire cart**
- ✅ **Automatic totals calculation** (items count and price)
- ✅ **Persistence** in localStorage
- ✅ **Safe hydration** for Next.js SSR

### Performance Optimizations
- ✅ **Shallow comparisons** with `useShallow` hook
- ✅ **Selective re-rendering** with optimized selectors
- ✅ **Immer integration** for efficient state updates
- ✅ **Partialize** to persist only necessary state

## 📦 Store Implementation

### State Structure
```typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  // ... getters
}
```

### Middleware Stack
```typescript
create<CartStore>()(
  devtools(              // Redux DevTools
    persist(             // localStorage persistence
      immer((set, get) => ({
        // ... store implementation
      })),
      {
        name: 'cart-storage',
        skipHydration: true,  // Prevent SSR mismatches
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
        }),
      }
    ),
    { name: 'cart-store' }
  )
)
```

## 🎣 Custom Hooks

### Core Hooks

#### `useCart()`
Complete cart functionality for cart page:
```typescript
const {
  items,           // CartItem[]
  totalItems,      // number
  totalPrice,      // number
  isEmpty,         // boolean
  isHydrated,      // boolean
  addItem,         // function
  removeItem,      // function
  clearCart,       // function
  // ... other actions
} = useCart();
```

#### `useProductCart(product)`
Optimized for product cards:
```typescript
const {
  quantity,        // number
  isInCart,        // boolean
  isHydrated,      // boolean
  addToCart,       // function
  removeFromCart,  // function
  increaseQuantity,// function
  decreaseQuantity,// function
} = useProductCart(product);
```

#### `useCartTotals()`
Optimized totals with shallow comparison:
```typescript
const { totalItems, totalPrice } = useCartTotals();
```

### Specialized Hooks

- `useCartItems()` - Get all cart items
- `useCartActions()` - Get all cart actions
- `useCartItem(productId)` - Get specific cart item
- `useCartItemQuantity(productId)` - Get product quantity
- `useIsInCart(productId)` - Check if product is in cart

## 🔄 Next.js Integration

### Hydration Strategy
To prevent SSR/client mismatches, the store uses:

1. **Skip hydration** in persist config
2. **Manual rehydration** on client-side
3. **Hydration component** in providers
4. **Safe hooks** that check hydration status

### Provider Setup
```typescript
// src/components/providers/providers.tsx
<QueryProvider>
  <ThemeProvider>
    <CartHydration /> {/* Critical for SSR */}
    <NuqsAdapter>{children}</NuqsAdapter>
  </ThemeProvider>
</QueryProvider>
```

## 💡 Best Practices Used

### 1. **Immer for Complex Updates**
```typescript
set((state) => {
  // Direct mutation allowed with Immer
  state.items[existingItemIndex].quantity += quantity;
  
  // Automatic totals recalculation
  state.totalItems = state.items.reduce(/*...*/);
  state.totalPrice = state.items.reduce(/*...*/);
});
```

### 2. **Shallow Comparisons**
```typescript
const { totalItems, totalPrice } = useCartStore(
  useShallow((state) => ({
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
  }))
);
```

### 3. **Selective Persistence**
```typescript
partialize: (state) => ({
  items: state.items,
  totalItems: state.totalItems,
  totalPrice: state.totalPrice,
  // Actions are not persisted
}),
```

### 4. **Type Safety**
- Complete TypeScript coverage
- Proper type annotations for all callbacks
- Type-safe selectors and hooks

### 5. **Error Prevention**
- Null checks for array access
- Validation before operations
- Safe quantity updates

## 🛠️ Usage Examples

### Adding Products to Cart
```typescript
const { addToCart } = useProductCart(product);

// Add single item
addToCart();

// Add multiple items
addToCart(3);
```

### Cart Page Implementation
```typescript
function CartPage() {
  const { 
    items, 
    isEmpty, 
    totalPrice, 
    isHydrated,
    removeItem,
    clearCart 
  } = useCart();

  if (!isHydrated) {
    return <CartSkeleton />;
  }

  if (isEmpty) {
    return <EmptyCart />;
  }

  return (
    <div>
      {items.map(item => (
        <CartItemCard 
          key={item.product.id} 
          item={item}
          onRemove={() => removeItem(item.product.id)}
        />
      ))}
      <CartSummary total={totalPrice} />
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### Product Card Implementation
```typescript
function ProductCard({ product }: { product: Product }) {
  const { 
    quantity, 
    isInCart, 
    addToCart, 
    increaseQuantity,
    decreaseQuantity 
  } = useProductCart(product);

  return (
    <div>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      
      {!isInCart ? (
        <button onClick={() => addToCart()}>
          Add to Cart
        </button>
      ) : (
        <div>
          <button onClick={decreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>+</button>
        </div>
      )}
    </div>
  );
}
```

## 🔍 Debugging

### Redux DevTools
The store is connected to Redux DevTools for debugging:
- Action history
- State inspection
- Time travel debugging

### Console Logging
In development, you can access the store directly:
```typescript
// Get current state
console.log(useCartStore.getState());

// Subscribe to changes
useCartStore.subscribe(console.log);
```

## 🚨 Important Notes

1. **Always use the custom hooks** instead of directly accessing the store
2. **Check `isHydrated`** before rendering cart-dependent UI
3. **Use `useShallow`** for multi-property selections
4. **Don't persist actions** in the partialize config
5. **Handle edge cases** like empty cart states

## 🔄 Migration Guide

If updating from a previous implementation:

1. Replace direct store usage with custom hooks
2. Add hydration handling to components
3. Update types to use new CartStore interface
4. Test SSR behavior thoroughly

## 📚 Related Documentation

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Immer Middleware](https://github.com/pmndrs/zustand#immer-middleware)
- [Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [Next.js SSR Considerations](https://nextjs.org/docs/basic-features/data-fetching) 