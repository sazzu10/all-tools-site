module.exports = {
  id: 'json-formatter',
  slug: 'json-formatter',
  name: 'JSON Formatter & Validator',
  category: 'developer-tools',
  badges: ['Instant', 'Private'],
  icon: 'fa-solid fa-code',
  description: 'Format, validate, beautify, and minify JSON data instantly with syntax validation and error pinpointing.',
  processingType: 'deterministic',
  outputType: 'text',
  enabled: true,
  featured: true,
  popular: true,

  inputs: [
    {
      name: 'jsonInput',
      label: 'Input JSON String',
      type: 'textarea',
      rows: 8,
      placeholder: '{"name":"all-tools","active":true,"version":1}',
      required: true,
      maxLength: 500000
    },
    {
      name: 'indent',
      label: 'Indentation Format',
      type: 'select',
      options: ['2 Spaces', '4 Spaces', 'Tabs', 'Minify / Compact (0 spaces)'],
      default: '2 Spaces'
    }
  ],

  seo: {
    h1: 'JSON Formatter & Validator Online',
    title: 'Free JSON Formatter & Validator Online • Pretty Print & Minify JSON',
    metaDescription: 'Format, validate, beautify, and minify JSON online. Real-time syntax error checking with 100% in-browser client-side privacy. Zero data logged.',
    keywords: ['json formatter', 'json beautifier', 'json validator online', 'json prettifier', 'minify json', 'pretty print json']
  },

  useCases: [
    'Debug API Responses: Pinpoint syntax errors, missing commas, and unbalanced brackets in REST API payloads.',
    'Pretty-Print Raw Code: Format compacted or single-line JSON into readable 2-space, 4-space, or tabbed indentation.',
    'Minify Production Payloads: Strip whitespace and newlines to shrink JSON payload size for production network requests.',
    'Validate Configuration Files: Ensure package.json, tsconfig.json, and server configuration files are syntactically valid.'
  ],

  faq: [
    {
      q: 'Is my JSON data sent to a remote server?',
      a: 'No. This JSON formatter runs securely and deterministically directly in your browser. Your confidential payloads and API tokens never leave your computer or phone.'
    },
    {
      q: 'How does the validator pinpoint syntax errors?',
      a: 'Our browser parser evaluates the string structure and provides exact line and character coordinates where JSON syntax rules are violated.'
    },
    {
      q: 'Can I minify JSON for production using this tool?',
      a: 'Yes. Select "Minify / Compact (0 spaces)" in the indentation options to remove all whitespace and line breaks for lightweight payload transfer.'
    },
    {
      q: 'Can this tool handle large JSON files?',
      a: 'Yes, it supports payloads up to 500,000 characters with near-instant client-side execution.'
    }
  ],

  relatedTools: ['qrcode-generator', 'unit-converter', 'ai-text-generator']
};
