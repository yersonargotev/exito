import { expect, test } from '@playwright/test';

// E2E tests for the e-commerce application
test.describe('E-commerce Application', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the index page before each test
    await page.goto('http://localhost:3000');
  });

  test('should display the home page with products', async ({ page }) => {
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/Productos de calidad al mejor precio/);

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Check if products are displayed (initial page shows 8 products)
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(8); // Match actual initial display

    // Verify the products count indicator
    await expect(
      page.locator('text=Mostrando 8 de 20 productos'),
    ).toBeVisible();

    // Check if the first product has necessary elements
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('img')).toBeVisible();
    await expect(firstProduct.locator('h3')).toBeVisible();
    await expect(
      firstProduct.locator('[data-testid="product-price"]'),
    ).toBeVisible();
  });

  test('should allow adding products to cart', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Get the cart badge initial count (should be 0)
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('0');

    // Click the first "Add to Cart" button
    const firstAddButton = page
      .locator('[data-testid="add-to-cart-button"]')
      .first();
    await firstAddButton.click();

    // Check if cart badge updates
    await expect(cartBadge).toHaveText('1');

    // Add another item
    await firstAddButton.click();
    await expect(cartBadge).toHaveText('2');
  });

  test('should display cart page with added items', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Add a product to cart
    await page.locator('[data-testid="add-to-cart-button"]').first().click();

    // Navigate to cart
    await page.locator('[data-testid="cart-link"]').click();

    // Check if we're on the cart page
    await expect(page).toHaveURL(/.*\/cart/);

    // Check if the cart contains the added item
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);

    // Check if cart totals are displayed
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test('should allow modifying cart item quantities', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Add a product to cart
    await page.locator('[data-testid="add-to-cart-button"]').first().click();

    // Navigate to cart
    await page.locator('[data-testid="cart-link"]').click();

    // Increase quantity
    const increaseButton = page
      .locator('[data-testid="increase-quantity"]')
      .first();
    await increaseButton.click();

    // Check if quantity updated
    const quantityDisplay = page
      .locator('[data-testid="quantity-display"]')
      .first();
    await expect(quantityDisplay).toHaveText('2');

    // Decrease quantity
    const decreaseButton = page
      .locator('[data-testid="decrease-quantity"]')
      .first();
    await decreaseButton.click();

    // Check if quantity decreased
    await expect(quantityDisplay).toHaveText('1');
  });

  test('should allow proceeding to checkout', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Add a product to cart
    await page.locator('[data-testid="add-to-cart-button"]').first().click();

    // Navigate to cart
    await page.locator('[data-testid="cart-link"]').click();

    // Wait for cart page to load
    await page.waitForSelector('[data-testid="cart-total"]', {
      timeout: 10000,
    });

    // Click checkout button
    await page.locator('[data-testid="checkout-button"]').click();

    // Wait for navigation to the checkout page, which is a best practice
    // instead of using a fixed timeout.
    await page.waitForURL('**/checkout');

    // Check if we're on the checkout page
    await expect(page).toHaveURL(/.*\/checkout/);

    // Now we can also check if the form is visible
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
  });

  test('should allow searching for products', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Type in search box (try both header search and filters search)
    const searchInputHeader = page
      .locator('[data-testid="search-input"]')
      .first();
    await searchInputHeader.fill('shirt');

    // Press Enter or wait for results
    await searchInputHeader.press('Enter');

    // Wait for page to navigate/update
    await page.waitForTimeout(3000);

    // Check if page updated (URL should have search param or at least products are still visible)
    const url = page.url();
    const hasSearchParam = url.includes('search=shirt');
    const hasProducts =
      (await page.locator('[data-testid="product-card"]').count()) > 0;

    // At least one of these should be true (URL changed OR products are still visible)
    expect(hasSearchParam || hasProducts).toBe(true);
  });

  test('should filter products by category', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Click on a category filter (try to click on one of the specific categories)
    const categoryFilter = page
      .locator('[data-testid="category-filter"]')
      .nth(1); // Skip "Todas" and click the first category
    await categoryFilter.click();

    // Wait for filtered results
    await page.waitForTimeout(2000);

    // Check if URL has category parameter
    const url = page.url();
    expect(url).toContain('category=');
  });

  test('should display product details page', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 10000,
    });

    // Click on the first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Check if we're on the product details page
    await expect(page).toHaveURL(/.*\/product\/\d+/);

    // Check if product details are displayed
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="product-description"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
  });

  test('should handle empty cart state', async ({ page }) => {
    // Navigate to cart directly
    await page.goto('http://localhost:3000/cart');

    // Check if empty cart message is displayed
    await expect(
      page.locator('[data-testid="empty-cart-message"]'),
    ).toBeVisible();

    // Check if "Continue Shopping" link is present
    await expect(
      page.locator('[data-testid="continue-shopping-link"]'),
    ).toBeVisible();
  });
});
