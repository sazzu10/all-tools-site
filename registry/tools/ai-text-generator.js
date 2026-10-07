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
    h1: 'Free AI Text Generator & Writing Assistant Online',
    title: 'Free AI Text Generator • Fast Online AI Writing Assistant',
    metaDescription: 'Generate creative paragraphs, essays, blog outlines, professional emails, and marketing copy online. Free, fast AI writing assistant with multiple tone options.',
    keywords: ['ai text generator', 'free ai writer', 'ai essay generator', 'paragraph generator', 'ai copywriting tool', 'online ai writer']
  },

  useCases: [
    'Content Brainstorming: Generate creative angles, article outlines, and blog post intros when facing writer\'s block.',
    'Professional Communication: Draft polite client emails, project update summaries, and professional follow-ups.',
    'Marketing Copywriting: Create engaging social media captions, product bullet points, and ad headline variations.',
    'Academic & Explanatory Outlines: Break down complex topics into structured outlines and easy-to-read explanatory paragraphs.'
  ],

  faq: [
    {
      q: 'How does the AI Text Generator produce content?',
      a: 'It processes your prompt through state-of-the-art large language models to generate cohesive, context-aware text matching your chosen tone and format.'
    },
    {
      q: 'Is there any cost or subscription fee?',
      a: 'No. The AI Text Generator is completely free with zero sign-up, subscription, or credit card requirements.'
    },
    {
      q: 'Can I choose different writing tones and formats?',
      a: 'Yes. You can select Paragraph, Bullet Points, Essay Outline, Creative Story, or Social Post, paired with Engaging, Professional, Casual, Persuasive, or Humorous tones.'
    },
    {
      q: 'Can I use the generated text for commercial projects?',
      a: 'Yes, all text generated through this tool is free for personal, educational, and commercial use.'
    }
  ],

  relatedTools: ['youtube-title-generator', 'youtube-description-generator', 'hashtag-generator']
};
