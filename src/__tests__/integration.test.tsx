import { ProductCard } from '@/components/ui/product-card'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/store/cart-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

// Mock the cart hooks to avoid hydration issues in integration tests
jest.mock('@/hooks/use-cart', () => ({
    useProductCart: (product: Product) => {
        const store = useCartStore.getState()
        const quantity = store.getItemQuantity(product.id)
        const isInCart = quantity > 0

        return {
            quantity,
            isInCart,
            isHydrated: true,
            addToCart: (qty = 1) => store.addItem(product, qty),
            removeFromCart: () => store.removeItem(product.id),
            updateQuantity: (qty: number) => store.updateQuantity(product.id, qty),
            increaseQuantity: () => store.increaseQuantity(product.id),
            decreaseQuantity: () => store.decreaseQuantity(product.id),
        }
    },
}))

const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A test product for integration testing',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    rating: {
        rate: 4.5,
        count: 100,
    },
}

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('Integration Tests - Cart Flow', () => {
    beforeEach(() => {
        // Reset cart before each test
        useCartStore.getState().clearCart()
        useCartStore.persist.rehydrate()
    })

    afterEach(() => {
        useCartStore.getState().clearCart()
    })

    describe('Product Card to Cart Integration', () => {
        it('should add product to cart and update store state', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <ProductCard product={mockProduct} />
                </TestWrapper>,
            )

            // Initially, cart should be empty
            expect(useCartStore.getState().items).toHaveLength(0)
            expect(useCartStore.getState().totalItems).toBe(0)
            expect(useCartStore.getState().totalPrice).toBe(0)

            // Find and click the add to cart button
            const addButton = screen.getByRole('button', { name: /agregar al carrito agregar/i })
            await user.click(addButton)

            // Wait for state to update
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items).toHaveLength(1)
                expect(cartState.items[0]?.product.id).toBe(mockProduct.id)
                expect(cartState.items[0]?.quantity).toBe(1)
                expect(cartState.totalItems).toBe(1)
                expect(cartState.totalPrice).toBeCloseTo(29.99, 2)
            })

            // Check if button text changes to reflect item in cart
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument()
            })
        })

        it('should handle quantity changes through product card', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <ProductCard product={mockProduct} />
                </TestWrapper>,
            )

            // Add product to cart first
            const addButton = screen.getByRole('button', { name: /agregar al carrito agregar/i })
            await user.click(addButton)

            // Wait for the quantity controls to appear
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument()
            })

            // Find quantity increase button
            const increaseButton = screen.getByRole('button', { name: /increase/i })
            await user.click(increaseButton)

            // Check if quantity increased
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items[0]?.quantity).toBe(2)
                expect(cartState.totalItems).toBe(2)
                expect(cartState.totalPrice).toBeCloseTo(59.98, 2)
            })

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument()
            })

            // Test decrease functionality
            const decreaseButton = screen.getByRole('button', { name: /decrease/i })
            await user.click(decreaseButton)

            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items[0]?.quantity).toBe(1)
                expect(cartState.totalItems).toBe(1)
                expect(cartState.totalPrice).toBeCloseTo(29.99, 2)
            })
        })

        it('should remove product from cart when quantity reaches zero', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <ProductCard product={mockProduct} />
                </TestWrapper>,
            )

            // Add product to cart
            const addButton = screen.getByRole('button', { name: /agregar al carrito agregar/i })
            await user.click(addButton)

            // Wait for quantity controls
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument()
            })

            // Decrease quantity to zero
            const decreaseButton = screen.getByRole('button', { name: /decrease/i })
            await user.click(decreaseButton)

            // Product should be removed from cart
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items).toHaveLength(0)
                expect(cartState.totalItems).toBe(0)
                expect(cartState.totalPrice).toBe(0)
            })

            // Button should return to "Add to Cart" state
            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /agregar al carrito agregar/i }),
                ).toBeInTheDocument()
            })
        })

        it('should handle multiple products in cart', async () => {
            const user = userEvent.setup()

            const secondProduct: Product = {
                ...mockProduct,
                id: 2,
                title: 'Second Test Product',
                price: 19.99,
            }

            render(
                <TestWrapper>
                    <div>
                        <ProductCard product={mockProduct} />
                        <ProductCard product={secondProduct} />
                    </div>
                </TestWrapper>,
            )

            // Add first product
            const addButtons = screen.getAllByRole('button', {
                name: /agregar al carrito agregar/i,
            })
            if (addButtons[0]) {
                await user.click(addButtons[0])
            }

            // Add second product
            if (addButtons[1]) {
                await user.click(addButtons[1])
            }

            // Check cart state
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items).toHaveLength(2)
                expect(cartState.totalItems).toBe(2)
                expect(cartState.totalPrice).toBeCloseTo(49.98, 2) // 29.99 + 19.99
            })
        })

        it('should persist cart state across component remounts', async () => {
            const user = userEvent.setup()

            const { rerender } = render(
                <TestWrapper>
                    <ProductCard product={mockProduct} />
                </TestWrapper>,
            )

            // Add product to cart
            const addButton = screen.getByRole('button', { name: /agregar al carrito agregar/i })
            await user.click(addButton)

            // Wait for cart to update
            await waitFor(() => {
                expect(useCartStore.getState().items).toHaveLength(1)
            })

            // Simulate component unmount/remount
            rerender(
                <TestWrapper>
                    <ProductCard product={mockProduct} />
                </TestWrapper>,
            )

            // Cart state should persist
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items).toHaveLength(1)
                expect(cartState.items[0]?.quantity).toBe(1)
            })

            // UI should reflect persisted state
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument()
            })
        })
    })

    describe('Cart Store Persistence', () => {
        it('should handle store rehydration correctly', async () => {
            // Add item to cart
            useCartStore.getState().addItem(mockProduct, 2)

            // Verify initial state
            expect(useCartStore.getState().items).toHaveLength(1)
            expect(useCartStore.getState().totalItems).toBe(2)

            // Simulate rehydration
            useCartStore.persist.rehydrate()

            // State should be maintained
            await waitFor(() => {
                const cartState = useCartStore.getState()
                expect(cartState.items).toHaveLength(1)
                expect(cartState.totalItems).toBe(2)
                expect(cartState.totalPrice).toBeCloseTo(59.98, 2)
            })
        })

        it('should handle invalid cart data gracefully', async () => {
            // This test ensures the cart store handles edge cases
            const cartState = useCartStore.getState()

            // Test edge cases
            cartState.updateQuantity(999, 5) // Non-existent product
            cartState.removeItem(999) // Non-existent product
            cartState.decreaseQuantity(999) // Non-existent product

            // Cart should remain stable
            expect(cartState.items).toHaveLength(0)
            expect(cartState.totalItems).toBe(0)
            expect(cartState.totalPrice).toBe(0)
        })
    })
})
