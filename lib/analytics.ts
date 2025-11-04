// Google Analytics and Google Ads tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Analytics event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Conversion event types for Google Ads
export type ConversionEvent = 
  | 'quotation_request'
  | 'contact_form_submission'
  | 'whatsapp_click'
  | 'phone_call_click';

// Enhanced tracking events for Google Analytics
export type EngagementEvent =
  | 'product_catalog_view'
  | 'product_interest'
  | 'page_engagement'
  | 'file_download'
  | 'scroll_depth'
  | 'time_on_page';

/**
 * Track a conversion event for both Google Ads and Google Analytics
 */
export const trackConversion = (
  event: ConversionEvent,
  value?: number,
  customParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Track for Google Ads (conversion)
  window.gtag('event', 'conversion', {
    send_to: 'AW-17438158871/' + event,
    value: value || 1,
    currency: 'SAR',
    ...customParams
  });

  // Track for Google Analytics (custom event)
  window.gtag('event', event, {
    event_category: 'conversions',
    event_label: event,
    value: value || 1,
    ...customParams
  });

  console.log(`Conversion tracked: ${event}`, { value, customParams });
};

/**
 * Track engagement events for Google Analytics only
 */
export const trackEngagement = (
  event: EngagementEvent,
  customParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', event, {
    event_category: 'engagement',
    event_label: event,
    ...customParams
  });

  console.log(`Engagement tracked: ${event}`, customParams);
};

/**
 * Track quotation request submission
 */
export const trackQuotationRequest = (data: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  itemCount: number;
  totalValue?: number;
}) => {
  trackConversion('quotation_request', data.totalValue, {
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    company_name: data.companyName,
    item_count: data.itemCount
  });
};

/**
 * Track contact form submission
 */
export const trackContactSubmission = (data: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  subject: string;
}) => {
  trackConversion('contact_form_submission', 1, {
    contact_name: data.name,
    contact_email: data.email,
    contact_phone: data.phone,
    contact_company: data.company,
    contact_subject: data.subject
  });
};

/**
 * Track WhatsApp button clicks
 */
export const trackWhatsAppClick = (source: string, message?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Track for Google Ads with specific conversion label
  window.gtag('event', 'conversion', {
    send_to: 'AW-17438158871/Xix9CMa37LkbEJfglPtA',
    event_category: 'conversions',
    event_label: 'whatsapp_click',
    value: 1,
    click_source: source,
    message_type: message ? 'custom' : 'default'
  });

  // Also track for Google Analytics
  window.gtag('event', 'whatsapp_click', {
    event_category: 'conversions',
    event_label: 'whatsapp_click',
    click_source: source,
    message_type: message ? 'custom' : 'default'
  });

  console.log(`Conversion tracked: whatsapp_click`, { source, message });
};

/**
 * Track phone call clicks
 */
export const trackPhoneClick = (source: string, phoneNumber: string) => {
  trackConversion('phone_call_click', 1, {
    click_source: source,
    phone_number: phoneNumber
  });
};

/**
 * Track product catalog interactions
 */
export const trackProductView = (productId: string, productName: string, category: string) => {
  trackEngagement('product_catalog_view', {
    product_id: productId,
    product_name: productName,
    product_category: category
  });
};

/**
 * Track when users add items to cart (show interest)
 */
export const trackProductInterest = (productId: string, productName: string, quantity: number) => {
  trackEngagement('product_interest', {
    product_id: productId,
    product_name: productName,
    quantity: quantity
  });
};

/**
 * Track file downloads
 */
export const trackFileDownload = (fileName: string, fileType: string, source: string) => {
  trackEngagement('file_download', {
    file_name: fileName,
    file_type: fileType,
    download_source: source
  });
};

/**
 * Track scroll depth on important pages
 */
export const trackScrollDepth = (page: string, depth: number) => {
  trackEngagement('scroll_depth', {
    page_path: page,
    scroll_depth: depth
  });
};

/**
 * Track time spent on page
 */
export const trackTimeOnPage = (page: string, timeInSeconds: number) => {
  trackEngagement('time_on_page', {
    page_path: page,
    time_seconds: timeInSeconds
  });
};

/**
 * Initialize scroll depth tracking for a page
 */
export const initScrollTracking = (pageName: string) => {
  if (typeof window === 'undefined') return;

  let maxScroll = 0;
  const trackingThresholds = [25, 50, 75, 90, 100];
  const trackedThresholds = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      // Track milestone thresholds
      trackingThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackScrollDepth(pageName, threshold);
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Initialize time tracking for a page
 */
export const initTimeTracking = (pageName: string) => {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();
  let tracked30s = false;
  let tracked60s = false;
  let tracked120s = false;

  const trackTimeInterval = setInterval(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    if (timeSpent >= 30 && !tracked30s) {
      tracked30s = true;
      trackTimeOnPage(pageName, 30);
    } else if (timeSpent >= 60 && !tracked60s) {
      tracked60s = true;
      trackTimeOnPage(pageName, 60);
    } else if (timeSpent >= 120 && !tracked120s) {
      tracked120s = true;
      trackTimeOnPage(pageName, 120);
      clearInterval(trackTimeInterval);
    }
  }, 5000); // Check every 5 seconds

  // Cleanup function
  return () => {
    clearInterval(trackTimeInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    if (finalTime >= 10) { // Only track if user spent at least 10 seconds
      trackTimeOnPage(pageName, finalTime);
    }
  };
};
