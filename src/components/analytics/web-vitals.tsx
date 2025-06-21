'use client';

import { useEffect } from 'react';
import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    // Core Web Vitals
    onCLS((metric: Metric) => {
      console.log('[Web Vitals] CLS:', metric);
      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Core Web Vitals',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000),
          custom_map: { metric_id: metric.id },
        });
      }
    });

    onLCP((metric: Metric) => {
      console.log('[Web Vitals] LCP:', metric);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Core Web Vitals',
          event_label: 'LCP',
          value: Math.round(metric.value),
          custom_map: { metric_id: metric.id },
        });
      }
    });

    onINP((metric: Metric) => {
      console.log('[Web Vitals] INP:', metric);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Core Web Vitals',
          event_label: 'INP',
          value: Math.round(metric.value),
          custom_map: { metric_id: metric.id },
        });
      }
    });

    // Other valuable metrics
    onFCP((metric: Metric) => {
      console.log('[Web Vitals] FCP:', metric);
    });

    onTTFB((metric: Metric) => {
      console.log('[Web Vitals] TTFB:', metric);
    });
  }, []);

  return null;
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      parameters?: Record<string, any>,
    ) => void;
  }
}
