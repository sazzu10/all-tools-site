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
    h1: 'AI YouTube Title Generator Online',
    title: 'Free YouTube Title Generator • High-CTR Viral Video Title Ideas',
    metaDescription: 'Generate high-CTR, algorithm-friendly YouTube video titles that boost clicks and viewer retention. Free AI title generator with multiple creative angles.',
    keywords: ['youtube title generator', 'viral youtube titles', 'video title ideas', 'youtube seo title', 'youtube clickbait title generator', 'youtube title maker']
  },

  useCases: [
    'Browse & Suggested Traffic: Craft curiosity hooks that trigger strong CTR from the YouTube homepage and sidebar.',
    'Educational & Tutorial Videos: Generate clear "How-To" and problem-solving titles that rank in YouTube Search.',
    'Listicles & Reviews: Create compelling Top 5, Top 10, or versus titles for tech reviews and consumer guides.',
    'A/B Testing Thumbnail Combos: Produce multiple title angles to test against different video thumbnail concepts.'
  ],

  faq: [
    {
      q: 'Why are YouTube titles so important for the algorithm?',
      a: 'The title and thumbnail determine your Click-Through Rate (CTR). High CTR signals to YouTube that viewers find your video relevant, increasing browse and suggested traffic.'
    },
    {
      q: 'What makes a great YouTube title?',
      a: 'Great titles create curiosity, promise value or transformation, stay under 60 characters to avoid truncation on mobile devices, and align with the thumbnail.'
    },
    {
      q: 'Can I choose different title styles?',
      a: 'Yes. Choose between Curiosity & Hook, How-To & Educational, Listicle, Story & Personal, or Extreme & Challenge angles.'
    },
    {
      q: 'Are the generated titles free for monetized channels?',
      a: 'Yes. All suggested titles are 100% free for use on monetized, commercial, and personal YouTube channels.'
    }
  ],

  relatedTools: ['youtube-description-generator', 'hashtag-generator', 'ai-text-generator']
};
