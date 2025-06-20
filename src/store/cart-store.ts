import type { CartItem, CartStore, Product } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Zustand Cart Store with persist middleware and immer for immutable updates
 * Follows best practices for Next.js applications
 */
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        items: [],
        totalItems: 0,
        totalPrice: 0,

        // Actions
        addItem: (product: Product, quantity = 1) => {
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (item: CartItem) => item.product.id === product.id,
            );

            if (existingItemIndex >= 0 && state.items[existingItemIndex]) {
              // Update existing item quantity
              state.items[existingItemIndex].quantity += quantity;
            } else {
              // Add new item
              state.items.push({
                product,
                quantity,
              });
            }

            // Update totals
            state.totalItems = state.items.reduce(
              (total: number, item: CartItem) => total + item.quantity,
              0,
            );
            state.totalPrice = state.items.reduce(
              (total: number, item: CartItem) =>
                total + item.product.price * item.quantity,
              0,
            );
          });
        },

        removeItem: (productId: number) => {
          set((state) => {
            state.items = state.items.filter(
              (item: CartItem) => item.product.id !== productId,
            );

            // Update totals
            state.totalItems = state.items.reduce(
              (total: number, item: CartItem) => total + item.quantity,
              0,
            );
            state.totalPrice = state.items.reduce(
              (total: number, item: CartItem) =>
                total + item.product.price * item.quantity,
              0,
            );
          });
        },

        updateQuantity: (productId: number, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }

          set((state) => {
            const itemIndex = state.items.findIndex(
              (item: CartItem) => item.product.id === productId,
            );

            if (itemIndex >= 0 && state.items[itemIndex]) {
              state.items[itemIndex].quantity = quantity;

              // Update totals
              state.totalItems = state.items.reduce(
                (total: number, item: CartItem) => total + item.quantity,
                0,
              );
              state.totalPrice = state.items.reduce(
                (total: number, item: CartItem) =>
                  total + item.product.price * item.quantity,
                0,
              );
            }
          });
        },

        increaseQuantity: (productId: number) => {
          set((state) => {
            const itemIndex = state.items.findIndex(
              (item: CartItem) => item.product.id === productId,
            );

            if (itemIndex >= 0 && state.items[itemIndex]) {
              state.items[itemIndex].quantity += 1;

              // Update totals
              state.totalItems = state.items.reduce(
                (total: number, item: CartItem) => total + item.quantity,
                0,
              );
              state.totalPrice = state.items.reduce(
                (total: number, item: CartItem) =>
                  total + item.product.price * item.quantity,
                0,
              );
            }
          });
        },

        decreaseQuantity: (productId: number) => {
          const currentQuantity = get().getItemQuantity(productId);
          if (currentQuantity <= 1) {
            get().removeItem(productId);
            return;
          }

          set((state) => {
            const itemIndex = state.items.findIndex(
              (item: CartItem) => item.product.id === productId,
            );

            if (itemIndex >= 0 && state.items[itemIndex]) {
              state.items[itemIndex].quantity -= 1;

              // Update totals
              state.totalItems = state.items.reduce(
                (total: number, item: CartItem) => total + item.quantity,
                0,
              );
              state.totalPrice = state.items.reduce(
                (total: number, item: CartItem) =>
                  total + item.product.price * item.quantity,
                0,
              );
            }
          });
        },

        clearCart: () => {
          set((state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
          });
        },

        // Getters
        getTotalItems: () => {
          return get().totalItems;
        },

        getTotalPrice: () => {
          return get().totalPrice;
        },

        getItemById: (productId: number) => {
          return get().items.find(
            (item: CartItem) => item.product.id === productId,
          );
        },

        getItemQuantity: (productId: number) => {
          const item = get().items.find(
            (item: CartItem) => item.product.id === productId,
          );
          return item?.quantity || 0;
        },
      })),
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage),
        // Only persist the cart state, not the actions
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
        }),
        // Skip hydration during SSR to prevent mismatches
        skipHydration: true,
      },
    ),
    {
      name: 'cart-store',
    },
  ),
);

// Export store instance for manual hydration
export const cartStore = useCartStore;
