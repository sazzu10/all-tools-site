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
    h1: 'Free QR Code Generator Online',
    title: 'Free QR Code Generator Online • Create High-Res QR Codes for Links & Wi-Fi',
    metaDescription: 'Create custom, high-resolution QR codes online for website URLs, Wi-Fi passwords, and text. Download high-res PNG images with zero sign-up required.',
    keywords: ['qr code generator', 'free qr code maker', 'create qr code online', 'link to qr code', 'qr generator high resolution', 'wifi qr code']
  },

  useCases: [
    'Website & Landing Page Links: Generate instant scan codes for promotional flyers, product packaging, and posters.',
    'Wi-Fi Network Access: Share network credentials easily without forcing guests to type complex passwords.',
    'Contact Cards & Digital Portfolios: Link directly to LinkedIn profiles, Linktree URLs, or portfolio websites.',
    'Menu & Event Ticketing: Enable touchless smartphone scanning for restaurant menus and event check-ins.'
  ],

  faq: [
    {
      q: 'Do these generated QR codes expire?',
      a: 'No. These are static QR codes that encode your text or URL directly into the pixel matrix. They work indefinitely without expiration.'
    },
    {
      q: 'Can I print these QR codes on marketing materials?',
      a: 'Yes. Choose 512px or 1024px print resolution for crisp, scannable printing on flyers, business cards, and banners.'
    },
    {
      q: 'Is there any scan limit or paywall?',
      a: 'No. You can create unlimited QR codes and scan them an unlimited number of times for free with zero sign-up.'
    },
    {
      q: 'What does error correction level mean?',
      a: 'Error correction allows a QR code to remain readable even if it is partially damaged, smudged, or covered by a logo.'
    }
  ],

  relatedTools: ['unit-converter', 'json-formatter', 'image-compressor']
};
