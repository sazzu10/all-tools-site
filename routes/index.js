const express = require('express');
const router = express.Router();
const registry = require('../registry/registry');
const appConfig = require('../config/app');

// Homepage
router.get('/', (req, res) => {
  const tools = registry.getAllTools();
  const popularTools = registry.getPopularTools();
  const categories = registry.getCategoriesWithCounts();

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": appConfig.name,
      "url": appConfig.url,
      "description": appConfig.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${appConfig.url}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  res.render('pages/home', {
    title: appConfig.name + ' • Free Online Utilities & Creator Tools',
    metaDescription: appConfig.description,
    canonicalUrl: appConfig.url,
    currentPath: '/',
    tools,
    popularTools,
    categories,
    schemaData,
    body: null
  });
});

// Category Page
router.get('/category/:slug', (req, res) => {
  const { slug } = req.params;
  const category = registry.getCategoryBySlug(slug);

  if (!category) {
    return res.status(404).render('pages/404', {
      title: 'Category Not Found • All Tools',
      metaDescription: 'Category not found',
      currentPath: req.originalUrl,
      body: null
    });
  }

  const tools = registry.getToolsByCategory(category.id || category.slug);

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category.name} • Free Online Utilities`,
      "description": category.description,
      "url": `${appConfig.url}/category/${slug}`,
      "hasPart": tools.map(t => ({
        "@type": "SoftwareApplication",
        "name": t.name,
        "description": t.description,
        "url": `${appConfig.url}/tools/${t.slug}`
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": appConfig.url
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category.name,
          "item": `${appConfig.url}/category/${slug}`
        }
      ]
    }
  ];

  res.render('pages/category', {
    title: `${category.name} • Free Online Utilities`,
    metaDescription: category.description,
    canonicalUrl: `${appConfig.url}/category/${slug}`,
    currentPath: `/category/${slug}`,
    category,
    tools,
    schemaData,
    body: null
  });
});

// Privacy Policy Page
router.get('/privacy', (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy • All Tools Platform',
    metaDescription: 'Learn how All Tools protects your privacy with client-side processing, zero data retention, and zero tracking cookies.',
    canonicalUrl: `${appConfig.url}/privacy`,
    currentPath: '/privacy',
    body: null
  });
});

// Terms of Service Page
router.get('/terms', (req, res) => {
  res.render('pages/terms', {
    title: 'Terms of Service • All Tools Platform',
    metaDescription: 'Terms of Service for All Tools Platform. Transparent, free-to-use terms for all creator and developer utilities.',
    canonicalUrl: `${appConfig.url}/terms`,
    currentPath: '/terms',
    body: null
  });
});

// Disclaimer Page
router.get('/disclaimer', (req, res) => {
  res.render('pages/disclaimer', {
    title: 'Platform Disclaimer • All Tools Platform',
    metaDescription: 'Important disclaimers regarding generative AI outputs, mathematical conversions, and trademark non-affiliation.',
    canonicalUrl: `${appConfig.url}/disclaimer`,
    currentPath: '/disclaimer',
    body: null
  });
});

// About Us Page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us • All Tools Platform',
    metaDescription: 'Learn about the All Tools Platform: fast, private, free web utilities and generative AI assistants built for creators and developers.',
    canonicalUrl: `${appConfig.url}/about`,
    currentPath: '/about',
    body: null
  });
});

// Contact & Support Page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact & Support • All Tools Platform',
    metaDescription: 'Get in touch with the All Tools team for support, feature suggestions, bug reports, and partnership inquiries.',
    canonicalUrl: `${appConfig.url}/contact`,
    currentPath: '/contact',
    body: null
  });
});

// Health Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    toolsCount: registry.getAllTools().length,
    version: '1.0.0'
  });
});

// Search JSON API for client-side search modal
router.get('/api/tools', (req, res) => {
  const { q } = req.query;
  const tools = registry.searchTools(q);
  res.json({
    ok: true,
    total: tools.length,
    tools: tools.map(t => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      category: t.category,
      description: t.description,
      icon: t.icon,
      badges: t.badges
    }))
  });
});

module.exports = router;
