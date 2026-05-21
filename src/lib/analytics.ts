// Global Google Tag API type definitions for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-5B71EWD0VM';

/**
 * Handles the async injection and initialization of Google Analytics 4.
 * Safeguarded against multiple invocations and server-side evaluation.
 */
export function initializeGA() {
  if (typeof window === 'undefined') return;

  // Initialize the global dataLayer array
  window.dataLayer = window.dataLayer || [];

  // Implement target gtag proxy function
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  // Inject standard gtag.js asynchronous script from Google CDN if not existing
  const scriptId = 'google-analytics-tag';
  const tagScript = document.getElementById(scriptId);

  if (!tagScript) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Baseline config setup
    window.gtag('js', new Date());
    
    // We disable automated send_page_view from Google
    // so we can fire high-precision contextual virtual page_views manually
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure',
    });

    console.log(`[Google Analytics] Configured GA4 library with ID: ${GA_MEASUREMENT_ID}`);
  }
}

/**
 * Dispatches a high-precision Page View event to the measurement payload.
 * Custom built for single page state navigation routes.
 * 
 * @param pageTitle The human-readable title of the active view.
 * @param pagePath The virtual URL path matching the context of the view.
 */
export function trackPageView(pageTitle: string, pagePath: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
    send_to: GA_MEASUREMENT_ID,
  });

  console.log(`[Google Analytics] Logged PageView: ${pageTitle} -> ${pagePath}`);
}

/**
 * Tracks custom user interactions and business goals (conversions, filtering, contact methods).
 * 
 * @param eventName The name of the custom action.
 * @param params Additional metadata properties.
 */
export function trackCustomEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  });

  console.log(`[Google Analytics] Logged Event: "${eventName}"`, params);
}
