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
    title: 'Free JSON Formatter & Validator • Beautify & Minify JSON Online',
    metaDescription: 'Format, validate, and beautify your JSON data online. Fast, secure, and processes directly in your browser without saving any data.',
    keywords: ['json formatter', 'json beautifier', 'json validator online', 'json prettifier', 'minify json']
  },

  faq: [
    {
      q: 'Is my JSON data sent to a remote server?',
      a: 'No. This JSON formatter runs securely and deterministically directly in your browser. Your confidential payloads never leave your computer or phone.'
    },
    {
      q: 'Does it detect syntax errors?',
      a: 'Yes, if your JSON contains missing quotes, trailing commas, or unbalanced brackets, the validator pinpoints the exact line and character.'
    }
  ],

  relatedTools: ['qrcode-generator', 'unit-converter', 'ai-text-generator']
};
