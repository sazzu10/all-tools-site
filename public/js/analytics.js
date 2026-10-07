(function () {
  /**
   * Privacy-Friendly Analytics Abstraction
   * Captures usage metrics without storing personal information or secrets.
   */
  window.trackEvent = function (eventName, properties = {}) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      ...properties
    };

    // Console logging in local environments
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[AllTools Analytics] ${eventName}:`, payload);
    }

    // Google Analytics 4 integration (if loaded)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties);
    }

    // Plausible Analytics integration (if loaded)
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: properties });
    }
  };

  // Automatically track initial page view
  document.addEventListener('DOMContentLoaded', () => {
    window.trackEvent('page_view', {
      title: document.title,
      referrer: document.referrer || null,
      theme: document.documentElement.getAttribute('data-theme') || 'dark'
    });

    // Track search palette opens
    const searchInputs = document.querySelectorAll('input[onclick*="openSearchModal"], button[onclick*="openSearchModal"]');
    searchInputs.forEach(btn => {
      btn.addEventListener('click', () => {
        window.trackEvent('search_modal_open');
      });
    });

    // Track theme toggle clicks
    const themeToggles = document.querySelectorAll('button[onclick*="toggleTheme"]');
    themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        window.trackEvent('theme_toggle', { next_theme: nextTheme });
      });
    });
  });
})();
