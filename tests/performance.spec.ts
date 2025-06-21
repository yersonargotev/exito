import { expect, test } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics collection
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Get Web Vitals metrics
    const webVitals = await page.evaluate(() => {
      return new Promise<{
        lcp?: number;
        cls?: number;
        fcp?: number;
        ttfb?: number;
        domContentLoaded?: number;
        loadComplete?: number;
      }>((resolve) => {
        const metrics: any = {};

        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
            }
          }
          metrics.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // FCP (First Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(
            (entry) => entry.name === 'first-contentful-paint',
          );
          if (fcpEntry) {
            metrics.fcp = fcpEntry.startTime;
          }
        }).observe({ entryTypes: ['paint'] });

        // Wait for metrics to be collected
        setTimeout(() => {
          // Get additional metrics from Navigation API
          const navigation = performance.getEntriesByType(
            'navigation',
          )[0] as any;
          if (navigation) {
            metrics.ttfb = navigation.responseStart - navigation.requestStart;
            metrics.domContentLoaded =
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart;
            metrics.loadComplete =
              navigation.loadEventEnd - navigation.loadEventStart;
          }

          resolve(metrics);
        }, 3000);
      });
    });

    console.log('Web Vitals Metrics:', webVitals);

    // Assert Core Web Vitals thresholds
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(2500); // LCP should be < 2.5s
    }

    if (webVitals.cls !== undefined) {
      expect(webVitals.cls).toBeLessThan(0.1); // CLS should be < 0.1
    }

    if (webVitals.fcp) {
      expect(webVitals.fcp).toBeLessThan(1800); // FCP should be < 1.8s
    }

    if (webVitals.ttfb) {
      expect(webVitals.ttfb).toBeLessThan(600); // TTFB should be < 600ms
    }
  });

  test('should load images efficiently', async ({ page }) => {
    // Track image loading performance
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const metrics = {
        totalImages: images.length,
        imagesWithSrc: images.filter((img) => img.src).length,
        imagesWithAlt: images.filter((img) => img.alt !== undefined).length,
        lazyImages: images.filter((img) => img.loading === 'lazy').length,
        webpImages: images.filter((img) => img.src.includes('.webp')).length,
        avifImages: images.filter((img) => img.src.includes('.avif')).length,
        failedImages: images.filter(
          (img) => img.complete === false || img.naturalWidth === 0,
        ).length,
      };

      return metrics;
    });

    console.log('Image Metrics:', imageMetrics);

    // Assertions
    expect(imageMetrics.totalImages).toBeGreaterThan(0);
    expect(imageMetrics.imagesWithSrc).toBe(imageMetrics.totalImages);
    expect(imageMetrics.imagesWithAlt).toBe(imageMetrics.totalImages); // All images should have alt text
    expect(imageMetrics.lazyImages).toBeGreaterThan(0); // Should use lazy loading
    expect(imageMetrics.failedImages).toBe(0); // No broken images

    // Modern formats should be used
    const modernFormats = imageMetrics.webpImages + imageMetrics.avifImages;
    expect(modernFormats).toBeGreaterThan(0);
  });

  test('should optimize JavaScript bundles', async ({ page }) => {
    // Get resource loading metrics
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter((r) => r.name.includes('.js'));
      const cssResources = resources.filter((r) => r.name.includes('.css'));

      const metrics = {
        totalJS: jsResources.length,
        totalCSS: cssResources.length,
        jsSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        cssSize: cssResources.reduce(
          (sum, r) => sum + (r.transferSize || 0),
          0,
        ),
        slowResources: resources.filter((r) => r.duration > 1000).length,
        cachedResources: resources.filter(
          (r) => r.transferSize === 0 && r.decodedBodySize > 0,
        ).length,
      };

      return metrics;
    });

    console.log('Resource Metrics:', resourceMetrics);

    // JavaScript bundle size should be reasonable (< 1MB total)
    expect(resourceMetrics.jsSize).toBeLessThan(1024 * 1024);

    // CSS should be optimized (< 100KB)
    expect(resourceMetrics.cssSize).toBeLessThan(100 * 1024);

    // No resources should take more than 1 second to load
    expect(resourceMetrics.slowResources).toBe(0);
  });

  test('should handle network conditions efficiently', async ({
    page,
    context,
  }) => {
    // Test with slow 3G network simulation
    await context.route('**/*', async (route) => {
      const url = route.request().url();

      // Simulate network delay for non-critical resources
      if (!url.includes('critical') && !url.includes('inline')) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Page should load in reasonable time even with network simulation
    expect(loadTime).toBeLessThan(5000); // 5 seconds max

    // Critical content should be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should prefetch critical resources', async ({ page }) => {
    // Check for resource hints
    const resourceHints = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link'));
      return {
        preload: links.filter((l) => l.rel === 'preload').length,
        prefetch: links.filter((l) => l.rel === 'prefetch').length,
        preconnect: links.filter((l) => l.rel === 'preconnect').length,
        dnsPrefetch: links.filter((l) => l.rel === 'dns-prefetch').length,
        modulePreload: links.filter((l) => l.rel === 'modulepreload').length,
      };
    });

    console.log('Resource Hints:', resourceHints);

    // Should have resource hints for optimization
    const totalHints = Object.values(resourceHints).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(totalHints).toBeGreaterThan(0);
  });

  test('should optimize font loading', async ({ page }) => {
    // Check font loading strategy
    const fontMetrics = await page.evaluate(() => {
      const fontFaces = Array.from(document.fonts);
      const fontLinks = Array.from(
        document.querySelectorAll('link[href*="font"]'),
      ) as HTMLLinkElement[];

      return {
        totalFonts: fontFaces.length,
        loadedFonts: fontFaces.filter((f) => f.status === 'loaded').length,
        fontPreloads: fontLinks.filter((l) => l.rel === 'preload').length,
        fontDisplay: fontLinks.some((l) => l.href.includes('display=swap')),
        webFonts: fontFaces.filter(
          (f) => f.family.includes('Google') || f.family.includes('Roboto'),
        ).length,
      };
    });

    console.log('Font Metrics:', fontMetrics);

    // Fonts should be optimized
    if (fontMetrics.totalFonts > 0) {
      // Most fonts should be loaded
      const loadRatio = fontMetrics.loadedFonts / fontMetrics.totalFonts;
      expect(loadRatio).toBeGreaterThan(0.8);
    }

    // Should use font-display: swap for web fonts
    if (fontMetrics.webFonts > 0) {
      expect(fontMetrics.fontDisplay).toBeTruthy();
    }
  });

  test('should minimize layout shifts', async ({ page }) => {
    // Monitor layout shifts during page interaction
    const layoutShifts: any[] = [];

    await page.addInitScript(() => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            (window as any).layoutShifts = (window as any).layoutShifts || [];
            (window as any).layoutShifts.push({
              value: layoutShift.value,
              time: layoutShift.startTime,
              sources: layoutShift.sources?.map((s: any) => ({
                node: s.node?.tagName,
                previousRect: s.previousRect,
                currentRect: s.currentRect,
              })),
            });
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });

    // Interact with the page
    await page.click('button', { timeout: 5000 }).catch(() => {}); // Ignore if no buttons
    await page.hover('a').catch(() => {}); // Ignore if no links

    // Wait for potential layout shifts
    await page.waitForTimeout(2000);

    const shifts = await page.evaluate(
      () => (window as any).layoutShifts || [],
    );

    console.log('Layout Shifts:', shifts);

    // Calculate total CLS
    const totalCLS = shifts.reduce(
      (sum: number, shift: any) => sum + shift.value,
      0,
    );
    expect(totalCLS).toBeLessThan(0.1); // CLS should be minimal
  });

  test('should handle large lists efficiently', async ({ page }) => {
    // Navigate to a page with products list
    await page.goto('/');

    // Scroll to trigger lazy loading
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2),
    );
    await page.waitForTimeout(1000);

    // Check for virtual scrolling or pagination
    const listMetrics = await page.evaluate(() => {
      const productElements = document.querySelectorAll(
        '[data-testid="product-card"], .product-card, [class*="product"]',
      );
      const visibleElements = Array.from(productElements).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      return {
        totalProducts: productElements.length,
        visibleProducts: visibleElements.length,
        hasVirtualization: productElements.length > visibleElements.length + 10, // More than 10 items difference suggests virtualization
        hasPagination:
          document.querySelector(
            '[aria-label*="pagination"], .pagination, [class*="page"]',
          ) !== null,
      };
    });

    console.log('List Metrics:', listMetrics);

    // Large lists should be optimized
    if (listMetrics.totalProducts > 20) {
      expect(
        listMetrics.hasVirtualization || listMetrics.hasPagination,
      ).toBeTruthy();
    }
  });

  test('should compress responses', async ({ page }) => {
    // Check compression headers
    const responses: any[] = [];

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        headers: response.headers(),
        size: response.headers()['content-length'],
        compression: response.headers()['content-encoding'],
      });
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that text resources are compressed
    const textResponses = responses.filter(
      (r: any) =>
        r.headers['content-type']?.includes('text/') ||
        r.headers['content-type']?.includes('application/javascript') ||
        r.headers['content-type']?.includes('application/json'),
    );

    const compressedResponses = textResponses.filter(
      (r: any) =>
        r.compression === 'gzip' ||
        r.compression === 'br' ||
        r.compression === 'deflate',
    );

    // Most text responses should be compressed
    if (textResponses.length > 0) {
      const compressionRatio =
        compressedResponses.length / textResponses.length;
      expect(compressionRatio).toBeGreaterThan(0.5); // At least 50% should be compressed
    }
  });
});
