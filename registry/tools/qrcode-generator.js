module.exports = {
  id: 'qrcode-generator',
  slug: 'qrcode-generator',
  name: 'QR Code Generator',
  category: 'utility-calculator',
  badges: ['Instant', 'Free'],
  icon: 'fa-solid fa-qrcode',
  description: 'Generate customizable, high-resolution QR codes for websites, text, Wi-Fi networks, and contact cards.',
  processingType: 'deterministic',
  outputType: 'image',
  enabled: true,
  featured: false,
  popular: true,

  inputs: [
    {
      name: 'qrContent',
      label: 'URL or Text Content',
      type: 'text',
      placeholder: 'https://example.com or any text message...',
      required: true,
      maxLength: 2048
    },
    {
      name: 'size',
      label: 'QR Code Size',
      type: 'select',
      options: ['256 x 256 px (Standard)', '512 x 512 px (High-Res)', '1024 x 1024 px (Print Quality)'],
      default: '256 x 256 px (Standard)'
    },
    {
      name: 'errorCorrection',
      label: 'Error Correction Level',
      type: 'select',
      options: ['Medium (15% recovery)', 'High (25% recovery)', 'Low (7% recovery)', 'Maximum (30% recovery)'],
      default: 'Medium (15% recovery)'
    }
  ],

  seo: {
    title: 'Free QR Code Generator • Custom High-Res QR Codes Online',
    metaDescription: 'Create free QR codes instantly for links, Wi-Fi, and text. Download high-resolution PNG QR codes with zero sign-up required.',
    keywords: ['qr code generator', 'free qr code maker', 'create qr code online', 'link to qr code', 'qr generator high resolution']
  },

  faq: [
    {
      q: 'Do the generated QR codes expire?',
      a: 'No. These are static QR codes that encode your text or URL directly into the pixel pattern. They work forever with no expiration date.'
    },
    {
      q: 'Can I print these QR codes on business cards and flyers?',
      a: 'Yes! Select the 512px or 1024px print resolution option for crisp, scannable printing results.'
    }
  ],

  relatedTools: ['unit-converter', 'json-formatter', 'image-compressor']
};
