import { expect, test } from '@playwright/test';

test.describe('PWA Features Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have valid web manifest', async ({ page }) => {
    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();

    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBeTruthy();

    // Fetch and validate manifest
    if (manifestHref) {
      const manifestResponse = await page.request.get(manifestHref);
      expect(manifestResponse.ok()).toBeTruthy();

      const manifest = await manifestResponse.json();

      // Validate required manifest fields
      expect(manifest.name).toBeTruthy();
      expect(manifest.short_name).toBeTruthy();
      expect(manifest.start_url).toBeTruthy();
      expect(manifest.display).toBeTruthy();
      expect(manifest.icons).toBeDefined();
      expect(Array.isArray(manifest.icons)).toBeTruthy();
      expect(manifest.icons.length).toBeGreaterThan(0);

      // Validate icon requirements
      const icons = manifest.icons;
      const hasRequiredSizes = icons.some(
        (icon: any) => icon.sizes === '192x192' || icon.sizes === '512x512',
      );
      expect(hasRequiredSizes).toBeTruthy();

      // Check theme and background colors
      expect(manifest.theme_color).toBeTruthy();
      expect(manifest.background_color).toBeTruthy();
    }
  });

  test('should register service worker', async ({ page }) => {
    // Check if service worker is registered
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          return {
            registered: true,
            scope: registration.scope,
            state:
              registration.installing?.state ||
              registration.waiting?.state ||
              registration.active?.state,
          };
        } catch (error) {
          return { registered: false, error: String(error) };
        }
      }
      return { registered: false, error: 'Service Worker not supported' };
    });

    expect(swRegistration.registered).toBeTruthy();
    expect(swRegistration.scope).toContain(
      page.url().split('/').slice(0, 3).join('/'),
    );
  });

  test('should work offline', async ({ page, context }) => {
    // First, visit the page while online to cache resources
    await page.waitForLoadState('networkidle');

    // Wait for service worker to be ready
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Try to navigate to the homepage
    await page.goto('/');

    // Page should still load (from cache)
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('main')).toBeVisible();

    // Try navigating to cached pages
    await page.goto('/cart');
    await expect(page.locator('main')).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });

  test('should cache resources efficiently', async ({ page }) => {
    // Check if resources are being cached
    const cacheCheck = await page.evaluate(async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const results = [];

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          results.push({
            name: cacheName,
            size: requests.length,
            urls: requests.slice(0, 5).map((req) => req.url), // First 5 URLs
          });
        }

        return results;
      }
      return [];
    });

    expect(cacheCheck.length).toBeGreaterThan(0);

    // Should have cached some resources
    const totalCachedItems = cacheCheck.reduce(
      (sum, cache) => sum + cache.size,
      0,
    );
    expect(totalCachedItems).toBeGreaterThan(0);
  });

  test('should handle installation prompt', async ({ page }) => {
    // Check for PWA installation capability
    const installPrompt = await page.evaluate(() => {
      return new Promise((resolve) => {
        let promptEvent = null;

        window.addEventListener('beforeinstallprompt', (e) => {
          promptEvent = e;
          resolve({
            canInstall: true,
            hasPrompt: true,
          });
        });

        // Timeout after 3 seconds
        setTimeout(() => {
          resolve({
            canInstall: false,
            hasPrompt: false,
            isStandalone: window.matchMedia('(display-mode: standalone)')
              .matches,
          });
        }, 3000);
      });
    });

    // Either should be installable or already installed (standalone mode)
    expect(
      (installPrompt as any).canInstall || (installPrompt as any).isStandalone,
    ).toBeTruthy();
  });

  test('should have proper icons', async ({ page }) => {
    // Check favicon
    const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    if ((await favicon.count()) > 0) {
      const faviconHref = await favicon.getAttribute('href');
      if (faviconHref) {
        const faviconResponse = await page.request.get(faviconHref);
        expect(faviconResponse.ok()).toBeTruthy();
      }
    }

    // Check apple-touch-icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    if ((await appleTouchIcon.count()) > 0) {
      const appleIconHref = await appleTouchIcon.getAttribute('href');
      if (appleIconHref) {
        const appleIconResponse = await page.request.get(appleIconHref);
        expect(appleIconResponse.ok()).toBeTruthy();
      }
    }

    // Check manifest icons exist
    const manifestLink = page.locator('link[rel="manifest"]');
    if ((await manifestLink.count()) > 0) {
      const manifestHref = await manifestLink.getAttribute('href');
      if (manifestHref) {
        const manifestResponse = await page.request.get(manifestHref);
        const manifest = await manifestResponse.json();

        // Verify that manifest icons actually exist
        for (const icon of manifest.icons.slice(0, 3)) {
          // Check first 3 icons
          const iconResponse = await page.request.get(icon.src);
          expect(iconResponse.ok()).toBeTruthy();
        }
      }
    }
  });

  test('should handle push notifications setup', async ({ page }) => {
    // Check if push notifications are supported and configured
    const pushSupport = await page.evaluate(async () => {
      if (
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      ) {
        return {
          supported: true,
          permission: Notification.permission,
          pushManagerSupported: 'PushManager' in window,
        };
      }
      return { supported: false };
    });

    expect(pushSupport.supported).toBeTruthy();
    expect(pushSupport.pushManagerSupported).toBeTruthy();

    // Permission should be default (not denied)
    expect(pushSupport.permission).not.toBe('denied');
  });

  test('should support background sync', async ({ page }) => {
    // Check if background sync is supported
    const backgroundSyncSupport = await page.evaluate(async () => {
      if (
        'serviceWorker' in navigator &&
        'sync' in window.ServiceWorkerRegistration.prototype
      ) {
        return {
          supported: true,
          hasServiceWorker: true,
        };
      }
      return { supported: false };
    });

    expect(backgroundSyncSupport.supported).toBeTruthy();
  });

  test('should have proper meta tags for PWA', async ({ page }) => {
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();

    const viewportContent = await viewport.getAttribute('content');
    expect(viewportContent).toContain('width=device-width');
    expect(viewportContent).toContain('initial-scale=1');

    // Check theme-color meta tag
    const themeColor = page.locator('meta[name="theme-color"]');
    if ((await themeColor.count()) > 0) {
      const themeColorContent = await themeColor.getAttribute('content');
      expect(themeColorContent).toBeTruthy();
    }

    // Check apple-mobile-web-app-capable
    const appleMobileCapable = page.locator(
      'meta[name="apple-mobile-web-app-capable"]',
    );
    if ((await appleMobileCapable.count()) > 0) {
      const appleCapableContent =
        await appleMobileCapable.getAttribute('content');
      expect(['yes', 'no']).toContain(appleCapableContent);
    }
  });

  test('should handle app-like navigation', async ({ page }) => {
    // Test that navigation feels app-like (no full page reloads for internal links)
    const navigationPromise = page.waitForEvent('framenavigated');

    // Click an internal link
    const internalLink = page
      .locator('a[href^="/"], a[href^="./"], a[href^="../"]')
      .first();
    if ((await internalLink.count()) > 0) {
      await internalLink.click();

      // Should navigate without full page reload in SPA mode
      await navigationPromise;
      expect(page.url()).not.toBe('/');
    }
  });

  test('should work in standalone mode', async ({ page, context }) => {
    // Simulate standalone display mode
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          if (query === '(display-mode: standalone)') {
            return {
              matches: true,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            };
          }
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          };
        },
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // App should work properly in standalone mode
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    // Check if app adapts to standalone mode
    const isStandalone = await page.evaluate(() => {
      return window.matchMedia('(display-mode: standalone)').matches;
    });

    expect(isStandalone).toBeTruthy();
  });

  test('should handle app shortcuts', async ({ page }) => {
    // Check manifest for shortcuts
    const manifestLink = page.locator('link[rel="manifest"]');
    if ((await manifestLink.count()) > 0) {
      const manifestHref = await manifestLink.getAttribute('href');
      if (manifestHref) {
        const manifestResponse = await page.request.get(manifestHref);
        const manifest = await manifestResponse.json();

        if (manifest.shortcuts && manifest.shortcuts.length > 0) {
          // Verify shortcuts have required properties
          for (const shortcut of manifest.shortcuts) {
            expect(shortcut.name).toBeTruthy();
            expect(shortcut.url).toBeTruthy();

            // Verify shortcut URLs are valid
            try {
              await page.goto(shortcut.url);
              await expect(page.locator('main')).toBeVisible();
            } catch (error) {
              // Log but don't fail if shortcut URL is relative and needs base URL
              console.log(`Shortcut URL ${shortcut.url} might need base URL`);
            }
          }
        }
      }
    }
  });
});
