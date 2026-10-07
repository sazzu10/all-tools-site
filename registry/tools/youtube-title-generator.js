module.exports = {
  id: 'youtube-title-generator',
  slug: 'youtube-title-generator',
  name: 'YouTube Title Generator',
  category: 'youtube-social',
  badges: ['AI', 'Trending'],
  icon: 'fa-brands fa-youtube',
  description: 'Generate high-CTR, click-worthy, and SEO-optimized YouTube video titles that capture viewer attention.',
  processingType: 'ai',
  outputType: 'text',
  enabled: true,
  featured: true,
  popular: true,

  inputs: [
    {
      name: 'topic',
      label: 'Video Topic or Keyword',
      type: 'text',
      placeholder: 'e.g. Learn Web Development in 2026, iPhone 17 review, Baking sourdough...',
      required: true,
      maxLength: 250
    },
    {
      name: 'style',
      label: 'Title Style / Angle',
      type: 'select',
      options: ['Curiosity & Hook', 'How-To & Educational', 'Listicle (Top 5 / 10)', 'Story & Personal', 'Extreme & Challenge'],
      default: 'Curiosity & Hook'
    },
    {
      name: 'count',
      label: 'Number of Title Ideas',
      type: 'select',
      options: ['5 Titles', '10 Titles', '15 Titles'],
      default: '10 Titles'
    }
  ],

  seo: {
    title: 'Free YouTube Title Generator • High CTR Viral Titles',
    metaDescription: 'Boost your video click-through rate with high-retention, algorithm-friendly YouTube title suggestions. 100% free AI title generator.',
    keywords: ['youtube title generator', 'viral youtube titles', 'video title ideas', 'youtube seo title', 'youtube clickbait title generator']
  },

  faq: [
    {
      q: 'Why are YouTube titles so important for the algorithm?',
      a: 'The title and thumbnail determine your Click-Through Rate (CTR). High CTR signals to YouTube that viewers find your video relevant, increasing browse and suggested traffic.'
    },
    {
      q: 'What makes a great YouTube title?',
      a: 'Great titles create curiosity, promise value or transformation, stay under 60 characters to avoid truncation on mobile devices, and align with the thumbnail.'
    }
  ],

  relatedTools: ['youtube-description-generator', 'hashtag-generator', 'ai-text-generator']
};
