const express = require('express');
const router = express.Router();
const registry = require('../registry/registry');
const appConfig = require('../config/app');

// Tool Services
const { formatJson } = require('../services/tools/json-formatter');
const { convertUnits } = require('../services/tools/unit-converter');
const { generateQrCode } = require('../services/tools/qrcode-generator');
const { generateTitles } = require('../services/tools/youtube-title-generator');
const { generateDescription } = require('../services/tools/youtube-description-generator');
const { generateHashtags } = require('../services/tools/hashtag-generator');
const { generateText } = require('../services/tools/ai-text-generator');
const { processImageCompression } = require('../services/tools/image-compressor');
const { aiRouter } = require('../services/ai/ai-router');

// AI Router Status Endpoint (/api/ai/status)
router.get('/api/ai/status', (req, res) => {
  res.json({
    ok: true,
    ...aiRouter.getStatus()
  });
});

// Tool View Page (/tools/:slug)
router.get('/tools/:slug', (req, res) => {
  const { slug } = req.params;
  const tool = registry.getToolBySlug(slug);

  if (!tool) {
    return res.status(404).render('pages/404', {
      title: 'Tool Not Found • All Tools',
      metaDescription: 'The requested tool could not be found.',
      currentPath: req.originalUrl,
      body: null
    });
  }

  // Resolve related tools
  const relatedTools = (tool.relatedTools || [])
    .map(relSlug => registry.getToolBySlug(relSlug))
    .filter(Boolean);

  // Generate JSON-LD Schema
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": tool.category,
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
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
          "name": tool.category,
          "item": `${appConfig.url}/category/${tool.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tool.name,
          "item": `${appConfig.url}/tools/${tool.slug}`
        }
      ]
    }
  ];

  if (tool.faq && tool.faq.length) {
    schemaData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
  }

  res.render('pages/tool', {
    title: tool.seo?.title || `${tool.name} • Free Online Tool`,
    metaDescription: tool.seo?.metaDescription || tool.description,
    keywords: tool.seo?.keywords || [],
    canonicalUrl: `${appConfig.url}/tools/${tool.slug}`,
    currentPath: `/tools/${tool.slug}`,
    tool,
    relatedTools,
    schemaData,
    body: null
  });
});

// Tool Execution API (/api/tools/:slug/execute - Supports POST & GET for testing)
router.all('/api/tools/:slug/execute', async (req, res) => {
  const { slug } = req.params;
  const tool = registry.getToolBySlug(slug);

  if (!tool) {
    return res.status(404).json({ ok: false, error: 'Tool not found' });
  }

  if (!tool.enabled) {
    return res.status(403).json({ ok: false, error: 'This tool is temporarily disabled' });
  }

  const inputs = { ...req.query, ...req.body };

  try {
    let result;

    switch (slug) {
      case 'json-formatter':
        result = formatJson(inputs);
        break;

      case 'unit-converter':
        result = convertUnits(inputs);
        break;

      case 'qrcode-generator':
        result = generateQrCode(inputs);
        break;

      case 'youtube-title-generator':
        result = await generateTitles(inputs);
        break;

      case 'youtube-description-generator':
        result = await generateDescription(inputs);
        break;

      case 'hashtag-generator':
        result = await generateHashtags(inputs);
        break;

      case 'ai-text-generator':
        result = await generateText(inputs);
        break;

      case 'image-compressor':
        result = processImageCompression(inputs);
        break;

      default:
        return res.status(400).json({
          ok: false,
          error: `Execution engine not available for tool: ${slug}`
        });
    }

    if (!result.ok) {
      return res.status(400).json(result);
    }

    return res.json({
      ok: true,
      tool: tool.name,
      slug: tool.slug,
      processingType: tool.processingType,
      ...result
    });
  } catch (err) {
    console.error(`[ExecutionError] ${slug}:`, err.message);
    return res.status(500).json({
      ok: false,
      error: 'An unexpected error occurred while executing the tool.',
      details: err.message
    });
  }
});

module.exports = router;
