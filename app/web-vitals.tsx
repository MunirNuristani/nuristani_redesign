'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      });

      // Send to your analytics endpoint
      // You can use Firebase Analytics, Google Analytics, or custom endpoint
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/vitals', body);
      } else {
        fetch('/api/analytics/vitals', { body, method: 'POST', keepalive: true });
      }
    }
  });

  return null;
}
