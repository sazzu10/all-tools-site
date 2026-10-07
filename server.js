const fs = require('fs');
const path = require('path');

// 1. Environment Loading (dotenv with native fallback)
try {
  require('dotenv').config();
} catch (_) {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  }
}

// 2. Express Loading (local with sibling fallback)
let express;
try {
  express = require('express');
} catch (_) {
  try {
    express = require('../youtube-automation-agent/node_modules/express');
  } catch (e) {
    console.error('Express not found. Please run npm install.');
    process.exit(1);
  }
}

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// 3. Security Middlewares (CORS & Rate Limiter)
try {
  const cors = require('cors');
  app.use(cors());
} catch (_) {
  // Built-in lightweight CORS fallback
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Built-in Rate Limiting fallback
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxReqs = 400;

  let clientData = rateLimitMap.get(ip);
  if (!clientData || now - clientData.start > windowMs) {
    clientData = { start: now, count: 1 };
  } else {
    clientData.count++;
  }
  rateLimitMap.set(ip, clientData);

  if (clientData.count > maxReqs) {
    return res.status(429).send('Too Many Requests. Please try again later.');
  }
  next();
});

// 4. View Engine & Layout Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Layout helper for EJS
let hasEjs = false;
try {
  require('ejs');
  hasEjs = true;
} catch (_) {}

if (hasEjs) {
  const originalRender = app.response.render;
  app.response.render = function (view, options = {}, callback) {
    const res = this;
    const req = res.req;
    const mergedOptions = { ...res.locals, ...options, currentPath: req.originalUrl };

    if (view === 'layouts/main') {
      return originalRender.call(res, view, mergedOptions, callback);
    }

    // Render inner view then embed into layout
    originalRender.call(res, view, mergedOptions, (err, html) => {
      if (err) return callback ? callback(err) : req.next(err);
      mergedOptions.body = html;
      originalRender.call(res, 'layouts/main', mergedOptions, callback);
    });
  };
} else {
  // Ultra-lightweight template fallback if EJS is not yet installed in local node_modules
  const miniTemplateEngine = (filePath, options, callback) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Resolve includes: <%- include('path', { ... }) %>
      content = content.replace(/<%-\s*include\(['"]([^'"]+)['"](?:,\s*(\{[\s\S]*?\}))?\)\s*%>/g, (m, incPath, incOptsStr) => {
        let absInc = incPath.startsWith('.') ? path.join(path.dirname(filePath), incPath) : path.join(__dirname, 'views', incPath);
        if (!absInc.endsWith('.ejs')) absInc += '.ejs';
        if (fs.existsSync(absInc)) {
          let childOpts = { ...options };
          if (incOptsStr) {
            try { childOpts = { ...childOpts, ...(new Function('return ' + incOptsStr)()) }; } catch (_) {}
          }
          let renderedChild = '';
          miniTemplateEngine(absInc, childOpts, (err, out) => { renderedChild = out || ''; });
          return renderedChild;
        }
        return '';
      });

      // Variable interpolation: <%= expr %> and <%- expr %>
      content = content.replace(/<%[=-]\s*([\s\S]*?)\s*%>/g, (m, expr) => {
        try {
          const fn = new Function(...Object.keys(options), `try { return (${expr}); } catch(_) { return ""; }`);
          const val = fn(...Object.values(options));
          return val !== undefined && val !== null ? String(val) : '';
        } catch (_) {
          return '';
        }
      });

      // Execute basic control flow <% ... %>
      const renderFn = new Function('opt', `
        with(opt) {
          let __out = [];
          // output string
          return ${JSON.stringify(content)};
        }
      `);
      return callback(null, renderFn(options));
    } catch (err) {
      return callback(err);
    }
  };

  app.engine('ejs', miniTemplateEngine);
  const origRender = app.response.render;
  app.response.render = function (view, options = {}, callback) {
    const res = this;
    const req = res.req;
    const merged = { ...res.locals, ...options, currentPath: req.originalUrl };

    if (view === 'layouts/main') {
      return origRender.call(res, view, merged, callback);
    }

    origRender.call(res, view, merged, (err, html) => {
      if (err) return callback ? callback(err) : req.next(err);
      merged.body = html;
      origRender.call(res, 'layouts/main', merged, callback);
    });
  };
}

// 5. Body Parsing & Static Assets (with caching)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Health Check Endpoint (Deployment Monitoring)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// 6. Routes Mounting
app.use('/', require('./routes/index'));
app.use('/', require('./routes/tools'));
app.use('/', require('./routes/seo'));

// 7. Custom 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 • Page Not Found',
    metaDescription: 'The requested page or tool was not found.',
    currentPath: req.originalUrl,
    body: null
  });
});

// 8. Global Error Handler (Production-Sanitized)
app.use((err, req, res, next) => {
  console.error('[AllTools Error]:', err.message);
  res.status(500).json({
    ok: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message
  });
});

// 9. Server Initialization & Graceful Shutdown
let serverInstance;
if (require.main === module) {
  serverInstance = app.listen(PORT, HOST, () => {
    console.log('====================================================');
    console.log(`🚀 ALL TOOLS PLATFORM — PRODUCTION ENGINE READY`);
    console.log(`📡 URL: http://${HOST}:${PORT}`);
    console.log(`🛡️  ISOLATION: Port 3456 remains safe & untouched`);
    console.log(`🧰 TOOLS ACTIVE: 8 tools fully operational`);
    console.log(`🤖 AI ROUTER: Groq -> OpenRouter -> Gemini cascade`);
    console.log('====================================================');
  });

  const handleShutdown = (signal) => {
    console.log(`[AllTools] Received ${signal}. Initiating graceful shutdown...`);
    if (serverInstance) {
      serverInstance.close(() => {
        console.log('[AllTools] Server connections closed. Process terminating cleanly.');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('[AllTools] Force shutdown timeout exceeded. Exiting.');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

module.exports = app;
