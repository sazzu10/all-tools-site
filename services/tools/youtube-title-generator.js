/**
 * YouTube Title Generator Service (AI-Powered with Local Heuristic Fallback)
 */
const { aiRouter } = require('../ai/ai-router');

const SYSTEM_PROMPT = `You are a world-class YouTube growth consultant and viral title copywriter with 10+ years optimizing click-through rates (CTR) for top YouTube creators.
Your job is to generate highly engaging, clickable, search-friendly titles that trigger curiosity, desire, or FOMO without being deceptive clickbait.
Rules:
1. Keep titles between 35 and 65 characters so they do not truncate on mobile screens.
2. Use emotional hooks, power words, and clean bracket tags like [Step-by-Step] or (2026 Guide).
3. Provide exactly the requested number of titles.
4. Output as a numbered list (1. 2. 3. ...), one title per line. Do NOT include extraneous conversational filler.`;

async function generateTitles({ topic, style = 'Curiosity & Hook', count = '10 Titles' }) {
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return { ok: false, error: 'Please enter a video topic or target keyword.' };
  }

  const cleanTopic = topic.trim();
  const numTitles = parseInt(count, 10) || 10;

  const userPrompt = `Generate exactly ${numTitles} high-CTR YouTube video titles for the topic: "${cleanTopic}".
Title Style Angle: ${style}.
Target Audience: Engaged YouTube viewers looking for high value and entertainment.
Return only the numbered list of titles.`;

  try {
    const aiResult = await aiRouter.generate({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.8
    });

    const parsedTitles = parseNumberedList(aiResult.content, numTitles);

    return {
      ok: true,
      topic: cleanTopic,
      style,
      count: parsedTitles.length,
      titles: parsedTitles,
      output: parsedTitles.map((t, idx) => `${idx + 1}. ${t}`).join('\n\n'),
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        executionTimeMs: aiResult.executionTimeMs,
        fallbacksAttempted: aiResult.fallbacksAttempted
      }
    };
  } catch (err) {
    // If all remote AI providers fail, provide algorithmic heuristic fallback
    console.warn(`[YouTubeTitleGenerator] AI failed (${err.message}). Using high-CTR template fallback.`);
    const fallbackTitles = generateFallbackTitles(cleanTopic, style, numTitles);
    return {
      ok: true,
      topic: cleanTopic,
      style,
      count: fallbackTitles.length,
      titles: fallbackTitles,
      output: fallbackTitles.map((t, idx) => `${idx + 1}. ${t}`).join('\n\n'),
      metadata: {
        provider: 'local-heuristic-engine',
        model: 'ctr-formula-v2',
        warning: `AI Router notice: ${err.message}. High-CTR formula templates provided.`
      }
    };
  }
}

function parseNumberedList(rawText, targetCount) {
  const lines = rawText.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^\d+[\.\)\-]\s*/, '').replace(/^["']|["']$/g, '').trim())
    .filter(line => line.length > 5 && !line.toLowerCase().startsWith('here are'));

  if (lines.length > 0) {
    return lines.slice(0, targetCount);
  }
  return [rawText.trim()];
}

function generateFallbackTitles(topic, style, count) {
  const templates = [
    `How I Mastered ${topic} in 30 Days (Step-by-Step)`,
    `The Truth About ${topic} Nobody Tells You`,
    `Stop Doing ${topic} Wrong in 2026!`,
    `I Tried ${topic} for 7 Days and This Happened...`,
    `10 Mistakes Beginners Make With ${topic} (And How to Fix Them)`,
    `The Ultimate Guide to ${topic} for Fast Growth`,
    `${topic}: Everything You Need to Know in 10 Minutes`,
    `Why Most People Fail at ${topic} (Secret Revealed)`,
    `Top 5 ${topic} Hacks That Actually Work`,
    `From Beginner to Pro: Complete ${topic} Roadmap`
  ];
  return templates.slice(0, count);
}

module.exports = {
  generateTitles
};
