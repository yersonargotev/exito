import type { Product } from '@/lib/types'
import { useCartStore } from '@/store/cart-store'
import { fireEvent, render, screen } from '@testing-library/react'
import { act } from '@testing-library/react'
import { ProductCard } from '../ui/product-card'

// Mock Next.js components
jest.mock('next/image', () => ({
    __esModule: true,
    default: function MockImage({ src, alt, ...props }: any) {
        return (
            <div
                role="img"
                aria-label={alt}
                data-testid="mock-image"
                data-src={src}
                {...props}
            />
        )
    },
}))

jest.mock('next/link', () => ({
    __esModule: true,
    default: function MockLink({ children, href, ...props }: any) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        )
    },
}))

// Mock the product cart hook
jest.mock('@/hooks/use-cart', () => ({
    useProductCart: jest.fn(),
}))

const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A great product for testing',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    rating: {
        rate: 4.5,
        count: 100,
    },
}

// Helper to reset cart state
const resetCart = () => {
    act(() => {
        useCartStore.getState().clearCart()
    })
}

describe('ProductCard', () => {
    const mockUseProductCart = require('@/hooks/use-cart').useProductCart as jest.Mock

    beforeEach(() => {
        resetCart()
        jest.clearAllMocks()

        // Default mock implementation
        mockUseProductCart.mockReturnValue({
            quantity: 0,
            isInCart: false,
            addToCart: jest.fn(),
            increaseQuantity: jest.fn(),
            decreaseQuantity: jest.fn(),
            removeFromCart: jest.fn(),
        })
    })

    describe('Rendering', () => {
        it('should render product information correctly', () => {
            render(<ProductCard product={mockProduct} />)

            expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
            expect(screen.getByText('$29.99')).toBeInTheDocument()
            expect(screen.getByText(mockProduct.category)).toBeInTheDocument()
            expect(screen.getByText('4.5 (100)')).toBeInTheDocument()
            expect(screen.getByRole('img', { name: mockProduct.title })).toBeInTheDocument()
        })

        it('should render "Add to Cart" button when product is not in cart', () => {
            render(<ProductCard product={mockProduct} />)

            expect(screen.getByText('Agregar al carrito')).toBeInTheDocument()
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('should render quantity controls when product is in cart', () => {
            mockUseProductCart.mockReturnValue({
                quantity: 2,
                isInCart: true,
                addToCart: jest.fn(),
                increaseQuantity: jest.fn(),
                decreaseQuantity: jest.fn(),
                removeFromCart: jest.fn(),
            })

            render(<ProductCard product={mockProduct} />)

            expect(screen.getByText('2')).toBeInTheDocument()
            expect(screen.getByText('En carrito')).toBeInTheDocument()
            expect(screen.getAllByRole('button')).toHaveLength(2) // + and - buttons
        })

        it('should have correct links to product detail page', () => {
            render(<ProductCard product={mockProduct} />)

            const links = screen.getAllByRole('link')
            links.forEach((link) => {
                expect(link).toHaveAttribute('href', '/product/1')
            })
        })
    })

    describe('Interactions', () => {
        it('should call addToCart when "Add to Cart" button is clicked', () => {
            const mockAddToCart = jest.fn()
            mockUseProductCart.mockReturnValue({
                quantity: 0,
                isInCart: false,
                addToCart: mockAddToCart,
                increaseQuantity: jest.fn(),
                decreaseQuantity: jest.fn(),
                removeFromCart: jest.fn(),
            })

            render(<ProductCard product={mockProduct} />)

            const addButton = screen.getByRole('button')
            fireEvent.click(addButton)

            expect(mockAddToCart).toHaveBeenCalledWith(1)
        })

        it('should call increaseQuantity when + button is clicked', () => {
            const mockIncreaseQuantity = jest.fn()
            mockUseProductCart.mockReturnValue({
                quantity: 2,
                isInCart: true,
                addToCart: jest.fn(),
                increaseQuantity: mockIncreaseQuantity,
                decreaseQuantity: jest.fn(),
                removeFromCart: jest.fn(),
            })

            render(<ProductCard product={mockProduct} />)

            const buttons = screen.getAllByRole('button')
            const increaseButton = buttons[1] // Second button should be the + button
            if (increaseButton) {
                fireEvent.click(increaseButton)
            }

            expect(mockIncreaseQuantity).toHaveBeenCalledTimes(1)
        })

        it('should call decreaseQuantity when - button is clicked and quantity > 1', () => {
            const mockDecreaseQuantity = jest.fn()
            mockUseProductCart.mockReturnValue({
                quantity: 2,
                isInCart: true,
                addToCart: jest.fn(),
                increaseQuantity: jest.fn(),
                decreaseQuantity: mockDecreaseQuantity,
                removeFromCart: jest.fn(),
            })

            render(<ProductCard product={mockProduct} />)

            const buttons = screen.getAllByRole('button')
            const decreaseButton = buttons[0] // First button should be the - button
            if (decreaseButton) {
                fireEvent.click(decreaseButton)
            }

            expect(mockDecreaseQuantity).toHaveBeenCalledTimes(1)
        })

        it('should call removeFromCart when - button is clicked and quantity is 1', () => {
            const mockRemoveFromCart = jest.fn()
            mockUseProductCart.mockReturnValue({
                quantity: 1,
                isInCart: true,
                addToCart: jest.fn(),
                increaseQuantity: jest.fn(),
                decreaseQuantity: jest.fn(),
                removeFromCart: mockRemoveFromCart,
            })

            render(<ProductCard product={mockProduct} />)

            const buttons = screen.getAllByRole('button')
            const decreaseButton = buttons[0] // First button should be the - button
            if (decreaseButton) {
                fireEvent.click(decreaseButton)
            }

            expect(mockRemoveFromCart).toHaveBeenCalledTimes(1)
        })
    })

    describe('Edge Cases', () => {
        it('should handle products without rating gracefully', () => {
            const productWithoutRating = {
                ...mockProduct,
                rating: { rate: 0, count: 0 },
            }

            render(<ProductCard product={productWithoutRating} />)

            expect(screen.getByText('0 (0)')).toBeInTheDocument()
        })

        it('should handle products with high prices', () => {
            const expensiveProduct = {
                ...mockProduct,
                price: 999999.99,
            }

            render(<ProductCard product={expensiveProduct} />)

            expect(screen.getByText('$999999.99')).toBeInTheDocument()
        })

        it('should handle long product titles', () => {
            const productWithLongTitle = {
                ...mockProduct,
                title: 'This is a very long product title that should be truncated or handled gracefully by the component',
            }

            render(<ProductCard product={productWithLongTitle} />)

            expect(screen.getByText(productWithLongTitle.title)).toBeInTheDocument()
        })
    })
})
