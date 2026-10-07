module.exports = {
  name: process.env.SITE_NAME || 'All Tools',
  url: process.env.SITE_URL || 'http://localhost:4000',
  description: process.env.SITE_DESCRIPTION || 'Free online utilities, creator generators, developer tools, and productivity helpers.',
  port: parseInt(process.env.PORT, 10) || 4000,
  env: process.env.NODE_ENV || 'development',
  features: {
    darkMode: true,
    globalSearch: true,
    analytics: true,
    ads: process.env.ENABLE_ADS === 'true'
  },
  navigation: {
    primary: [
      { name: 'All Tools', href: '/#all-tools' },
      { name: 'Categories', href: '/#categories' },
      { name: 'Popular', href: '/#popular' }
    ]
  }
};
