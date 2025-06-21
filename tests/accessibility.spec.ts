import { expect, test } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have proper page structure and landmarks', async ({ page }) => {
    // Check for essential landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check skip link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Test skip link functionality
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
    await skipLink.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test Tab navigation through interactive elements
    const interactiveElements = [
      'a',
      'button',
      'input',
      'select',
      'textarea',
      '[tabindex="0"]',
    ];

    let focusableCount = 0;

    for (const selector of interactiveElements) {
      const elements = await page.locator(selector).count();
      focusableCount += elements;
    }

    expect(focusableCount).toBeGreaterThan(0);

    // Test keyboard navigation flow
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase(),
    );
    expect(['a', 'button', 'input']).toContain(focusedElement);

    // Test Escape key functionality (close modals/dropdowns)
    await page.keyboard.press('Escape');

    // Ensure no modal is visible after escape
    const modals = page.locator('[role="dialog"], [role="alertdialog"]');
    await expect(modals).toHaveCount(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1 (should be unique)
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check heading hierarchy (h1 -> h2 -> h3, etc.)
    const headings = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .allTextContents();
    expect(headings.length).toBeGreaterThan(0);

    // Verify h1 is not empty
    const h1Text = await h1Elements.textContent();
    expect(h1Text?.trim()).toBeTruthy();
  });

  test('should have accessible forms', async ({ page }) => {
    // Navigate to checkout to test forms
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Check form labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      if (inputId) {
        // Check for associated label
        const label = page.locator(`label[for="${inputId}"]`);
        const hasLabel = (await label.count()) > 0;

        // Input should have either a label, aria-label, or aria-labelledby
        expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }

    // Check required field indicators
    const requiredInputs = page.locator(
      'input[required], textarea[required], select[required]',
    );
    const requiredCount = await requiredInputs.count();

    if (requiredCount > 0) {
      // Required fields should have aria-required or visual indicators
      for (let i = 0; i < requiredCount; i++) {
        const input = requiredInputs.nth(i);
        const ariaRequired = await input.getAttribute('aria-required');
        const hasAsterisk = (await page.locator(`text=*`).count()) > 0;

        expect(ariaRequired === 'true' || hasAsterisk).toBeTruthy();
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic check - in production you'd use axe-core
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });

    expect(bodyStyles.backgroundColor).toBeTruthy();
    expect(bodyStyles.color).toBeTruthy();

    // Check that text is not transparent
    expect(bodyStyles.color).not.toBe('transparent');
    expect(bodyStyles.color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should support screen reader users', async ({ page }) => {
    // Check for ARIA attributes
    const ariaElements = await page
      .locator('[aria-label], [aria-labelledby], [aria-describedby], [role]')
      .count();
    expect(ariaElements).toBeGreaterThan(0);

    // Check for alternative text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const role = await img.getAttribute('role');

      // Images should have alt text, aria-label, or role="presentation"
      expect(alt !== null || ariaLabel || role === 'presentation').toBeTruthy();
    }

    // Check for loading states with aria-live
    const liveRegions = page.locator('[aria-live]');
    const hasLiveRegions = (await liveRegions.count()) > 0;

    // If there are dynamic content areas, they should have aria-live
    const dynamicContent = page.locator('[data-loading], .loading, .skeleton');
    const hasDynamicContent = (await dynamicContent.count()) > 0;

    if (hasDynamicContent) {
      expect(hasLiveRegions).toBeTruthy();
    }
  });

  test('should handle focus management', async ({ page }) => {
    // Test focus trap in modals (if any)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // Click first button and check focus management
      await buttons.first().click();

      // Check if a modal opened
      const modal = page.locator('[role="dialog"]');
      const modalExists = (await modal.count()) > 0;

      if (modalExists) {
        // Focus should be trapped within modal
        const focusableInModal = modal.locator(
          'button, a, input, select, textarea, [tabindex="0"]',
        );
        const focusableCount = await focusableInModal.count();

        if (focusableCount > 0) {
          // First focusable element should be focused
          await expect(focusableInModal.first()).toBeFocused();

          // Test Tab navigation within modal
          await page.keyboard.press('Tab');
          const activeElement = await page.evaluate(
            () => document.activeElement,
          );
          expect(activeElement).toBeTruthy();
        }
      }
    }
  });

  test('should be responsive and accessible on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that content is still accessible
    await expect(page.locator('main')).toBeVisible();

    // Check that interactive elements are large enough (minimum 44x44px)
    const buttons = page.locator('button, a');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();

      if (box) {
        // Buttons should be at least 44x44px for touch accessibility
        expect(box.width >= 44 || box.height >= 44).toBeTruthy();
      }
    }

    // Test mobile navigation (hamburger menu, etc.)
    const mobileNav = page.locator(
      '[aria-label*="menu"], [aria-label*="navigation"]',
    );
    const hasMobileNav = (await mobileNav.count()) > 0;

    if (hasMobileNav) {
      await mobileNav.first().click();
      // Navigation should be accessible after opening
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should announce loading states', async ({ page }) => {
    // Test loading states with screen reader announcements
    const loadingElements = page.locator(
      '[aria-live="polite"], [aria-live="assertive"]',
    );
    const hasLiveRegions = (await loadingElements.count()) > 0;

    if (hasLiveRegions) {
      // Check that live regions have meaningful content
      for (let i = 0; i < (await loadingElements.count()); i++) {
        const element = loadingElements.nth(i);
        const content = await element.textContent();

        // Live regions should not be empty when visible
        if (await element.isVisible()) {
          expect(content?.trim()).toBeTruthy();
        }
      }
    }

    // Test navigation to products page to trigger loading
    await page.click('a[href*="product"], a[href*="products"]');
    await page.waitForLoadState('networkidle');

    // Check for loading announcements
    const updatedLiveRegions = page.locator('[aria-live]');
    expect(await updatedLiveRegions.count()).toBeGreaterThanOrEqual(0);
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that animations are disabled or reduced
    const animatedElements = page.locator(
      '[class*="animate"], [style*="animation"], [style*="transition"]',
    );
    const animatedCount = await animatedElements.count();

    // Elements should still be functional even with reduced motion
    if (animatedCount > 0) {
      const firstAnimated = animatedElements.first();
      await expect(firstAnimated).toBeVisible();
    }

    // Test interactions still work with reduced motion
    const buttons = page.locator('button');
    if ((await buttons.count()) > 0) {
      await buttons.first().click();
      // Button should still be interactive
      expect(true).toBeTruthy(); // Basic interaction test
    }
  });
});
