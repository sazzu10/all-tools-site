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
    title: 'Free Image Compressor • Reduce JPG, PNG & WebP Size Online',
    metaDescription: 'Compress images online for free without losing quality. Fast client-side image optimization for websites, social media, and faster load times.',
    keywords: ['image compressor', 'compress jpg', 'png compressor', 'reduce image file size', 'optimize images online']
  },

  faq: [
    {
      q: 'Are my photos uploaded to a third-party server?',
      a: 'No. The image compression runs entirely inside your web browser using HTML5 Canvas rendering. Your files are 100% private and never uploaded to our servers.'
    },
    {
      q: 'Which image formats are supported?',
      a: 'JPG/JPEG, PNG, and WebP files are supported.'
    }
  ],

  relatedTools: ['qrcode-generator', 'json-formatter', 'unit-converter']
};
