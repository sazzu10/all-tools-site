module.exports = {
  id: 'ai-text-generator',
  slug: 'ai-text-generator',
  name: 'AI Text Generator',
  category: 'ai-tools',
  badges: ['AI', 'Popular'],
  icon: 'fa-solid fa-wand-magic-sparkles',
  description: 'Generate high-quality paragraphs, creative stories, outlines, or marketing copy from a simple prompt.',
  processingType: 'ai',
  outputType: 'text',
  enabled: true,
  featured: true,
  popular: true,

  inputs: [
    {
      name: 'prompt',
      label: 'Topic or Prompt',
      type: 'textarea',
      rows: 4,
      placeholder: 'Describe what you want the AI to write about...',
      required: true,
      maxLength: 1000
    },
    {
      name: 'format',
      label: 'Output Format',
      type: 'select',
      options: ['Paragraph', 'Bullet Points', 'Essay Outline', 'Creative Story', 'Social Post'],
      default: 'Paragraph'
    },
    {
      name: 'tone',
      label: 'Writing Tone',
      type: 'select',
      options: ['Engaging', 'Professional', 'Casual', 'Persuasive', 'Humorous'],
      default: 'Engaging'
    }
  ],

  seo: {
    title: 'Free AI Text Generator • Fast Online Writing Assistant',
    metaDescription: 'Generate creative writing, blog outlines, professional emails, and copywriting instantly with our free AI text generator.',
    keywords: ['ai text generator', 'free ai writer', 'ai essay generator', 'paragraph generator', 'ai copywriting tool']
  },

  faq: [
    {
      q: 'How does the AI Text Generator work?',
      a: 'It uses advanced large language models to understand your prompt, context, and selected tone, generating cohesive and natural human-like text.'
    },
    {
      q: 'Can I use the generated text for commercial projects?',
      a: 'Yes, all text generated through this tool is free for personal and commercial use.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'youtube-description-generator', 'hashtag-generator']
};
