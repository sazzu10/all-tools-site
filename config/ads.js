/**
 * Advertising & Monetization Configuration
 * Pre-configured for Google AdSense & direct sponsorships.
 * Note: Never hardcode publisher credentials; read safely from environment variables.
 */

module.exports = {
  // Master toggle for advertising rendering
  enabled: process.env.ENABLE_ADS === 'true',

  // Google AdSense Publisher Client ID (e.g., 'ca-pub-XXXXXXXXXXXXXXXX')
  // Placeholder is empty until official approval and account configuration
  adsensePublisherId: process.env.ADSENSE_PUBLISHER_ID || process.env.ADS_CLIENT_ID || '',

  // Subtle visual placeholder toggle during pre-monetization/testing
  showPlaceholders: process.env.SHOW_AD_PLACEHOLDERS !== 'false',

  // Pro subscription / sponsor banner toggle
  showProBanner: process.env.SHOW_PRO_BANNER !== 'false',

  // Configured Ad Placements (CLS-protected fixed/min dimensions)
  slots: {
    // 1. Homepage Placements
    homeTop: {
      id: 'home-top-banner',
      format: 'banner',
      minHeight: '90px',
      maxWidth: '1024px',
      label: 'Sponsored Placement',
      description: 'Placed below hero search and value proposition pillars'
    },
    homeMid: {
      id: 'home-mid-banner',
      format: 'banner',
      minHeight: '90px',
      maxWidth: '1024px',
      label: 'Sponsored Recommendation',
      description: 'Placed between Category Directory and All Tools Catalog'
    },
    homeBottom: {
      id: 'home-bottom-banner',
      format: 'rectangle',
      minHeight: '250px',
      maxWidth: '1024px',
      label: 'Featured Partner',
      description: 'Placed before footer on homepage'
    },

    // 2. Category Page Placements
    categoryTop: {
      id: 'category-top-banner',
      format: 'banner',
      minHeight: '90px',
      maxWidth: '1024px',
      label: 'Sponsored Placement',
      description: 'Placed after category header banner'
    },
    categoryBottom: {
      id: 'category-bottom-banner',
      format: 'rectangle',
      minHeight: '250px',
      maxWidth: '1024px',
      label: 'Sponsored Recommendation',
      description: 'Placed before footer on category page'
    },

    // 3. Tool Workspace Placements
    toolTop: {
      id: 'tool-top-banner',
      format: 'small',
      minHeight: '60px',
      maxWidth: '1024px',
      label: 'Sponsored Placement',
      description: 'Placed below tool header card'
    },
    toolMid: {
      id: 'tool-mid-banner',
      format: 'banner',
      minHeight: '90px',
      maxWidth: '1024px',
      label: 'Sponsored Recommendation',
      description: 'Placed between workspace output and FAQs'
    },
    toolBottom: {
      id: 'tool-bottom-banner',
      format: 'rectangle',
      minHeight: '250px',
      maxWidth: '1024px',
      label: 'Featured Sponsor',
      description: 'Placed between FAQs and Related Tools'
    }
  }
};
