/**
 * Hashtag Generator Service (AI-Powered with Local Semantic Clustering Fallback)
 */
const { aiRouter } = require('../ai/ai-router');

const SYSTEM_PROMPT = `You are a social media algorithm specialist who analyzes hashtag trends across Instagram Reels, TikTok, YouTube Shorts, and Twitter/X.
Your task is to generate relevant, high-performing, non-spammy hashtags for a given topic and target platform.
Rules:
1. Every tag must begin with '#' followed by alphanumeric characters only (no spaces, punctuation, or special symbols).
2. Balance high-volume broad tags with low-competition niche tags for optimal organic discovery.
3. Separate each tag with a single space.
4. Output ONLY the hashtags. Do not include introductory or concluding conversational text.`;

async function generateHashtags({ keyword, platform = 'Instagram Reels / Posts', density = '10-15 Mixed Reach Tags' }) {
  if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
    return { ok: false, error: 'Please enter a topic, niche, or keyword.' };
  }

  const cleanKeyword = keyword.trim();
  let countTarget = 12;
  if (density.includes('5-8') || density.includes('Focused')) countTarget = 7;
  else if (density.includes('20-30') || density.includes('Maximum')) countTarget = 25;

  const userPrompt = `Generate exactly ${countTarget} high-performing, unique hashtags for:
Topic / Niche: "${cleanKeyword}"
Target Platform: ${platform}
Hashtag Strategy: Mix of broad industry tags and specific targeted niche keywords.
Return only the space-separated list of hashtags.`;

  try {
    const aiResult = await aiRouter.generate({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7
    });

    const parsedTags = extractHashtags(aiResult.content, countTarget);

    if (parsedTags.length < 3) {
      throw new Error('AI returned insufficient hashtags');
    }

    return {
      ok: true,
      keyword: cleanKeyword,
      platform,
      count: parsedTags.length,
      tags: parsedTags,
      output: parsedTags.join(' '),
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        executionTimeMs: aiResult.executionTimeMs,
        fallbacksAttempted: aiResult.fallbacksAttempted
      }
    };
  } catch (err) {
    console.warn(`[HashtagGenerator] AI failed (${err.message}). Using local semantic clustering fallback.`);
    const fallbackTags = generateFallbackHashtags(cleanKeyword, platform, countTarget);
    return {
      ok: true,
      keyword: cleanKeyword,
      platform,
      count: fallbackTags.length,
      tags: fallbackTags,
      output: fallbackTags.join(' '),
      metadata: {
        provider: 'local-semantic-engine',
        model: 'hashtag-cluster-v2',
        warning: `AI Router notice: ${err.message}. Algorithmic niche cluster tags provided.`
      }
    };
  }
}

function extractHashtags(text, maxCount) {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const unique = Array.from(new Set(matches.filter(t => t.length > 2).map(t => t.toLowerCase())));
  return unique.slice(0, maxCount);
}

function generateFallbackHashtags(keyword, platform, count) {
  // Clean possessives first (e.g. women's -> women)
  const cleaned = keyword.replace(/['’]s\b/gi, '');
  const sanitized = cleaned.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 1);
  const baseTag = sanitized.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  const platformModifiers = {
    'Instagram Reels / Posts': ['Reels', 'ReelsViral', 'InstaDaily', 'ExplorePage', 'TrendingNow'],
    'YouTube Shorts': ['Shorts', 'YouTubeShorts', 'ShortsFeed', 'ViralShorts', 'Subscribe'],
    'TikTok': ['TikTokViral', 'FYP', 'ForYouPage', 'Trending', 'ViralVideo'],
    'Twitter / X': ['Trending', 'Breaking', 'DailyUpdate', 'Community', 'Thread'],
    'LinkedIn': ['Leadership', 'Growth', 'Innovation', 'Careers', 'Success']
  };

  const modifiers = platformModifiers[platform] || platformModifiers['Instagram Reels / Posts'];
  const results = new Set();

  if (baseTag) results.add(`#${baseTag}`);
  sanitized.filter(w => w.length > 2).forEach(w => results.add(`#${w.charAt(0).toUpperCase() + w.slice(1)}`));
  modifiers.forEach(m => {
    results.add(`#${baseTag}${m}`);
    results.add(`#${m}`);
  });

  const generalGrowth = ['Tips', 'Hacks', 'Tutorial', 'Daily', 'Inspiration', 'Guide'];
  generalGrowth.forEach(g => results.add(`#${baseTag}${g}`));

  return Array.from(results).slice(0, count);
}

module.exports = {
  generateHashtags
};
