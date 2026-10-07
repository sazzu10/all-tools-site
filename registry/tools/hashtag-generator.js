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
    h1: 'Trending Hashtag Generator for Social Media',
    title: 'Free Hashtag Generator • Trending Instagram, TikTok & YouTube Tags',
    metaDescription: 'Generate targeted, trending hashtags for Instagram Reels, TikTok, YouTube Shorts, and Twitter/X. Maximize organic reach and engagement with free AI tags.',
    keywords: ['hashtag generator', 'instagram hashtag generator', 'tiktok hashtag finder', 'youtube shorts hashtags', 'trending hashtags', 'hashtag generator online']
  },

  useCases: [
    'Instagram Reels Discovery: Identify low-competition and medium-reach niche hashtags that categorize your short-form videos.',
    'YouTube Shorts Optimization: Select 3 to 5 targeted tags to help the Shorts algorithm categorize your content in topic feeds.',
    'TikTok FYP Visibility: Combine broad trending hashtags with micro-niche community tags to trigger the For You page.',
    'Cross-Platform Campaigns: Generate coordinated hashtag bundles for product launches across LinkedIn, Twitter/X, and Instagram.'
  ],

  faq: [
    {
      q: 'How many hashtags should I use on Instagram Reels in 2026?',
      a: 'Current algorithmic best practices recommend 3 to 8 highly specific niche hashtags rather than spamming 30 broad tags.'
    },
    {
      q: 'Do hashtags still matter for social media reach?',
      a: 'Yes. Algorithms use hashtags as topic classification signals to identify the exact target audience and recommend your content to interested users.'
    },
    {
      q: 'Can I generate hashtags for different platforms?',
      a: 'Yes. You can customize tags specifically for Instagram Reels, YouTube Shorts, TikTok, Twitter/X, or LinkedIn.'
    },
    {
      q: 'Are the generated hashtags ready to copy and paste?',
      a: 'Yes. Click the "Copy" button to copy the entire hashtag bundle with one click directly to your clipboard.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'youtube-description-generator', 'ai-text-generator']
};
