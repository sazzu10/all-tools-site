const express = require('express');
const router = express.Router();
const registry = require('../registry/registry');
const appConfig = require('../config/app');

// Helper to resolve clean canonical baseUrl (never localhost)
function getBaseUrl() {
  let url = (appConfig.url || '').trim();
  if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
    url = 'https://freetoolx.dpdns.org';
  }
  return url.replace(/\/+$/, '');
}

// XML entity escaping helper for sitemap safety
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Dynamic XML Sitemap
router.get('/sitemap.xml', (req, res) => {
  const tools = registry.getAllTools();
  const categories = registry.getCategories();
  const baseUrl = getBaseUrl();
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Homepage
  xml += `  <url>\n    <loc>${xmlEscape(`${baseUrl}/`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // 2. Categories
  for (const cat of categories) {
    xml += `  <url>\n    <loc>${xmlEscape(`${baseUrl}/category/${cat.slug}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // 3. Tools
  for (const tool of tools) {
    xml += `  <url>\n    <loc>${xmlEscape(`${baseUrl}/tools/${tool.slug}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // 4. Institutional, Trust & Legal Pages
  const staticPages = [
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.6', changefreq: 'monthly' },
    { path: '/terms', priority: '0.6', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.6', changefreq: 'monthly' }
  ];

  for (const page of staticPages) {
    xml += `  <url>\n    <loc>${xmlEscape(`${baseUrl}${page.path}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  }

  xml += '</urlset>';

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.send(xml);
});

// Dynamic robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl();
  const txt = `User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Google-InspectionTool
Allow: /
Disallow: /api/

User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Cache-Control', 'public, max-age=300, must-revalidate');
  res.send(txt);
});

module.exports = router;
