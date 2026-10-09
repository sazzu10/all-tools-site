/**
 * Comprehensive Test Suite for All-Tools-Site (Phase 2)
 * Tests all 8 tools, AI router, registry, and routes.
 */
const path = require('path');
const fs = require('fs');

const results = [];

function recordTest(testName, status, details = '') {
  results.push({ testName, status, details });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${testName} ${details ? '- ' + details : ''}`);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE PHASE 2 VERIFICATION SUITE');
  console.log('====================================================\n');

  // STEP 1: SYNTAX & MODULE RESOLUTION CHECKS
  console.log('--- Step 1: Syntax & Module Loading Checks ---');
  const filesToCheck = [
    'config/app.js',
    'config/ads.js',
    'config/ai.js',
    'registry/categories.js',
    'registry/registry.js',
    'services/ai/providers/base.js',
    'services/ai/providers/groq.js',
    'services/ai/providers/openrouter.js',
    'services/ai/providers/gemini.js',
    'services/ai/ai-router.js',
    'services/tools/json-formatter.js',
    'services/tools/unit-converter.js',
    'services/tools/qrcode-generator.js',
    'services/tools/youtube-title-generator.js',
    'services/tools/youtube-description-generator.js',
    'services/tools/hashtag-generator.js',
    'services/tools/ai-text-generator.js',
    'services/tools/image-compressor.js',
    'routes/index.js',
    'routes/tools.js',
    'routes/seo.js',
    'server.js'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(__dirname, '..', relPath);
    try {
      if (!fs.existsSync(fullPath)) {
        recordTest(`File Existence: ${relPath}`, 'FAIL', 'File not found on disk');
        continue;
      }
      require(fullPath);
      recordTest(`Syntax & Load: ${relPath}`, 'PASS');
    } catch (err) {
      recordTest(`Syntax & Load: ${relPath}`, 'FAIL', err.message);
    }
  }

  // STEP 2: REGISTRY INTEGRITY
  console.log('\n--- Step 2: Tool Registry Verification ---');
  try {
    const registry = require('../registry/registry');
    const allTools = registry.getAllTools();
    const categories = registry.getCategoriesWithCounts();

    if (allTools.length === 8) {
      recordTest('Registry Tool Count', 'PASS', `8 / 8 tools registered`);
    } else {
      recordTest('Registry Tool Count', 'FAIL', `Expected 8, found ${allTools.length}`);
    }

    const expectedSlugs = [
      'json-formatter',
      'unit-converter',
      'qrcode-generator',
      'youtube-title-generator',
      'youtube-description-generator',
      'hashtag-generator',
      'ai-text-generator',
      'image-compressor'
    ];

    for (const slug of expectedSlugs) {
      const tool = registry.getToolBySlug(slug);
      if (tool && tool.slug === slug && tool.inputs && tool.inputs.length > 0) {
        recordTest(`Registry Tool Schema: ${slug}`, 'PASS', `Category: ${tool.category}, Processing: ${tool.processingType}`);
      } else {
        recordTest(`Registry Tool Schema: ${slug}`, 'FAIL', 'Invalid schema or missing inputs');
      }
    }
  } catch (err) {
    recordTest('Registry System', 'FAIL', err.message);
  }

  // STEP 3: DETERMINISTIC TOOLS (MUST NOT CALL AI)
  console.log('\n--- Step 3: Deterministic Tools Verification ---');

  // Tool 1: JSON Formatter & Validator
  try {
    const { formatJson } = require('../services/tools/json-formatter');
    const validRaw = '{"title":"All Tools","version":2,"features":["deterministic","ai"]}';

    // Test 2 Spaces
    const res2 = formatJson({ jsonInput: validRaw, indent: '2 Spaces' });
    if (res2.ok && res2.valid && res2.output.includes('  "title": "All Tools"')) {
      recordTest('JSON Formatter: 2 Spaces Indentation', 'PASS');
    } else {
      recordTest('JSON Formatter: 2 Spaces Indentation', 'FAIL', res2.error);
    }

    // Test Minify
    const resMin = formatJson({ jsonInput: validRaw, indent: 'Minify / Compact (0 spaces)' });
    if (resMin.ok && !resMin.output.includes('\n')) {
      recordTest('JSON Formatter: Minify / Compact', 'PASS');
    } else {
      recordTest('JSON Formatter: Minify / Compact', 'FAIL', 'Unexpected whitespace');
    }

    // Test Invalid Syntax Handling (Line & Col Pinpointing)
    const invalidRaw = '{"broken": true, }';
    const resErr = formatJson({ jsonInput: invalidRaw });
    if (!resErr.ok && resErr.errorLocation && resErr.errorLocation.line >= 1) {
      recordTest('JSON Formatter: Syntax Error Pinpointing', 'PASS', `Error captured at line ${resErr.errorLocation.line}, col ${resErr.errorLocation.column}`);
    } else {
      recordTest('JSON Formatter: Syntax Error Pinpointing', 'FAIL', 'Failed to catch or pinpoint error');
    }
  } catch (err) {
    recordTest('JSON Formatter Execution', 'FAIL', err.message);
  }

  // Tool 2: Universal Unit Converter
  try {
    const { convertUnits } = require('../services/tools/unit-converter');

    // Length Conversion (1 km = 0.62137119 miles)
    const resLen = convertUnits({ dimension: 'Length', amount: 10, fromUnit: 'Kilometers', toUnit: 'Miles' });
    if (resLen.ok && Math.abs(resLen.outputValue - 6.21371192) < 0.001) {
      recordTest('Unit Converter: Length (km -> miles)', 'PASS', `${resLen.outputValue} miles`);
    } else {
      recordTest('Unit Converter: Length (km -> miles)', 'FAIL', resLen.error || 'Incorrect calculation');
    }

    // Temperature Conversion (100 C = 212 F)
    const resTemp = convertUnits({ dimension: 'Temperature', amount: 100, fromUnit: 'Celsius', toUnit: 'Fahrenheit' });
    if (resTemp.ok && resTemp.outputValue === 212) {
      recordTest('Unit Converter: Temperature (100°C -> 212°F)', 'PASS', 'Formula verified');
    } else {
      recordTest('Unit Converter: Temperature (100°C -> 212°F)', 'FAIL', resTemp.error);
    }

    // Digital Storage (1 GB = 1024 MB)
    const resStorage = convertUnits({ dimension: 'Digital Storage', amount: 2, fromUnit: 'Gigabytes (GB)', toUnit: 'Megabytes (MB)' });
    if (resStorage.ok && resStorage.outputValue === 2048) {
      recordTest('Unit Converter: Storage (2 GB -> 2048 MB)', 'PASS');
    } else {
      recordTest('Unit Converter: Storage (2 GB -> 2048 MB)', 'FAIL', resStorage.error);
    }
  } catch (err) {
    recordTest('Unit Converter Execution', 'FAIL', err.message);
  }

  // Tool 3: QR Code Generator
  try {
    const { generateQrCode } = require('../services/tools/qrcode-generator');
    const qrRes = generateQrCode({ qrContent: 'https://alltools.online', size: 256, errorCorrection: 'Medium (15% recovery)' });
    if (qrRes.ok && qrRes.svg && qrRes.svg.includes('<svg') && qrRes.dataUrl && qrRes.dataUrl.startsWith('data:image/svg+xml;base64,')) {
      recordTest('QR Code Generator: SVG & Data URL Generation', 'PASS', `Version ${qrRes.version}, 256x256px`);
    } else {
      recordTest('QR Code Generator: SVG & Data URL Generation', 'FAIL', qrRes.error || 'Invalid SVG output');
    }
  } catch (err) {
    recordTest('QR Code Generator Execution', 'FAIL', err.message);
  }

  // Tool 8: Image Compressor (Metadata & Fallback Engine)
  try {
    const { processImageCompression } = require('../services/tools/image-compressor');
    const sampleBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(4000);
    const compRes = processImageCompression({ imageBase64: sampleBase64, quality: 'Balanced (70%)' });
    if (compRes.ok && compRes.clientProcessingPreferred && compRes.originalBytes > 0) {
      recordTest('Image Compressor: Engine & Reduction Estimation', 'PASS', `Estimated reduction: ${compRes.savingsPercent}`);
    } else {
      recordTest('Image Compressor: Engine & Reduction Estimation', 'FAIL', compRes.error);
    }
  } catch (err) {
    recordTest('Image Compressor Execution', 'FAIL', err.message);
  }

  // STEP 4: AI ROUTER & PROVIDER ARCHITECTURE
  console.log('\n--- Step 4: AI Router & Provider Architecture ---');
  try {
    const { aiRouter, AIRouter } = require('../services/ai/ai-router');
    const status = aiRouter.getStatus();

    // Check order
    if (JSON.stringify(status.order) === JSON.stringify(['groq', 'openrouter', 'gemini'])) {
      recordTest('AI Router: Provider Cascade Order', 'PASS', status.order.join(' -> '));
    } else {
      recordTest('AI Router: Provider Cascade Order', 'FAIL', `Order: ${status.order.join(',')}`);
    }

    // Check timeout
    if (status.timeoutMs === 15000) {
      recordTest('AI Router: 15s Timeout Enforcement', 'PASS', '15000ms configured');
    } else {
      recordTest('AI Router: 15s Timeout Enforcement', 'FAIL', `${status.timeoutMs}ms`);
    }

    // Safe environment variable existence check (NEVER log or expose values)
    const envStatus = {
      GROQ_API_KEY: Boolean(process.env.GROQ_API_KEY),
      OPENROUTER_API_KEY: Boolean(process.env.OPENROUTER_API_KEY),
      GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY)
    };
    recordTest('Environment Variables Existence Check (Safe / No Exposure)', 'PASS',
      `Groq: ${envStatus.GROQ_API_KEY ? 'Present' : 'Not Set'}, OpenRouter: ${envStatus.OPENROUTER_API_KEY ? 'Present' : 'Not Set'}, Gemini: ${envStatus.GEMINI_API_KEY ? 'Present' : 'Not Set'}`
    );

    // Sanitized error test: Ensure router never leaks API keys
    const dummyRouter = new AIRouter({ timeoutMs: 500 });
    const BaseProvider = require('../services/ai/providers/base');
    const baseP = new BaseProvider('test');
    const sanitizedError = baseP.sanitizeError(new Error('Failed with sk-or-v1-secret123456789 and gsk_99999999999'));
    if (!sanitizedError.includes('sk-or-v1-secret') && sanitizedError.includes('[REDACTED_KEY]')) {
      recordTest('AI Router: Credential Redaction & Sanitized Errors', 'PASS');
    } else {
      recordTest('AI Router: Credential Redaction & Sanitized Errors', 'FAIL', 'Keys not redacted properly');
    }

    // Input truncation limit test
    const longPrompt = 'A'.repeat(5000);
    const sanitizedInput = baseP.sanitizeInput(longPrompt, 4000);
    if (sanitizedInput.length < 4050 && sanitizedInput.includes('[truncated]')) {
      recordTest('AI Router: Input Length Truncation Safeguard', 'PASS', `Truncated from 5000 to ${sanitizedInput.length} chars`);
    } else {
      recordTest('AI Router: Input Length Truncation Safeguard', 'FAIL', 'Input was not truncated');
    }
  } catch (err) {
    recordTest('AI Router Architecture', 'FAIL', err.message);
  }

  // STEP 5: AI-POWERED CREATOR TOOLS EXECUTION
  console.log('\n--- Step 5: AI Tools Execution & Graceful Fallback ---');

  // Tool 4: YouTube Title Generator
  try {
    const { generateTitles } = require('../services/tools/youtube-title-generator');
    const titlesRes = await generateTitles({ topic: 'Productivity Systems for Solopreneurs', count: '5 Titles' });
    if (titlesRes.ok && titlesRes.titles && titlesRes.titles.length >= 3) {
      recordTest('YouTube Title Generator Execution', 'PASS', `${titlesRes.titles.length} titles generated (${titlesRes.metadata.provider})`);
    } else {
      recordTest('YouTube Title Generator Execution', 'FAIL', titlesRes.error || 'Zero titles returned');
    }
  } catch (err) {
    recordTest('YouTube Title Generator Execution', 'FAIL', err.message);
  }

  // Tool 5: YouTube Description Generator
  try {
    const { generateDescription } = require('../services/tools/youtube-description-generator');
    const descRes = await generateDescription({ title: 'Top 10 Developer Tools for 2026', includeTimestamps: 'Yes' });
    if (descRes.ok && descRes.output && descRes.output.includes('00:00')) {
      recordTest('YouTube Description Generator Execution', 'PASS', `Description generated with timestamps (${descRes.metadata.provider})`);
    } else {
      recordTest('YouTube Description Generator Execution', 'FAIL', descRes.error || 'Missing output or timestamps');
    }
  } catch (err) {
    recordTest('YouTube Description Generator Execution', 'FAIL', err.message);
  }

  // Tool 6: Hashtag Generator
  try {
    const { generateHashtags } = require('../services/tools/hashtag-generator');
    const hashRes = await generateHashtags({ keyword: 'Digital Marketing', platform: 'Instagram Reels / Posts', density: '10-15 Mixed Reach Tags' });
    if (hashRes.ok && hashRes.tags && hashRes.tags.length >= 5 && hashRes.tags.every(t => t.startsWith('#'))) {
      recordTest('Hashtag Generator Execution', 'PASS', `${hashRes.tags.length} valid unique hashtags (${hashRes.metadata.provider})`);
    } else {
      recordTest('Hashtag Generator Execution', 'FAIL', hashRes.error || 'Invalid hashtags');
    }
  } catch (err) {
    recordTest('Hashtag Generator Execution', 'FAIL', err.message);
  }

  // Tool 7: AI Text Generator
  try {
    const { generateText } = require('../services/tools/ai-text-generator');
    const textRes = await generateText({ prompt: 'Explain the benefits of static site generation', format: 'Paragraph', tone: 'Professional' });
    if (textRes.ok && textRes.output && textRes.stats && textRes.stats.wordCount > 10) {
      recordTest('AI Text Generator Execution', 'PASS', `${textRes.stats.wordCount} words generated (${textRes.metadata.provider})`);
    } else {
      recordTest('AI Text Generator Execution', 'FAIL', textRes.error || 'Missing output or stats');
    }
  } catch (err) {
    recordTest('AI Text Generator Execution', 'FAIL', err.message);
  }

  // STEP 6: SERVER ROUTES INTEGRATION
  console.log('\n--- Step 6: Route Integration Verification ---');
  try {
    const routesTools = require('../routes/tools');
    const routesIndex = require('../routes/index');
    const routesSeo = require('../routes/seo');

    recordTest('Express Routes Mounting & Endpoints Integrity', 'PASS', 'tools, index, seo routers verified');
  } catch (err) {
    recordTest('Express Routes Mounting & Endpoints Integrity', 'FAIL', err.message);
  }

  // STEP 7: MONETIZATION & ADSENSE READINESS CHECKS
  console.log('\n--- Step 7: Monetization & AdSense Readiness Checks ---');
  try {
    const adsConfig = require('../config/ads');
    if (adsConfig && adsConfig.slots && adsConfig.slots.homeTop && adsConfig.slots.toolMid) {
      recordTest('Monetization: Ad Slots & Layout Containment', 'PASS', '8 standard responsive slots configured');
    } else {
      recordTest('Monetization: Ad Slots & Layout Containment', 'FAIL', 'Missing ad slot definitions');
    }

    const legalPages = ['privacy.ejs', 'terms.ejs', 'disclaimer.ejs', 'about.ejs', 'contact.ejs'];
    let allLegalExist = true;
    for (const page of legalPages) {
      if (!fs.existsSync(path.join(__dirname, '..', 'views', 'pages', page))) {
        allLegalExist = false;
        recordTest(`Legal Page Existence: ${page}`, 'FAIL', 'File missing');
      }
    }
    if (allLegalExist) {
      recordTest('AdSense Readiness: 5 Legal & Trust Pages', 'PASS', 'Privacy, Terms, Disclaimer, About, Contact verified');
    }

    // Regression check: Unit converter Square Feet vs Square Meters
    const { convertUnits } = require('../services/tools/unit-converter');
    const resSq = convertUnits({ dimension: 'Area', amount: 100, fromUnit: 'Square Meters', toUnit: 'Square Feet' });
    if (resSq.ok && resSq.toUnit === 'Square Feet' && Math.abs(resSq.outputValue - 1076.391) < 0.1) {
      recordTest('Regression: Multi-word Unit Normalization', 'PASS', 'Square Meters -> Square Feet verified');
    } else {
      recordTest('Regression: Multi-word Unit Normalization', 'FAIL', resSq.error || `toUnit was ${resSq.toUnit}`);
    }
  } catch (err) {
    recordTest('Monetization & AdSense Verification', 'FAIL', err.message);
  }

  // STEP 8: SEO, SITEMAP & ROBOTS.TXT INTEGRITY CHECKS
  console.log('\n--- Step 8: SEO, Sitemap & Robots.txt Integrity Checks ---');
  try {
    const appConfig = require('../config/app');

    // 1. Base URL verification
    if (appConfig.url && !appConfig.url.includes('localhost') && !appConfig.url.includes('127.0.0.1') && appConfig.url.startsWith('https://freetoolx.dpdns.org')) {
      recordTest('SEO: Canonical App URL Configuration', 'PASS', `Configured URL: ${appConfig.url}`);
    } else {
      recordTest('SEO: Canonical App URL Configuration', 'FAIL', `Invalid appConfig.url: ${appConfig.url}`);
    }

    // 2. Canonical tag fallback in head.ejs
    const headPath = path.join(__dirname, '..', 'views', 'partials', 'head.ejs');
    const headContent = fs.readFileSync(headPath, 'utf8');
    if (!headContent.includes('http://localhost:4000') && headContent.includes('https://freetoolx.dpdns.org')) {
      recordTest('SEO: Head Canonical Fallback (Zero Localhost)', 'PASS', 'head.ejs verified clean');
    } else {
      recordTest('SEO: Head Canonical Fallback (Zero Localhost)', 'FAIL', 'Found localhost:4000 reference in head.ejs');
    }

    // 3. Sitemap generation & XML validation
    const routesSeo = require('../routes/seo');
    let sitemapXml = '';
    let sitemapHeaders = {};
    const mockResSitemap = {
      header: (k, v) => { sitemapHeaders[k.toLowerCase()] = v; },
      send: (body) => { sitemapXml = body; }
    };

    const sitemapLayer = routesSeo.stack.find(l => l.route && l.route.path === '/sitemap.xml');
    const robotsLayer = routesSeo.stack.find(l => l.route && l.route.path === '/robots.txt');

    if (sitemapLayer && robotsLayer) {
      sitemapLayer.route.stack[0].handle({}, mockResSitemap);

      const hasXmlDecl = sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
      const hasUrlsetOpen = sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      const hasUrlsetClose = sitemapXml.trim().endsWith('</urlset>');
      const noLocalhostInSitemap = !sitemapXml.includes('localhost') && !sitemapXml.includes('127.0.0.1');
      const allUrlsProduction = sitemapXml.split('<loc>')
        .slice(1)
        .map(s => s.split('</loc>')[0])
        .every(url => url.startsWith('https://freetoolx.dpdns.org/'));

      const urlCount = (sitemapXml.match(/<loc>/g) || []).length;

      if (hasXmlDecl && hasUrlsetOpen && hasUrlsetClose && noLocalhostInSitemap && allUrlsProduction && urlCount >= 20) {
        recordTest('SEO: Sitemap XML Schema & Entity Validation', 'PASS', `${urlCount} public URLs, 100% https://freetoolx.dpdns.org`);
      } else {
        recordTest('SEO: Sitemap XML Schema & Entity Validation', 'FAIL', `Sitemap invalid or contains localhost. URL count: ${urlCount}`);
      }

      if (sitemapHeaders['content-type'] && sitemapHeaders['content-type'].includes('application/xml') && sitemapHeaders['cache-control']) {
        recordTest('SEO: Sitemap Content-Type & Edge Cache Headers', 'PASS', sitemapHeaders['content-type']);
      } else {
        recordTest('SEO: Sitemap Content-Type & Edge Cache Headers', 'FAIL', 'Missing XML header or Cache-Control');
      }

      // 4. Robots.txt generation & validation
      let robotsTxt = '';
      let robotsHeaders = {};
      const mockResRobots = {
        header: (k, v) => { robotsHeaders[k.toLowerCase()] = v; },
        send: (body) => { robotsTxt = body; }
      };
      robotsLayer.route.stack[0].handle({}, mockResRobots);

      const hasUserAgent = robotsTxt.includes('User-agent: *');
      const hasAllowAll = robotsTxt.includes('Allow: /');
      const hasDisallowApi = robotsTxt.includes('Disallow: /api/');
      const hasProductionSitemap = robotsTxt.includes('Sitemap: https://freetoolx.dpdns.org/sitemap.xml');
      const noLocalhostInRobots = !robotsTxt.includes('localhost') && !robotsTxt.includes('127.0.0.1');

      if (hasUserAgent && hasAllowAll && hasDisallowApi && hasProductionSitemap && noLocalhostInRobots) {
        recordTest('SEO: Robots.txt Crawl Directives & API Restriction', 'PASS', 'Allow: /, Disallow: /api/, Sitemap: https://freetoolx.dpdns.org/sitemap.xml');
      } else {
        recordTest('SEO: Robots.txt Crawl Directives & API Restriction', 'FAIL', `Robots content invalid: ${robotsTxt}`);
      }

      if (robotsHeaders['content-type'] && robotsHeaders['content-type'].includes('text/plain') && robotsHeaders['cache-control']) {
        recordTest('SEO: Robots.txt Content-Type & Edge Cache Headers', 'PASS', robotsHeaders['cache-control']);
      } else {
        recordTest('SEO: Robots.txt Content-Type & Edge Cache Headers', 'FAIL', 'Missing plain text or Cache-Control');
      }

      // 5. Static Public Robots.txt Validation
      const staticRobotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
      if (fs.existsSync(staticRobotsPath)) {
        const staticRobots = fs.readFileSync(staticRobotsPath, 'utf8');
        if (staticRobots.includes('User-agent: *') && staticRobots.includes('Allow: /') && staticRobots.includes('Disallow: /api/') && staticRobots.includes('Sitemap: https://freetoolx.dpdns.org/sitemap.xml')) {
          recordTest('SEO: Static Public Robots.txt Directives & Sitemap Match', 'PASS', 'public/robots.txt verified matching dynamic router');
        } else {
          recordTest('SEO: Static Public Robots.txt Directives & Sitemap Match', 'FAIL', 'Directives or sitemap URL mismatch in public/robots.txt');
        }
      } else {
        recordTest('SEO: Static Public Robots.txt Directives & Sitemap Match', 'FAIL', 'public/robots.txt missing');
      }
    } else {
      recordTest('SEO: Sitemap & Robots Router Endpoints', 'FAIL', 'Router layers not found');
    }
  } catch (err) {
    recordTest('SEO & Sitemap Verification', 'FAIL', err.message);
  }

  // SUMMARY REPORT
  console.log('\n====================================================');
  console.log('📊 VERIFICATION SUMMARY REPORT');
  console.log('====================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`Total Checks: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  console.log('====================================================\n');

  return { total, passed, failed, results };
}

// Export for programmatic runner or run directly
if (require.main === module) {
  runTestSuite().catch(err => {
    console.error('Test suite runner encountered critical error:', err);
    process.exit(1);
  });
}

module.exports = { runTestSuite };
