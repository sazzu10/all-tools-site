const rawUrl = (process.env.SITE_URL || '').trim();
const siteUrl = (rawUrl && !rawUrl.includes('localhost') && !rawUrl.includes('127.0.0.1'))
  ? rawUrl.replace(/\/+$/, '')
  : 'https://freetoolx.dpdns.org';

module.exports = {
  name: process.env.SITE_NAME || 'All Tools',
  url: siteUrl,
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
