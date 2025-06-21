import type { Product } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface CompareState {
  items: Product[];
  maxItems: number;
}

export interface CompareActions {
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  toggleItem: (product: Product) => boolean;
  canAddMore: () => boolean;
}

export type CompareStore = CompareState & CompareActions;

/**
 * Zustand Compare Store with persist middleware and immer for immutable updates
 */
export const useCompareStore = create<CompareStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        items: [],
        maxItems: 3, // Máximo 3 productos para comparar

        // Actions
        addItem: (product: Product) => {
          const { items, maxItems, isInCompare } = get();

          if (items.length >= maxItems) {
            return false; // No se puede agregar más
          }

          if (isInCompare(product.id)) {
            return false; // Ya está en la lista
          }

          set((state) => {
            state.items.push(product);
          });

          return true;
        },

        removeItem: (productId: number) => {
          set((state) => {
            state.items = state.items.filter((item) => item.id !== productId);
          });
        },

        clearCompare: () => {
          set((state) => {
            state.items = [];
          });
        },

        isInCompare: (productId: number) => {
          return get().items.some((item) => item.id === productId);
        },

        toggleItem: (product: Product) => {
          const { isInCompare, addItem, removeItem } = get();
          if (isInCompare(product.id)) {
            removeItem(product.id);
            return true;
          } else {
            return addItem(product);
          }
        },

        canAddMore: () => {
          const { items, maxItems } = get();
          return items.length < maxItems;
        },
      })),
      {
        name: 'compare-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
        }),
        skipHydration: true,
      },
    ),
    {
      name: 'compare-store',
    },
  ),
);

// Export store instance for manual hydration
export const compareStore = useCompareStore;
