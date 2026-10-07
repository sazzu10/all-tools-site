module.exports = {
  id: 'image-compressor',
  slug: 'image-compressor',
  name: 'Image Compressor',
  category: 'image-tools',
  badges: ['Local', 'Fast'],
  icon: 'fa-solid fa-file-image',
  description: 'Compress JPG, PNG, and WebP images to reduce file size without visible quality loss. Runs locally in your browser.',
  processingType: 'client',
  outputType: 'file',
  enabled: true,
  featured: true,
  popular: true,

  inputs: [
    {
      name: 'imageFile',
      label: 'Upload Image (JPG, PNG, WebP)',
      type: 'file',
      accept: 'image/jpeg,image/png,image/webp',
      required: true
    },
    {
      name: 'quality',
      label: 'Compression Quality',
      type: 'select',
      options: ['High Quality (85%)', 'Balanced (70%)', 'Maximum Compression (50%)'],
      default: 'Balanced (70%)'
    },
    {
      name: 'maxDimension',
      label: 'Resize Max Width / Height (Optional)',
      type: 'select',
      options: ['Original Size (No resize)', '1920px (Full HD)', '1280px (HD)', '800px (Web standard)'],
      default: 'Original Size (No resize)'
    }
  ],

  seo: {
    h1: 'Free Image Compressor Online (JPG, PNG, WebP)',
    title: 'Free Image Compressor Online • Reduce JPG, PNG & WebP File Size',
    metaDescription: 'Compress images online for free without losing quality. Reduce JPG, PNG, and WebP file sizes directly in your browser. 100% private client-side processing.',
    keywords: ['image compressor', 'compress jpg', 'png compressor', 'reduce image file size', 'optimize images online', 'compress image online']
  },

  useCases: [
    'Website Speed Optimization: Shrink image assets to boost Core Web Vitals (LCP) and decrease page load times.',
    'Email Attachment Limits: Compress large photos to fit within standard 10MB to 25MB email attachment caps.',
    'Social Media Uploads: Optimize photos for Instagram, Twitter/X, and YouTube thumbnail upload specifications.',
    'Document & Form Uploads: Comply with government and application portal file size caps (e.g. under 1MB or 500KB).'
  ],

  faq: [
    {
      q: 'Are my photos uploaded to a third-party server?',
      a: 'No. The image compression runs entirely inside your web browser using HTML5 Canvas rendering. Your files are 100% private and never uploaded to our servers.'
    },
    {
      q: 'Which image formats are supported?',
      a: 'JPG/JPEG, PNG, and WebP files are supported.'
    },
    {
      q: 'Will compressing my photo cause noticeable blurriness?',
      a: 'Our balanced compression algorithm strips redundant metadata and optimizes quantization tables, saving up to 80% file size while preserving sharp visuals.'
    },
    {
      q: 'Can I resize pixel dimensions while compressing?',
      a: 'Yes. You can optionally downscale images to Full HD (1920px), HD (1280px), or Web Standard (800px) directly in the tool.'
    }
  ],

  relatedTools: ['qrcode-generator', 'json-formatter', 'unit-converter']
};
