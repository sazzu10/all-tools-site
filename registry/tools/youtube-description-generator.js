module.exports = {
  id: 'youtube-description-generator',
  slug: 'youtube-description-generator',
  name: 'YouTube Description Generator',
  category: 'youtube-social',
  badges: ['AI', 'Creator'],
  icon: 'fa-solid fa-file-lines',
  description: 'Generate structured YouTube descriptions with key takeaways, timestamps template, calls to action, and hashtags.',
  processingType: 'ai',
  outputType: 'text',
  enabled: true,
  featured: false,
  popular: true,

  inputs: [
    {
      name: 'title',
      label: 'Video Title',
      type: 'text',
      placeholder: 'e.g. How I Built a Profitable Micro-SaaS in 30 Days',
      required: true,
      maxLength: 200
    },
    {
      name: 'summary',
      label: 'Main Takeaways or Outline (Optional)',
      type: 'textarea',
      rows: 3,
      placeholder: 'Outline the main chapters or takeaways of your video...',
      required: false,
      maxLength: 1000
    },
    {
      name: 'includeTimestamps',
      label: 'Include Timestamp Placeholders',
      type: 'select',
      options: ['Yes (Include 00:00 Chapter Outline)', 'No'],
      default: 'Yes (Include 00:00 Chapter Outline)'
    }
  ],

  seo: {
    h1: 'YouTube Description & Chapters Generator Online',
    title: 'Free YouTube Description Generator • SEO Templates & Timestamps',
    metaDescription: 'Create SEO-optimized YouTube video descriptions with timestamps, key takeaways, and calls-to-action. Free AI description generator to boost search rankings.',
    keywords: ['youtube description generator', 'youtube video description maker', 'youtube seo description template', 'youtube chapter generator', 'youtube description maker']
  },

  useCases: [
    'Google Key Moments: Format chapter timestamps that enable Google Search to highlight key moments directly in SERPs.',
    'Video SEO Optimization: Seamlessly integrate primary and secondary keywords into the first 200 characters of description text.',
    'Channel Growth CTAs: Include clear subscribe links, social handles, and affiliate disclaimers formatted neatly.',
    'Podcast & Long-form Content: Summarize 30+ minute video discussions with clear chapter segments for audience retention.'
  ],

  faq: [
    {
      q: 'Why are the first 2-3 lines of a YouTube description so important?',
      a: 'The first 200 characters appear above the "Show More" fold on desktop and mobile. This snippet determines search snippet ranking and initial viewer click behavior.'
    },
    {
      q: 'Do timestamps help video rankings?',
      a: 'Yes, timestamps create chapters in the YouTube player and enable Google Search to show key moments directly in search results.'
    },
    {
      q: 'Can I include links and affiliate disclaimers?',
      a: 'Yes. The generated template reserves clean sections for your social media links, recommended gear, and FTC affiliate disclaimers.'
    },
    {
      q: 'How many keywords should I include in a video description?',
      a: 'Write naturally around 2-3 primary keywords. Avoid keyword stuffing or pasting tag lists, as YouTube penalizes artificial keyword spam.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'hashtag-generator', 'ai-text-generator']
};
