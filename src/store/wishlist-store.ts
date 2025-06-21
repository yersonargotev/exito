import type { Product } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface WishlistState {
  items: Product[];
  totalItems: number;
}

export interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleItem: (product: Product) => void;
}

export type WishlistStore = WishlistState & WishlistActions;

/**
 * Zustand Wishlist Store with persist middleware and immer for immutable updates
 */
export const useWishlistStore = create<WishlistStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        items: [],
        totalItems: 0,

        // Actions
        addItem: (product: Product) => {
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (item) => item.id === product.id,
            );

            if (existingItemIndex === -1) {
              state.items.push(product);
              state.totalItems = state.items.length;
            }
          });
        },

        removeItem: (productId: number) => {
          set((state) => {
            state.items = state.items.filter((item) => item.id !== productId);
            state.totalItems = state.items.length;
          });
        },

        clearWishlist: () => {
          set((state) => {
            state.items = [];
            state.totalItems = 0;
          });
        },

        isInWishlist: (productId: number) => {
          return get().items.some((item) => item.id === productId);
        },

        toggleItem: (product: Product) => {
          const { isInWishlist, addItem, removeItem } = get();
          if (isInWishlist(product.id)) {
            removeItem(product.id);
          } else {
            addItem(product);
          }
        },
      })),
      {
        name: 'wishlist-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
        }),
        skipHydration: true,
      },
    ),
    {
      name: 'wishlist-store',
    },
  ),
);

// Export store instance for manual hydration
export const wishlistStore = useWishlistStore;
