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
    title: 'Free YouTube Description Generator • SEO Video Descriptions',
    metaDescription: 'Create high-ranking YouTube video descriptions with timestamps, social links, and targeted keywords. Free AI generator.',
    keywords: ['youtube description generator', 'youtube video description maker', 'youtube seo description template', 'youtube chapter generator']
  },

  faq: [
    {
      q: 'How long should a YouTube description be?',
      a: 'The first 200 characters are the most crucial because they appear above the "Show More" fold. The full description can be up to 5,000 characters to provide helpful context and keyword signals.'
    },
    {
      q: 'Do timestamps help video rankings?',
      a: 'Yes, timestamps create chapters in the YouTube player and enable Google Search to show key moments directly in search results.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'hashtag-generator', 'ai-text-generator']
};
