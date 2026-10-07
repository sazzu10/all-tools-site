module.exports = {
  id: 'hashtag-generator',
  slug: 'hashtag-generator',
  name: 'Hashtag Generator',
  category: 'creator-tools',
  badges: ['Social', 'Growth'],
  icon: 'fa-solid fa-hashtag',
  description: 'Generate high-reach, niche-targeted hashtags for YouTube Shorts, Instagram Reels, TikTok, and Twitter/X.',
  processingType: 'ai',
  outputType: 'text',
  enabled: true,
  featured: false,
  popular: true,

  inputs: [
    {
      name: 'keyword',
      label: 'Topic, Niche, or Keywords',
      type: 'text',
      placeholder: 'e.g. digital marketing, street workout, handmade pottery...',
      required: true,
      maxLength: 200
    },
    {
      name: 'platform',
      label: 'Target Platform',
      type: 'select',
      options: ['Instagram Reels / Posts', 'YouTube Shorts', 'TikTok', 'Twitter / X', 'LinkedIn'],
      default: 'Instagram Reels / Posts'
    },
    {
      name: 'density',
      label: 'Hashtag Quantity',
      type: 'select',
      options: ['5-8 Focused Tags', '10-15 Mixed Reach Tags', '20-30 Maximum Tags'],
      default: '10-15 Mixed Reach Tags'
    }
  ],

  seo: {
    title: 'Free Hashtag Generator • Viral Instagram, TikTok & YouTube Tags',
    metaDescription: 'Find trending and relevant hashtags for Instagram, TikTok, and YouTube Shorts. Boost reach and engagement with free AI hashtag generation.',
    keywords: ['hashtag generator', 'instagram hashtag generator', 'tiktok hashtag finder', 'youtube shorts hashtags', 'trending hashtags']
  },

  faq: [
    {
      q: 'How many hashtags should I use on Instagram Reels?',
      a: 'Modern recommendation is 3 to 10 highly relevant niche tags rather than 30 generic tags. The algorithm categorizes your content more accurately when tags are specific.'
    },
    {
      q: 'Do hashtags work on YouTube Shorts?',
      a: 'Yes, adding 2 to 4 niche hashtags in the Shorts title or description helps YouTube classify your video in the Shorts recommendation feed.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'youtube-description-generator', 'ai-text-generator']
};
