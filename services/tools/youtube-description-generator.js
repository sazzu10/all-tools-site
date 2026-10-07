/**
 * YouTube Description Generator Service (AI-Powered with Local Heuristic Fallback)
 */
const { aiRouter } = require('../ai/ai-router');

const SYSTEM_PROMPT = `You are an expert YouTube SEO optimizer and video metadata strategist.
Create comprehensive, high-retention video descriptions designed to maximize search visibility, click-through rate, and viewer engagement.
Structure the description cleanly with:
1. First 2 lines: Powerful hook summarizing the video's primary transformation or value.
2. Overview & Key Takeaways: 3-4 bullet points of what viewers will learn.
3. Chapters / Timestamps (starting at 00:00).
4. Resources / Links placeholder.
5. Call to action.
6. 3-5 relevant hashtags at the bottom.`;

async function generateDescription({ title, summary = '', includeTimestamps = 'Yes (Include 00:00 Chapter Outline)' }) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    return { ok: false, error: 'Please enter a video title.' };
  }

  const cleanTitle = title.trim();
  const cleanSummary = summary.trim();
  const withTimestamps = !includeTimestamps.toLowerCase().includes('no');

  const userPrompt = `Create an SEO-optimized YouTube video description for:
Video Title: "${cleanTitle}"
${cleanSummary ? `Video Context / Key Points: "${cleanSummary}"` : ''}
Include Chapters: ${withTimestamps ? 'Yes, provide a realistic 4-6 chapter breakdown starting at 00:00' : 'No'}
Make it ready to copy and paste into YouTube Studio.`;

  try {
    const aiResult = await aiRouter.generate({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7
    });

    return {
      ok: true,
      title: cleanTitle,
      output: aiResult.content.trim(),
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        executionTimeMs: aiResult.executionTimeMs,
        fallbacksAttempted: aiResult.fallbacksAttempted
      }
    };
  } catch (err) {
    console.warn(`[YouTubeDescGenerator] AI failed (${err.message}). Using structured template fallback.`);
    const fallbackDesc = buildFallbackDescription(cleanTitle, cleanSummary, withTimestamps);
    return {
      ok: true,
      title: cleanTitle,
      output: fallbackDesc,
      metadata: {
        provider: 'local-heuristic-engine',
        model: 'seo-description-v1',
        warning: `AI Router notice: ${err.message}. High-retention SEO template provided.`
      }
    };
  }
}

function buildFallbackDescription(title, summary, withTimestamps) {
  let text = `In this video, you'll discover everything you need to know about ${title}.\n\n`;

  if (summary) {
    text += `Key Takeaways:\n${summary}\n\n`;
  } else {
    text += `✨ In this video:\n• Proven step-by-step strategies that actually work\n• Common pitfalls to avoid\n• Practical examples and actionable takeaways\n\n`;
  }

  if (withTimestamps) {
    text += `⏱️ TIMESTAMPS:\n00:00 - Introduction & Overview\n01:15 - Key Concepts Explained\n03:40 - Step-by-Step Breakdown\n06:20 - Pro Tips & Mistakes to Avoid\n08:50 - Final Thoughts & Next Steps\n\n`;
  }

  text += `🔔 Subscribe for more actionable tutorials and guides!\n💬 Have questions? Drop a comment below and let us know what you think.\n\n`;
  text += `🔗 USEFUL LINKS & RESOURCES:\nWebsite: https://example.com\nConnect: @YourHandle\n\n`;

  const tags = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 3).slice(0, 4);
  text += `#${tags.join(' #')} #Tutorial #LearnOnline`;

  return text;
}

module.exports = {
  generateDescription
};
